import { Linkedin, Mail, Award } from "lucide-react";
import { Link } from "react-router-dom";

const Team = () => {
  const teamMembers = [
    {
      name: "Dr. Imran",
      role: "Chief Research Officer",
      specialization: "Biochemistry & Molecular Biology",
      image: "/dr_imran-removebg-preview.png",
      description:
        "Leading expert in biochemical research with 12+ years experience in drug development.",
      linkedin: "https://www.linkedin.com/in/dr-imran/",
      email: "imran@example.com",
    },
    {
      name: "Habab Ali Ahmad",
      role: "Head of Product Development",
      specialization: "Pharmacology & Toxicology",
      image: "/habab_ali_ahmadimage-removebg-preview (2).png",
      description:
        "Specialist in preclinical testing methodologies and regulatory compliance protocols.",
      linkedin: "https://pk.linkedin.com/in/habab-ali-ahmad",
      email: "habab@example.com",
    },
    {
      name: "Dr. Waqar Ahmad",
      role: "Director of Preclinical Studies",
      specialization: "Natural Product Chemistry",
      image: "/waqar_image-removebg-preview (1).png",
      description:
        "Pioneer in natural health product formulation and quality assurance systems.",
      linkedin: "https://www.linkedin.com/in/waqar-ahmad-451b6215/",
      email: "waqar@example.com",
    },
    {
      name: "Dr. Fazle Rabbi",
      role: "Senior Research Scientist",
      specialization: "Disease Modeling & Analysis",
      image: "/fazle_image-removebg-preview.png",
      description:
        "Expert in cellular and molecular disease modeling for therapeutic research.",
      linkedin: "https://www.linkedin.com/in/fazle-rabbi/",
      email: "fazle@example.com",
    },
  ];

  return (
    <section id="team" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Header */}
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

        {/* Team Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="group text-center bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg hover:border-[#0b8686]/40 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Profile Image */}
              <div className="relative mb-6">
                <div className="w-28 h-28 mx-auto mb-4 relative overflow-hidden rounded-2xl group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={member.image}
                    alt={`${member.name} - ${member.role}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Achievement Badge */}
                <div className="absolute top-0 right-1/4 transform translate-x-1/2">
                  <div className="w-8 h-8 bg-[#FFB84D] rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 shadow-md">
                    <Award className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>

              {/* Member Info */}
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

                {/* Social Links */}
                <div className="flex justify-center gap-3 pt-2">
                  {/* LinkedIn */}
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-[#0b8686]/10 hover:bg-[#0b8686] text-[#0b8686] hover:text-white rounded-lg flex items-center justify-center transition-colors duration-200"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>

                  {/* Email */}
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

        {/* CTA Section */}
        <JoinTeamCTA />
      </div>
    </section>
  );
};

// ✅ CTA Section
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

export default Team;
