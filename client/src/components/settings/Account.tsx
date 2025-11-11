import { useEffect, useState, type ChangeEvent } from "react";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const API_BASE_URL = "http://localhost:3000";

export default function Account() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuth();
  // State to hold the current user data and form inputs
  const [formData, setFormData] = useState({
    // 'email' holds the *current* email, fetched from the backend.
    email: "",
    // The rest are input fields.
    newEmail: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Helper function to get the auth header
  const getAuthHeader = () => {
    const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");
    return { Authorization: `Bearer ${authUser.token}` };
  };

  /**
   * Fetches user info from the backend and updates the 'email' state.
   */
  const fetchUserInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/user/info`, {
        headers: getAuthHeader(),
      });
      // Assuming res.data contains { email: "user@example.com" }
      setFormData((prev) => ({ ...prev, email: res.data.email }));
    } catch (err) {
      console.error("Error fetching user info:", err);
      setError("Failed to load user information.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sends updated user info (email/password) to the backend.
   */
  const UpdateUserInfo = async () => {
    // 1. Basic client-side validation for password change
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        toast.error("Please enter your current password to change it.");
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("New password and confirmation password do not match.");
        return;
      }
    }

    setLoading(true);
    setError(null);

    // Prepare the data to send to the server
    const updateData = {
      newEmail: formData.newEmail || undefined,
      currentPassword: formData.currentPassword || undefined,
      newPassword: formData.newPassword || undefined,
    };

    try {
      // Send the update request
      const res = await axios.put(`${API_BASE_URL}/user/update`, updateData, {
        headers: getAuthHeader(),
      });

      // Assuming the API returns the updated user data (including the new email)
      const newEmail = res.data.email || formData.email;

      // Update local state with the new email and clear input fields
      setFormData((prev) => ({
        ...prev,
        email: newEmail,
        newEmail: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

      toast.info("Account details updated successfully!");
    } catch (err: any) {
      console.error("Error updating user info:", err);
      // Display a more meaningful error from the API if available
      setError(
        err.response?.data?.message ||
          "Failed to save changes. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Deletes the user account on the backend.
   * NOTE: In a real app, this should usually involve a confirmation modal.
   */
  const DeleteUser = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action is irreversible."
      )
    ) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await axios.delete(`${API_BASE_URL}/user/delete`, {
        headers: getAuthHeader(),
      });

      // ✅ Clear user data and token from localStorage
      localStorage.removeItem("authUser");

      toast.info("Your account has been successfully deleted.");
      logout();

      // ✅ Redirect to register page after a short delay
      setTimeout(() => {
        navigate("/register");
      }, 1200);
    } catch (err: any) {
      console.error("Error deleting user:", err);
      setError(
        err.response?.data?.message ||
          "Failed to delete account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  // Handle input changes (used for all input fields)
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Attach UpdateUserInfo to handleSave
  const handleSave = () => {
    UpdateUserInfo();
  };

  // Handle Cancel (reset only the input fields)
  const handleCancel = () => {
    // Reset all input fields to empty strings
    setFormData((prev) => ({
      ...prev,
      newEmail: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
    alert("Changes cancelled and form fields reset.");
  };

  // Helper array for cleaner password field rendering and binding
  const passwordFields = [
    {
      label: "Current Password",
      name: "currentPassword",
      state: showPassword,
      setState: setShowPassword,
      value: formData.currentPassword,
      placeholder: "Enter current password...",
    },
    {
      label: "New Password",
      name: "newPassword",
      state: showNewPassword,
      setState: setShowNewPassword,
      value: formData.newPassword,
      placeholder: "Enter new password...",
    },
    {
      label: "Confirm New Password",
      name: "confirmPassword",
      state: showConfirmPassword,
      setState: setShowConfirmPassword,
      value: formData.confirmPassword,
      placeholder: "Re-enter new password...",
    },
  ];

  // Disable save when no inputs have changed
  const hasChanges = Boolean(
    formData.newEmail ||
      formData.currentPassword ||
      formData.newPassword ||
      formData.confirmPassword
  );

  if (loading && formData.email === "") {
    return (
      <div className="m-4 p-6 text-center text-[var(--light-text)]">
        Loading user data...
      </div>
    );
  }

  return (
    <div className="m-4 border border-[var(--border)] rounded-2xl p-6 bg-[var(--cards-bg)] space-y-10 shadow-sm">
      {/* Header */}
      <div className="">
        <p className="text-xl font-semibold ">Account</p>
        <p className="text-sm text-[var(--light-text)]">
          Update your personal information and security details.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Change Email Section */}
      <section className="space-y-4">
        <p className=" text-lg font-medium border-b border-[var(--border)] pb-2 ">
          Change Email
        </p>

        <p className="text-[var(--light-text)]">
          Your current email is{" "}
          <span className="font-medium">{formData.email || "N/A"}</span>
        </p>

        <div className="flex flex-col sm:w-1/2">
          <label
            htmlFor="newEmail"
            className="block text-sm font-medium text-[var(--light-text)] mb-1"
          >
            New Email Address
          </label>
          <input
            type="email"
            id="newEmail"
            name="newEmail" // Match state key
            value={formData.newEmail} // Bind value
            onChange={handleChange} // Attach handler
            placeholder="Enter new email..."
            className="border border-[var(--border)] rounded-lg px-3 py-2 focus:outline-none focus:border-violet-500 bg-[var(--inside-card-bg)] text-[var(--text-primary)]"
            disabled={loading}
          />
        </div>
      </section>

      {/* --- */}

      {/* Change Password Section */}
      <section className="space-y-5">
        <p className="text-lg font-medium border-b border-[var(--border)] pb-2 ">
          Change Password
        </p>
        {/* Password Fields */}
        {passwordFields.map((field, i) => (
          <div key={i} className="flex flex-col sm:w-1/2">
            <label
              htmlFor={field.name}
              className="block text-sm font-medium  mb-1"
            >
              {field.label}
            </label>
            <div className="relative">
              <input
                type={field.state ? "text" : "password"}
                id={field.name}
                name={field.name} // Map name to state key
                value={field.value} // Bind value to state
                onChange={handleChange} // Attach handler
                placeholder={field.placeholder}
                className="w-full border border-[var(--border)] rounded-lg px-3 py-2 pr-10 focus:outline-none focus:border-violet-500 bg-[var(--inside-card-bg)] text-[var(--text-primary)]"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => field.setState((prev) => !prev)}
                className="absolute cursor-pointer right-3 top-2.5 text-[var(--light-text)] hover:text-gray-700"
                disabled={loading}
              >
                {field.state ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* --- */}

      {/* Delete Account */}
      <section className="space-y-3">
        <p className=" font-medium border-b text-lg border-[var(--border)] pb-2 ">
          Delete Account
        </p>
        <p className="text-[var(--light-text)]">
          Once you delete your account, there's{" "}
          <span className="font-semibold text-[var(--high-priority-color)]">
            no going back
          </span>
          . Please be certain.
        </p>
        <button
          type="button"
          onClick={DeleteUser} // Call the API function
          className="flex items-center gap-2 text-[var(--high-priority-color)] hover:text-white border border-red-500 cursor-pointer hover:bg-red-500 transition rounded-lg px-4 py-2 font-medium w-fit disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          <Trash2 size={16} />
          {loading ? "Deleting..." : "Delete your account"}
        </button>
      </section>

      {/* --- */}

      {/* Footer Buttons */}
      <div className="pt-6 flex justify-end gap-3 border-t border-[var(--border)]">
        <button
          type="button"
          className="w-full sm:w-auto border border-[var(--border)] hover:bg-[var(--hover-bg)] px-6 py-2.5 cursor-pointer rounded-lg font-medium transition disabled:opacity-50"
          onClick={handleCancel}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="button"
          className="w-full sm:w-auto  text-white px-6 py-2.5 rounded-lg cursor-pointer font-medium transition disabled:opacity-50 disabled:bg-violet-400"
          style={{ backgroundColor: "var(--accent-color)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor =
              "var(--accent-btn-hover-color)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--accent-color)")
          }
          onClick={handleSave}
          disabled={loading || !hasChanges}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
