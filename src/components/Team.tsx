import { Linkedin, Mail, Award } from 'lucide-react';
import { Link } from "react-router-dom";

const Team = () => {
  const teamMembers = [
    {
      name: 'Dr. Imran',
      role: 'Chief Research Officer',
      specialization: 'Biochemistry & Molecular Biology',
      image: '/dr_imran-removebg-preview.png',
      description: 'Leading expert in biochemical research with 12+ years experience in drug development.',
      linkedin: 'https://www.linkedin.com/in/dr-imran/',
      email: 'imran@example.com',
    },
    {
      name: 'Habab Ali Ahmad',
      role: 'Head of Product Development',
      specialization: 'Pharmacology & Toxicology',
      image: '/habab_ali_ahmadimage-removebg-preview (2).png',
      description: 'Specialist in preclinical testing methodologies and regulatory compliance protocols.',
      linkedin: 'https://pk.linkedin.com/in/habab-ali-ahmad',
      email: 'habab@example.com',
    },
    {
      name: 'Dr. Waqar Ahmad',
      role: 'Director of Preclinical Studies',
      specialization: 'Natural Product Chemistry',
      image: '/waqar_image-removebg-preview (1).png',
      description: 'Pioneer in natural health product formulation and quality assurance systems.',
      linkedin: 'https://www.linkedin.com/in/waqar-ahmad-451b6215/',
      email: 'waqar@example.com',
    },
    {
      name: 'Dr. Fazle Rabbi',
      role: 'Senior Research Scientist',
      specialization: 'Disease Modeling & Analysis',
      image: '/fazle_image-removebg-preview.png',
      description: 'Expert in cellular and molecular disease modeling for therapeutic research.',
      linkedin: 'https://www.linkedin.com/in/fazle-rabbi/',
      email: 'fazle@example.com',
    },
  ];

  return (
    <section id="team" className="section-padding bg-background">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-6">
            Our Team
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            Meet Our Expert 
            <span className="text-primary"> Researchers</span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our multidisciplinary team combines decades of experience in biomedical research, 
            bringing together expertise from various fields to drive innovation in healthcare.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div 
              key={index}
              className="medical-card group text-center hover:bg-gradient-card animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Profile Image */}
              <div className="relative mb-6">
                <div className="w-26 h-26 mx-auto mb-4 relative overflow-hidden rounded-2xl group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={member.image}
                    alt={`${member.name} - ${member.role} at CERA MEDICAL`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Achievement Badge */}
                <div className="absolute top-0 right-1/4 transform translate-x-1/2">
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                    <Award className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>

              {/* Member Info */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-1">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.specialization}</p>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">{member.description}</p>

                {/* Social Links */}
                <div className="flex justify-center gap-3 pt-2">
                  {/* LinkedIn */}
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-lg flex items-center justify-center transition-colors duration-200"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>

                  {/* Email */}
                  <a
                    href={`mailto:${member.email}`}
                    className="w-8 h-8 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-lg flex items-center justify-center transition-colors duration-200"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <JoinTeamCTA />
      </div>
    </section>
  );
};

// ✅ Use Link to navigate with hash (#contact)
const JoinTeamCTA = () => {
  return (
    <div className="text-center mt-16 animate-fade-in font-mono">
      <div className="medical-card max-w-2xl mx-auto bg-gradient-card font-sans">
        <h3 className="text-2xl font-semibold text-foreground mb-4 font-sans">
          Join Our Research Team
        </h3>
        <p className="text-muted-foreground mb-6 font-sans">
          We're always looking for talented researchers and scientists to join our mission 
          of advancing healthcare through innovative research.
        </p>

        {/* Link will take to Home page and jump to #contact */}
        <Link to="/contact" className="btn-medical">
          Contact Us
        </Link>
      </div>
    </div>
  );
};

export default Team;
