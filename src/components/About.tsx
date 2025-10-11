import { Button } from "@/components/ui/button";
import {
  Microscope,
  FlaskConical,
  Rabbit,
  ScanSearch,
} from "lucide-react";
import { useState, useEffect } from "react";

const About = () => {
  const labs = [
    {
      icon: Microscope,
      title: "Histopathology Lab",
      description:
        "Providing precise tissue analysis for disease diagnosis and research excellence.",
    },
    {
      icon: FlaskConical,
      title: "Cell Culture Lab",
      description:
        "Advancing biomedical innovations through cellular research and testing.",
    },
    {
      icon: Rabbit,
      title: "Animal House",
      description:
        "Supporting ethical preclinical studies to enhance global healthcare outcomes.",
    },
    {
      icon: ScanSearch,
      title: "Microscopy Lab",
      description:
        "Delivering detailed imaging solutions for cellular and molecular investigations.",
    },
  ];

  const academicPartners = [
    { logo: "/PAF-IAST Logo.png", alt: "PAF-IAST" },
    { logo: "/NIH.png", alt: "NIH" },
    { logo: "/drugdev.jpeg", alt: "DPIA" },
  ];

  const industrialPartners = [
    { logo: "/pharmatech.png", alt: "PharmaTech" },
    { logo: "/bioinnovate.png", alt: "BioInnovate" },
    { logo: "/medilab.png", alt: "MediLab" },
  ];

  const [currentAcademic, setCurrentAcademic] = useState(0);
  const [currentIndustry, setCurrentIndustry] = useState(0);

  useEffect(() => {
    const academicInterval = setInterval(() => {
      setCurrentAcademic((prev) => (prev + 1) % academicPartners.length);
    }, 3000);

    const industrialInterval = setInterval(() => {
      setCurrentIndustry((prev) => (prev + 1) % industrialPartners.length);
    }, 3500);

    return () => {
      clearInterval(academicInterval);
      clearInterval(industrialInterval);
    };
  }, [academicPartners.length, industrialPartners.length]);

  return (
    <section
      id="about"
      className="section-padding bg-white text-gray-800 font-montserrat"
    >
      <div className="container mx-auto space-y-24 px-6">
        {/* WHO WE ARE */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-slide-up">
            <div className="inline-block px-4 py-2 bg-[#0b8686]/10 text-[#0b8686] rounded-full text-sm font-semibold mb-6 font-parka">
              Who We Are
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-[#0b8686] mb-6 leading-tight font-parka">
              Leading Biomedical Innovation in{" "}
              <span className="text-[#FFB84D]">Pakistan</span>
            </h2>

            <div className="space-y-6 text-lg text-gray-700 leading-relaxed font-montserrat">
              <p>
                <span className="font-semibold text-[#0b8686]">
                  CERA MEDICAL
                </span>{" "}
                is a leading biomedical R&amp;D company in Pakistan dedicated to
                improving human health through innovative solutions. We develop
                evidence-based natural health products and provide cutting-edge
                research services bridging the gap between laboratory discoveries
                and real-world healthcare needs.
              </p>

              <p>
                Our multidisciplinary team of researchers, scientists, and
                healthcare professionals work tirelessly to advance medical
                knowledge and create solutions that make a meaningful difference
                in people’s lives.
              </p>
            </div>
          </div>

          {/* Labs */}
          <div className="grid grid-cols-2 gap-6 animate-fade-in">
            {labs.map((item, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 text-center border border-[#0b8686]/10"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0b8686] rounded-2xl mb-4 shadow-md">
                  <item.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#0b8686] mb-2 font-parka">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* MISSION & VISION */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-8 rounded-2xl shadow-md hover:shadow-lg transition">
            <h4 className="text-2xl font-semibold text-[#0b8686] mb-3 font-parka">
              Our Mission
            </h4>
            <p className="text-gray-700 text-lg leading-relaxed font-montserrat">
              We streamline drug development by delivering precise preclinical
              data, enabling biotech firms to bring life-saving therapies to
              market faster and more affordably.
            </p>
          </div>

          <div className="p-8 rounded-2xl shadow-md hover:shadow-lg transition">
            <h4 className="text-2xl font-semibold text-[#0b8686] mb-3 font-parka">
              Our Vision
            </h4>
            <p className="text-gray-700 text-lg leading-relaxed font-montserrat">
              To redefine preclinical research by merging cutting-edge science
              and technology, making Pakistan a global hub for biotech innovation
              and improving lives worldwide.
            </p>
          </div>
        </div>

        {/* CORE VALUES */}
        <div>
          <h3 className="text-3xl font-bold text-[#0b8686] mb-4 font-parka">
            Core Values
          </h3>
          <p className="text-gray-700 mb-8 text-lg font-montserrat">
            The principles that guide everything we do
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Scientific Excellence",
                desc: "Commitment to the highest standards of research and development.",
              },
              {
                title: "Innovation",
                desc: "Pioneering new solutions for better health outcomes.",
              },
              {
                title: "Collaboration",
                desc: "Working together with partners to achieve common goals.",
              },
              {
                title: "Integrity",
                desc: "Maintaining ethical standards in all our endeavors.",
              },
            ].map((val, idx) => (
              <div
                key={idx}
                className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg hover:bg-[#0b8686]/5 transition border border-[#0b8686]/10"
              >
                <h5 className="font-semibold text-[#0b8686] mb-2 text-lg font-parka">
                  {val.title}
                </h5>
                <p className="text-sm text-gray-600 leading-relaxed font-montserrat">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* BOARD OF DIRECTORS */}
        <div className="text-center mt-20">
          <div className="inline-block px-4 py-2 bg-[#0b8686]/10 text-[#0b8686] rounded-full text-sm font-semibold mb-6 font-parka">
            Board of Directors
          </div>

          <h3 className="text-3xl font-bold text-[#0b8686] mb-10 font-parka">
            Meet Our <span className="text-[#FFB84D]">Leadership Team</span>
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Dr. Imran",
                role: "Chairman & Chief Scientist",
                image: "/dr_imran-removebg-preview.png",
              },
              {
                name: "Dr. Habab Ali Ahmad",
                role: "Director of Innovation & Strategy",
                image: "/habab_ali_ahmadimage-removebg-preview (2).png",
              },
              {
                name: "Dr. Waqar Ahmad",
                role: "Director of Research & Development",
                image: "/waqar_image-removebg-preview (1).png",
              },
              {
                name: "Dr. Fazle Rabbi",
                role: "Managing Director",
                image: "/fazle_image-removebg-preview.png",
              },
            ].map((director, idx) => (
              <div
                key={idx}
                className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-[#0b8686]/10 hover:-translate-y-1"
              >
                <div className="w-28 h-28 mx-auto mb-4 overflow-hidden rounded-2xl shadow-md hover:scale-105 transition-transform duration-300">
                  <img
                    src={director.image}
                    alt={director.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-xl font-semibold text-[#0b8686] mb-1 font-parka">
                  {director.name}
                </h4>
                <p className="text-sm text-black font-medium">
                  {director.role}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* INDUSTRIAL PARTNERS */}
        <div className="animate-slide-up text-center mt-20">
          <div className="inline-block px-4 py-2 bg-[#FFB84D]/10 text-[#FFB84D] rounded-full text-sm font-semibold mb-6 font-parka">
            Industrial Partners
          </div>

          <h3 className="text-3xl font-bold text-[#0b8686] mb-10 font-parka">
            Collaborating with{" "}
            <span className="text-[#FFB84D]">Industry Leaders</span>
          </h3>

          <div className="relative w-full h-56 overflow-hidden rounded-xl bg-white">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentIndustry * 100}%)` }}
            >
              {industrialPartners.map((partner, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 w-full h-56 flex items-center justify-center bg-white border border-[#0b8686]/10 shadow-md p-6"
                >
                  <img
                    src={partner.logo}
                    alt={partner.alt}
                    className="max-h-40 w-auto object-contain mx-auto"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ACADEMIC PARTNERS */}
        <div className="animate-slide-up text-center mt-20">
          <div className="inline-block px-4 py-2 bg-[#0b8686]/10 text-[#0b8686] rounded-full text-sm font-semibold mb-6 font-parka">
            Academic Partnerships
          </div>

          <h3 className="text-3xl font-bold text-[#0b8686] mb-10 font-parka">
            Collaborating with{" "}
            <span className="text-[#FFB84D]">Leading Institutions</span>
          </h3>

          <div className="relative w-full h-56 overflow-hidden rounded-xl bg-white">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentAcademic * 100}%)` }}
            >
              {academicPartners.map((partner, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 w-full h-56 flex items-center justify-center bg-white border border-[#0b8686]/10 shadow-md p-6"
                >
                  <img
                    src={partner.logo}
                    alt={partner.alt}
                    className="max-h-40 w-auto object-contain mx-auto"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
