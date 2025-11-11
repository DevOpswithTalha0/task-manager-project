const reviews = [
  {
    id: 1,
    name: "Aisha Khan",
    title: "Product Manager — Nova Labs",
    avatarBg: "bg-violet-500",
    rating: 5,
    text: "PlanOra completely changed how our team plans sprints. Tasks are clear, priorities are visible, and our delivery speed improved noticeably.",
  },
  {
    id: 2,
    name: "Omar Rizvi",
    title: "Freelance Designer",
    avatarBg: "bg-violet-500",
    rating: 5,
    text: "I switched to PlanOra from a dozen scattered tools  now I manage client work, deadlines, and feedback all in one place. Super intuitive.",
  },
  {
    id: 3,
    name: "Umar Sheikh",
    title: "Engineering Lead — BrightApps",
    avatarBg: "bg-violet-500",
    rating: 4,
    text: "The project boards and progress views keep our team aligned. The interface is clean and fast exactly what we needed.",
  },
  {
    id: 4,
    name: "Laila Ahmed",
    title: "Operations Manager — CoreLink",
    avatarBg: "bg-violet-500",
    rating: 5,
    text: "Assigning tasks and tracking completion is a breeze. PlanOra reduced our meeting time and helped us focus on actual work.",
  },
  {
    id: 5,
    name: "Maya Ali",
    title: "Content Strategist — Flow Agency",
    avatarBg: "bg-violet-500",
    rating: 5,
    text: "The clean dashboard and analytics make tracking goals effortless. I love how everything stays synced between my phone and laptop.",
  },
  {
    id: 6,
    name: "Hassan Javed",
    title: "CTO — Insight Systems",
    avatarBg: "bg-violet-500",
    rating: 4,
    text: "PlanOra fits perfectly into our workflow  we’ve replaced multiple tools with this single app and never looked back.",
  },
];

export default function Reviews() {
  return (
    <section className="py-20 px-6 sm:px-10 lg:px-24 ">
      {/* Section Heading */}
      <div className="max-w-5xl mx-auto text-center mb-14">
        <p className="inline-block px-4 py-2 mb-4 border border-gray-300 text-violet-600 rounded-full text-sm font-medium">
          Testimonials
        </p>
        <p className="text-4xl md:text-5xl font-medium text-black mb-3">
          Loved by Teams
        </p>
        <p className="text-4xl md:text-5xl font-medium text-black mb-3">
          Who Get Things Done
        </p>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Real feedback from professionals who’ve streamlined their work with
          Planora.
        </p>
      </div>

      {/* Reviews Grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {reviews.map((r) => (
          <blockquote
            key={r.id}
            className="flex flex-col justify-between bg-violet-50 rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div>
              {/* Avatar + Info */}
              <div className="flex items-center gap-3 mb-5">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full text-white text-lg font-semibold ${r.avatarBg}`}
                >
                  {r.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">{r.name}</p>
                  <p className="text-sm text-gray-500">{r.title}</p>
                </div>
              </div>

              {/* Review Text */}
              <p className="text-gray-700 leading-relaxed mb-4">“{r.text}”</p>
            </div>

            {/* Rating & Footer */}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill={i < r.rating ? "currentColor" : "none"}
                    stroke="currentColor"
                    className={`w-5 h-5 ${
                      i < r.rating ? "text-amber-400" : "text-gray-300"
                    }`}
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.286 3.97c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.176 0L5.18 17.96c-.784.57-1.838-.197-1.539-1.118l1.286-3.97a1 1 0 00-.364-1.118L1.183 8.2c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.97z" />
                  </svg>
                ))}
              </div>

              <span className="text-sm text-gray-500">Verified user</span>
            </div>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
