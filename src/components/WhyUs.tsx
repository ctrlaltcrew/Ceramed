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
    <section id="why-us" className="section-padding bg-white font-sans">
      <div className="container mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Why Choose Us
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-sans">
            Discover what sets CERA MEDICAL apart in advancing healthcare and
            biomedical research.
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 font-sans">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-2xl shadow-lg bg-gray-50 hover:bg-gray-100 transition-all duration-300 animate-scale-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-6">
                <reason.icon className="h-8 w-8" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {reason.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
