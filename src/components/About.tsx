import { Button } from "@/components/ui/button";
import { Microscope, FlaskConical, Rabbit, ScanSearch } from "lucide-react";
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
    { logo: "/Picture3.png", alt: "Directorate of Science & Technology Khyber Pakhtunkhwa" },
  ];

  const industrialPartners = [
    { logo: "/pharmatech.png", alt: "PharmaTech" },
    { logo: "/bioinnovate.png", alt: "BioInnovate" },
    { logo: "/medilab.png", alt: "MediLab" },
    { logo: "/Picture1.png", alt: "Vet tech Health care" },
    { logo: "/Picture2.png", alt: "Sequel Pharma" },

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
  }, []);

  return (
    <section
      id="about"
      className="section-padding bg-white text-gray-800 font-montserrat"
    >
      <div className="container mx-auto space-y-20 sm:space-y-24 px-4 sm:px-6">

        {/* WHO WE ARE */}
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 items-center">
          <div className="animate-slide-up text-center lg:text-left">
            <div className="inline-block px-4 py-2 bg-[#0b8686]/10 text-[#0b8686] rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6 font-parka">
              Who We Are
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0b8686] mb-4 sm:mb-6 leading-tight font-parka">
              Leading Biomedical Innovation in{" "}
              <span className="text-[#FFB84D]">Pakistan</span>
            </h2>

            <div className="space-y-4 sm:space-y-6 text-base sm:text-lg text-gray-700 leading-relaxed font-montserrat">
              <p>
                <span className="font-semibold text-[#0b8686]">
                  CERA MEDICAL
                </span>{" "}
                is a leading biomedical R&amp;D company in Pakistan dedicated to
                improving human health through innovative solutions.
              </p>

              <p>
                Our multidisciplinary team of researchers, scientists, and
                healthcare professionals work tirelessly to create solutions
                that make a meaningful difference in people’s lives.
              </p>
            </div>
          </div>

          {/* Labs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 animate-fade-in">
            {labs.map((item, index) => (
              <div
                key={index}
                className="p-5 sm:p-6 rounded-2xl bg-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 text-center border border-[#0b8686]/10"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-[#0b8686] rounded-2xl mb-3 sm:mb-4 shadow-md">
                  <item.icon className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-[#0b8686] mb-1 sm:mb-2 font-parka">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* MISSION & VISION */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 sm:p-8 rounded-2xl shadow-md hover:shadow-lg transition bg-white">
            <h4 className="text-xl sm:text-2xl font-semibold text-[#0b8686] mb-2 sm:mb-3 font-parka">
              Our Mission
            </h4>
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed font-montserrat">
              We streamline drug development by delivering precise preclinical
              data, enabling biotech firms to bring life-saving therapies to
              market faster and more affordably.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl shadow-md hover:shadow-lg transition bg-white">
            <h4 className="text-xl sm:text-2xl font-semibold text-[#0b8686] mb-2 sm:mb-3 font-parka">
              Our Vision
            </h4>
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed font-montserrat">
              To redefine preclinical research by merging cutting-edge science
              and technology, making Pakistan a global hub for biotech innovation.
            </p>
          </div>
        </div>

        {/* CORE VALUES */}
        <div className="text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-[#0b8686] mb-2 sm:mb-4 font-parka">
            Core Values
          </h3>
          <p className="text-gray-700 mb-6 sm:mb-8 text-base sm:text-lg font-montserrat">
            The principles that guide everything we do
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
                className="p-5 sm:p-6 bg-white rounded-xl shadow-md hover:shadow-lg hover:bg-[#0b8686]/5 transition border border-[#0b8686]/10"
              >
                <h5 className="font-semibold text-[#0b8686] mb-1 sm:mb-2 text-base sm:text-lg font-parka">
                  {val.title}
                </h5>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-montserrat">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* BOARD OF DIRECTORS */}
        <div className="text-center mt-16 sm:mt-20">
          <div className="inline-block px-4 py-2 bg-[#0b8686]/10 text-[#0b8686] rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6 font-parka">
            Board of Directors
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold text-[#0b8686] mb-8 sm:mb-10 font-parka">
            Meet Our <span className="text-[#FFB84D]">Leadership Team</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                name: "Dr.Muhammad Imran khan",
                role: "PI, Head Drug Testing",
                image: "/dr_imran-removebg-preview.png",
              },
              {
                name: "Habab Ali Ahmad",
                role: "Community Lead / Research Scientist",
                image: "/habab_ali_ahmadimage-removebg-preview (2).png",
              },
              {
                name: "Dr. Waqar Khalid Ahmad",
                role: "Lead Disease Modeling and Clinical Studies",
                image: "/waqar_image-removebg-preview (1).png",
              },
              {
                name: "Dr. Fazle Wahab",
                role: "Lead Animal Studies ",
                image: "/fazle_image-removebg-preview.png",
              },
            ].map((director, idx) => (
              <div
                key={idx}
                className="p-5 sm:p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-[#0b8686]/10 hover:-translate-y-1"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-3 sm:mb-4 overflow-hidden rounded-2xl shadow-md">
                  <img
                    src={director.image}
                    alt={director.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-lg sm:text-xl font-semibold text-[#0b8686] mb-1 font-parka">
                  {director.name}
                </h4>
                <p className="text-xs sm:text-sm text-black font-medium">
                  {director.role}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* PARTNERS SECTIONS */}
        {[ 
          {
            title: "Industrial Partners",
            color: "#FFB84D",
            partners: industrialPartners,
            current: currentIndustry,
          },
          {
            title: "Academic Partnerships",
            color: "#0b8686",
            partners: academicPartners,
            current: currentAcademic,
          },
        ].map((section, i) => (
          <div
            key={i}
            className="animate-slide-up text-center mt-16 sm:mt-20"
          >
            <div
              className={`inline-block px-4 py-2 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6 font-parka`}
              style={{
                backgroundColor: `${section.color}20`,
                color: section.color,
              }}
            >
              {section.title}
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-[#0b8686] mb-8 sm:mb-10 font-parka">
              Collaborating with{" "}
              <span className="text-[#FFB84D]">Leaders & Institutions</span>
            </h3>

            <div className="relative w-full h-44 sm:h-56 overflow-hidden rounded-xl bg-white">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateX(-${section.current * 100}%)`,
                }}
              >
                {section.partners.map((partner, idx) => (
                  <div
                    key={idx}
                    className="flex-shrink-0 w-full h-44 sm:h-56 flex items-center justify-center bg-white border border-[#0b8686]/10 shadow-md p-4 sm:p-6"
                  >
                    <img
                      src={partner.logo}
                      alt={partner.alt}
                      className="max-h-28 sm:max-h-40 w-auto object-contain mx-auto"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default About;
