import growth from "../../assets/features/growth.jpg";
import habits from "../../assets/features/habits.jpg";
import organized from "../../assets/features/organized.jpg";

export default function WhyChooseUs() {
  const reasons = [
    {
      title: "Stay Organized Effortlessly",
      desc: "Keep all your goals, to-dos, and projects in one simple dashboard that keeps you focused and stress-free.",
      image: organized,
    },
    {
      title: "Build Better Habits",
      desc: "Track your daily progress, set priorities, and stay consistent with reminders that actually help you follow through.",
      image: habits,
    },
    {
      title: "See Your Growth",
      desc: "Visualize your productivity over time with progress charts and milestones that keep you motivated every step of the way.",
      image: growth,
    },
  ];

  return (
    <section className="pt-15 mt-10  bg-violet-50 py-18 px-6 sm:px-10 lg:px-20">
      {/* Heading */}
      <div className="text-center mb-14">
        <p className="inline-block px-4 py-2 mb-4 border border-gray-300 text-violet-500 rounded-full text-sm font-medium">
          Why Choose Us
        </p>
        <p className="text-4xl sm:text-5xl font-medium text-black mb-3">
          Make Your Goals Happen
        </p>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Simple, powerful, and built to help you stay consistent, motivated,
          and organized every single day.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {reasons.map((item, index) => (
          <div
            key={index}
            className="group bg-white border border-violet-100 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
          >
            {/* Image */}
            <div className="overflow-hidden rounded-t-2xl">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
