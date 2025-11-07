import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

// --- START: Reusable Input Component ---
function Input({
  label,
  name,
  type = "text",
  value,
  onChange,

  placeholder,
  readOnly = false,
}: any) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={name}
        className="text-sm font-medium text-[var(--primary-text)] "
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        readOnly={readOnly}
        onChange={onChange}
        placeholder={placeholder}
        className="border border-[var(--border)] rounded-lg px-3 py-2 focus:outline-none focus:border-violet-500"
      />
    </div>
  );
}
// --- END: Reusable Input Component ---

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    bio: "",
    profilePic: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load from API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user?.token) return;
        setIsLoading(true);
        const res = await fetch("http://localhost:3000/profile/info", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (res.status === 401) {
          logout();
          navigate("/login");
          return;
        }
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.message || "Failed to load profile");
        }
        const data = await res.json();
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          password: "",
          role: data.role || "",
          bio: data.bio || "",
          profilePic: data.profilePic || "",
        });
      } catch (err: any) {
        toast.error(err.message || "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [user?.token]);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  // Handle profile picture upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profilePic: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Delete profile picture
  const handleDeletePic = () => {
    setFormData((prev) => ({ ...prev, profilePic: "" }));
  };

  const handleSave = async () => {
    try {
      if (!user?.token) {
        toast.error("Not authenticated");
        return;
      }
      setIsSaving(true);
      const formDataToSend = new FormData();
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("role", formData.role);
      formDataToSend.append("bio", formData.bio);
      if (profilePicFile) {
        formDataToSend.append("profilePic", profilePicFile);
      }
      const res = await fetch("http://localhost:3000/profile/update", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formDataToSend,
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        logout();
        navigate("/login");
        return;
      }
      if (!res.ok) throw new Error(data?.message || "Failed to save profile");

      // Optionally update local cached user profile for display elsewhere
      const existing = JSON.parse(localStorage.getItem("authUser") || "null");
      if (existing) {
        const safeUser = { ...existing, ...data.user };
        delete safeUser.profilePic;
        localStorage.setItem("authUser", JSON.stringify(safeUser));
      }

      toast.success("Profile saved successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };
  const handleCancel = async () => {
    try {
      if (!user?.token) {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          role: "",
          bio: "",
          profilePic: "",
        });
        toast.info("Not authenticated");
        return;
      }
      const res = await fetch("http://localhost:3000/profile/info", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (res.status === 401) {
        logout();
        navigate("/login");
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Failed to reload profile");
      }
      const data = await res.json();
      setFormData({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        password: "",
        role: data.role || "",
        bio: data.bio || "",
        profilePic: data.profilePic || "",
      });
      toast.info("Changes reverted");
    } catch (err: any) {
      toast.error(err.message || "Failed to reload profile");
    }
  };

  return (
    <form className="m-4 border border-(--border) rounded-2xl p-6 space-y-6 bg-[var(--cards-bg)] ">
      {/* Title */}
      <div>
        <p className="text-xl font-semibold ">Profile</p>
        <p className="text-sm text-[var(--light-text)] ">
          Update your personal information and profile details
        </p>
      </div>

      {/* Profile photo */}
      <div className="flex items-center gap-4">
        {formData.profilePic ? (
          <img
            src={formData.profilePic}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-[var(--border)] shadow-md object-cover"
          />
        ) : (
          <span
            className="w-24 h-24  border-4 border-[var(--border)] rounded-full shadow-md flex items-center justify-center text-white text-xl font-semibold"
            style={{ backgroundColor: "var(--accent-color)" }}
          >
            {formData.firstName
              ? formData.firstName[0].toUpperCase() +
                (formData.lastName ? formData.lastName[0].toUpperCase() : "")
              : "?"}
          </span>
        )}

        <div className="flex flex-col gap-2">
          <label
            htmlFor="profilePic"
            style={{ backgroundColor: "var(--accent-color)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                "var(--accent-btn-hover-color)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--accent-color)")
            }
            className=" px-3 py-1.5 rounded text-white text-sm transition cursor-pointer text-center"
          >
            Change Picture
            <input
              type="file"
              id="profilePic"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
          {formData.profilePic && (
            <button
              type="button"
              onClick={handleDeletePic}
              className="border border-[var(--border)] hover:bg-[var(--hover-bg)] px-3 py-1.5 rounded text-sm transition"
            >
              Delete Picture
            </button>
          )}
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="Hamna"
        />
        <Input
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Liaquat"
        />
        <Input
          label="Email"
          name="email"
          type="email"
          readOnly={true} // Email is read-only here and must be changed in the Account component
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
        />

        {/* Password (Read-Only) */}
        <div className="flex flex-col gap-1 relative">
          <label
            htmlFor="password"
            className="text-sm font-medium text-[var(--light-text)] "
          >
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              readOnly={true}
              value={formData.password}
              onChange={handleChange}
              placeholder="•••••••"
              className="border border-[var(--border)] rounded-lg px-3 py-2 w-full focus:outline-none focus:border-[var(--accent-color)] pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center text-[var(--light-text)] cursor-pointer hover:text-[var(--accent-color)]"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <Input
          label="Profession"
          name="role"
          value={formData.role}
          onChange={handleChange}
          placeholder="Full Stack Developer"
        />
      </div>

      {/* Bio */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor="bio"
          className="text-sm font-medium text-[var(--primary-text)] "
        >
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={4}
          placeholder="Write something about yourself..."
          className="border border-[var(--border)] rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-[var(--accent-color)] "
        ></textarea>
      </div>

      {/* Buttons */}
      <div className="pt-2 flex justify-end gap-3 ">
        <button
          type="button"
          onClick={handleCancel}
          disabled={isLoading || isSaving}
          className="w-full sm:w-auto border border-[var(--border)] hover:bg-[var(--hover-bg)] cursor-pointer px-6 py-2.5 rounded-lg font-medium transition"
        >
          {isLoading ? "Loading..." : "Cancel"}
        </button>
        <button
          type="button"
          onClick={handleSave}
          style={{ backgroundColor: "var(--accent-color)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor =
              "var(--accent-btn-hover-color)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--accent-color)")
          }
          disabled={isSaving || isLoading}
          className="w-full sm:w-auto  text-white px-6 py-2 rounded-lg cursor-pointer font-medium transition"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
