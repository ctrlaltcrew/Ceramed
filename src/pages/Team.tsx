import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Linkedin, Mail, Award, Github } from "lucide-react";
import { Link } from "react-router-dom";

const TeamPage = () => {
  const teamMembers = [
    {
      name: "Dr.Muhammad Imran khan",
      role: "PI, Head Drug Testing",
      specialization: "Assistant Professor",
      image: "/dr_imran-removebg-preview.png",
      description:
        "Leading expert in biochemical research with 12+ years experience in drug development.",
      linkedin: "https://www.linkedin.com/in/dr-imran/",
      email: "imran@example.com",
      github: "",
    },
    {
      name: "Habab Ali Ahmad",
      role: "Community Lead / Research Scientist",
      specialization: "Pharmacology",
      image: "/habab_ali_ahmadimage-removebg-preview (2).png",
      description:
        "Specialist in preclinical testing methodologies and regulatory compliance protocols.",
      linkedin: "https://pk.linkedin.com/in/habab-ali-ahmad",
      email: "habab@example.com",
      github: "",
    },

    {
      name: "Ayesha Khan",
      role: "Research Assistant",
      specialization: "Biomedical Research",
      image: "/Ayesha Khan.jpg",
      description:
        "Specialist in preclinical testing methodologies and regulatory compliance protocols.",
      linkedin: "https://www.linkedin.com/in/ayesha-khan/",
      email: "ayesha@example.com",
      github: "",
    },

    {
      name: "Dr. Waqar khalid Saeed",
      role: "Lead Disease Modeling and clinical Studies",
      specialization: "Assistant Professor",
      image: "/waqar_image-removebg-preview (1).png",
      description:
        "Pioneer in natural health product formulation and quality assurance systems.",
      linkedin: "https://www.linkedin.com/in/waqar-ahmad-451b6215/",
      email: "waqar@example.com",
      github: "",
    },
    {
      name: "Dr. Fazle Wahab",
      role: "Lead Animal Studies",
      specialization: "Associate Professor",
      image: "/fazle_image-removebg-preview.png",
      description:
        "Expert in cellular and molecular disease modeling for therapeutic research.",
      linkedin: "https://www.linkedin.com/in/fazle-rabbi/",
      email: "fazle@example.com",
      github: "",
    },

    {
      name: "Jalal Khan Utman",
      role: "Invitro Experimentation and MD Simulation Expert",
      specialization: "In Vitro & MD Simulation",
      image: "/jalal_khan_utman.jpg",
      description:
        "Specialist in preclinical testing methodologies and regulatory compliance protocols.",
      linkedin: "https://www.linkedin.com/",
      email: "jalal@example.com",
      github: "",
    },
  ];

  return (
    <>
      <Header />

      <section id="team" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-block px-5 py-2 bg-[#0b8686]/10 text-[#0b8686] rounded-full text-sm font-semibold mb-6 font-parka">
              Our Team
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight font-parka">
              Meet Our Expert{" "}
              <span className="text-[#FFB84D]">Researchers</span>
            </h2>

            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed font-montserrat">
              Our multidisciplinary team combines decades of experience in
              biomedical research, bringing together expertise from various
              fields to drive innovation in healthcare.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="group text-center bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg hover:border-[#0b8686]/40 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative mb-6">
                  <div className="w-28 h-28 mx-auto mb-4 relative overflow-hidden rounded-2xl group-hover:scale-105 transition-transform duration-300">
                    <img
                      src={member.image}
                      alt={`${member.name} - ${member.role}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute top-0 right-1/4 transform translate-x-1/2">
                    <div className="w-8 h-8 bg-[#FFB84D] rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 shadow-md">
                      <Award className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-xl font-semibold text-[#0b8686] mb-1 font-parka">
                      {member.name}
                    </h3>
                    <p className="text-[#FFB84D] font-medium mb-1 font-montserrat">
                      {member.role}
                    </p>
                    <p className="text-sm text-gray-600 font-montserrat">
                      {member.specialization}
                    </p>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed font-montserrat">
                    {member.description}
                  </p>

                  <div className="flex justify-center gap-3 pt-2">
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 bg-[#0b8686]/10 hover:bg-[#0b8686] text-[#0b8686] hover:text-white rounded-lg flex items-center justify-center transition-colors duration-200"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>

                    {!!member.github && (
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 bg-gray-200/60 hover:bg-gray-900 text-gray-700 hover:text-white rounded-lg flex items-center justify-center transition-colors duration-200"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}

                    <a
                      href={`mailto:${member.email}`}
                      className="w-8 h-8 bg-[#FFB84D]/10 hover:bg-[#FFB84D] text-[#FFB84D] hover:text-white rounded-lg flex items-center justify-center transition-colors duration-200"
                    >
                      <Mail className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <JoinTeamCTA />
        </div>
      </section>

      <Footer />
    </>
  );
};

// ✅ CTA Component
const JoinTeamCTA = () => {
  return (
    <div className="text-center mt-16 animate-fade-in font-montserrat">
      <div className="bg-gradient-to-r from-[#0b8686] to-[#FFB84D] rounded-2xl shadow-lg py-10 px-8 max-w-2xl mx-auto text-white">
        <h3 className="text-2xl font-semibold mb-4 font-parka">
          Join Our Research Team
        </h3>
        <p className="text-sm mb-6 font-montserrat">
          We're always looking for talented researchers and scientists to join
          our mission of advancing healthcare through innovative research.
        </p>
        <Link
          to="/contact"
          className="inline-block bg-white text-[#0b8686] font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-[#FFB84D]/90 hover:text-white transition-all duration-200"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
};

export default TeamPage;
