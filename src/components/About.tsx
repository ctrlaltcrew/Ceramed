import { Button } from '@/components/ui/button';
import { ArrowRight, Award, Users, Globe, Target } from 'lucide-react';
import { useState, useEffect } from 'react';

const About = () => {
  const highlights = [
    {
      icon: Award,
      title: 'Excellence',
      description: 'Commitment to highest quality standards',
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Leading researchers and scientists',
    },
    {
      icon: Globe,
      title: 'Global Impact',
      description: 'Contributing to worldwide health solutions',
    },
    {
      icon: Target,
      title: 'Innovation',
      description: 'Cutting-edge research methodologies',
    },
  ];

  // only 2 partner logos
  const partners = [
    { logo: '/PAF-IAST Logo.png' },
    { logo: '/NIH.png' },
  ];

  const [current, setCurrent] = useState(0);

  // Auto-slide every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % partners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [partners.length]);

  return (
    <section
      id="about"
      className="section-padding bg-gradient-to-br from-background to-accent/20"
    >
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="animate-slide-up">
            <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-6">
              Who We Are
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Leading Biomedical Innovation in
              <span className="text-primary"> Pakistan</span>
            </h2>

            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                CERA MEDICAL is a leading biomedical R&amp;D company in Pakistan dedicated to
                improving human health through innovative solutions. We develop evidence-based
                natural health products and provide cutting-edge research services to bridge
                the gap between laboratory discoveries and real-world health needs.
              </p>

              <p>
                Our multidisciplinary team of researchers, scientists, and healthcare professionals
                work tirelessly to advance medical knowledge and develop solutions that make a
                meaningful difference in people's lives.
              </p>
            </div>

            <Button className="btn-medical mt-8 group">
              Learn More About Us
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-2 gap-6 animate-fade-in">
            {highlights.map((item, index) => (
              <div
                key={index}
                className="medical-card text-center group hover:bg-gradient-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Partnerships Section */}
        <div className="mt-24 animate-slide-up">
          <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-6">
            Institutional Partnerships
          </div>

          <h3 className="text-3xl font-bold text-foreground mb-8">
            Collaborating with Leading Institutions
          </h3>

          {/* Logo Slider (only images slide) */}
          <div className="relative w-full h-48 overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {partners.map((partner, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 w-full h-48 flex items-center justify-center"
                >
                  <img
                    src={partner.logo}
                    alt={`Partner ${idx}`}
                    className="max-h-40 object-contain"
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
