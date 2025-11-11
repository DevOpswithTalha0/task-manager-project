export default function PricingPlan() {
  const plans = [
    {
      name: "Essential",
      price: "$9/mo",
      tagline: "Perfect for freelancers",
      features: [
        "Unlimited tasks & projects",
        "Basic collaboration tools",
        "Email support",
        "Access on all devices",
      ],
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$19/mo",
      tagline: "Best for small teams",
      features: [
        "Everything in Essential",
        "Advanced collaboration",
        "File sharing & attachments",
        "Priority support",
      ],
      highlighted: true,
    },
    {
      name: "Team",
      price: "$49/mo",
      tagline: "For growing companies",
      features: [
        "Everything in Pro",
        "Team analytics",
        "Custom integrations",
        "Dedicated support",
      ],
      highlighted: false,
    },
  ];

  return (
    <section
      id="pricing"
      className="mt-2 py-16 px-6 sm:px-10 lg:px-20  bg-violet-50  w-[100%] mx-auto"
    >
      {/* Section Heading */}
      <div className="text-center mb-16">
        <p className="inline-block px-4 py-2 mb-4 border border-gray-300 text-violet-500 rounded-full text-sm font-medium">
          Pricing
        </p>
        <p className="text-4xl sm:text-5xl font-medium text-black mb-3">
          Flexible Plans for Every Team Size
        </p>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Whether you’re a solo creator or managing a full team, PlanOra scales
          with your ambitions.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`flex flex-col p-8 rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-lg hover:-translate-y-2 ${
              plan.highlighted
                ? "border-violet-500 bg-white ring-2 ring-violet-200"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="mb-4">
              <p className="text-sm font-semibold text-violet-600 uppercase tracking-wide">
                {plan.name}
              </p>
              <h1 className="text-4xl font-bold mt-2 text-gray-900">
                {plan.price}
              </h1>
              <p className="text-gray-600 mt-1">{plan.tagline}</p>
            </div>

            {/* Features */}
            <ul className="flex-1 space-y-3 mt-6 mb-8">
              {plan.features.map((feature, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-gray-700 text-base"
                >
                  <span className="text-violet-600">✔</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* Button */}
            <button
              className={`w-full py-3 rounded-lg font-semibold text-base transition-all duration-300 cursor-pointer ${
                plan.highlighted
                  ? "bg-violet-600 text-white hover:bg-violet-700"
                  : "bg-gray-100 text-gray-900 hover:bg-gray-200"
              }`}
            >
              {plan.highlighted ? "Get Started" : "Select Plan"}
            </button>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <p className="text-center text-gray-500 text-sm mt-12">
        💡 Cancel anytime. No hidden fees. Upgrade or downgrade anytime.
      </p>
    </section>
  );
}
