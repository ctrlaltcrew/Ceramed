import { Lightbulb, Microscope, Users, ShieldCheck } from "lucide-react";

const WhyUs = () => {
  const reasons = [
    {
      icon: Lightbulb,
      title: "Innovative Research",
      description:
        "Pioneering biomedical advancements through cutting-edge methodologies.",
    },
    {
      icon: Microscope,
      title: "Evidence-Based Solutions",
      description:
        "Delivering scientifically validated health products and services.",
    },
    {
      icon: Users,
      title: "Collaborative Approach",
      description:
        "Working alongside partners, patients, and professionals to create impact.",
    },
    {
      icon: ShieldCheck,
      title: "Trusted Expertise",
      description:
        "Backed by decades of experience and peer-reviewed publications.",
    },
  ];

  return (
    <section id="why-us" className="py-20 bg-gradient-to-b from-white to-[#f9fafb] font-parka">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-[#0b8686] mb-4 drop-shadow-sm">
            Why <span className="text-[#FFB84D]">Choose Us</span>
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto font-parka">
            Discover what sets <span className="text-[#0b8686] font-semibold">CERA MEDICAL</span> apart in advancing healthcare and
            biomedical research.
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 font-parka">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="group text-center p-8 rounded-2xl bg-white shadow-md hover:shadow-lg hover:-translate-y-2 border border-gray-100 transition-all duration-300"
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#0b8686]/10 text-[#0b8686] rounded-full mb-6 transition-transform group-hover:scale-110">
                <reason.icon className="h-10 w-10" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-[#0b8686] mb-3">
                {reason.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed">
                {reason.description}
              </p>

              {/* Decorative Line */}
              <div className="mt-6 w-12 h-1 mx-auto bg-[#FFB84D] rounded-full group-hover:w-16 transition-all"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
