import { useEffect, useState } from "react";
import { Users, FileText, Award, Building } from "lucide-react";

const Stats = () => {
  const [hasAnimated, setHasAnimated] = useState(false);

  const stats = [
    {
      icon: Award,
      value: 1,
      label: "Years of Experience",
      suffix: "+",
      description: "Dedicated to advancing medical research",
      color: "text-green-600 bg-green-100",
    },
    {
      icon: FileText,
      value: 9,
      label: "Research Projects",
      suffix: "+",
      description: "Successfully completed studies",
      color: "text-blue-600 bg-blue-100",
    },
    {
      icon: FileText,
      value: 10,
      label: "Publications",
      suffix: "+",
      description: "Peer-reviewed scientific papers",
      color: "text-purple-600 bg-purple-100",
    },
    {
      icon: Building,
      value: 5,
      label: "Industry Partners",
      suffix: "+",
      description: "Collaborative research relationships",
      color: "text-teal-600 bg-teal-100",
    },
  ];

  const CountUpAnimation = ({
    end,
    duration = 2000,
    suffix = "",
  }: {
    end: number;
    duration?: number;
    suffix?: string;
  }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!hasAnimated) return;

      let startTime: number;
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);

        setCount(Math.floor(progress * end));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, [hasAnimated, end, duration]);

    return (
      <span className="stat-counter text-4xl font-bold text-[#FFB84D] font-parka">
        {count}
        {suffix}
      </span>
    );
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.5 }
    );

    const statsSection = document.getElementById("stats");
    if (statsSection) {
      observer.observe(statsSection);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section
      id="stats"
      className="py-20 bg-gradient-to-r from-blue-50 via-green-50 to-white"
    >
      <div className="container mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Our Impact in <span className="text-[#0b8686]">Numbers</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Measurable results that demonstrate our commitment to advancing
            biomedical research and healthcare innovation.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-8 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 animate-scale-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Icon */}
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${stat.color}`}
              >
                <stat.icon className="h-8 w-8" />
              </div>

              {/* Counter */}
              <div className="mb-2">
                <CountUpAnimation end={stat.value} suffix={stat.suffix} />
              </div>

              {/* Label */}
              <h3 className="text-lg font-semibold text-[#0b8686] mb-2">
                {stat.label}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
