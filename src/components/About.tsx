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
    { logo: '/PAF-IAST Logo.png', alt: 'PAF-IAST' },
    { logo: '/NIH.png', alt: 'NIH' },
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
      <div className="container mx-auto space-y-24">
        {/* WHO WE ARE */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-slide-up">
            <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-6">
              Who We Are
            </div>

            <h2 className="text-4xl lg:text-5xl font-extrabold text-foreground mb-6 leading-tight tracking-tight">
              Leading Biomedical Innovation in
              <span className="text-primary"> Pakistan</span>
            </h2>

            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                <span className="font-semibold text-foreground">CERA MEDICAL</span> is a leading biomedical R&amp;D company in Pakistan dedicated to
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
                className="medical-card text-center group hover:bg-gradient-card p-6 rounded-2xl shadow-md transition-transform duration-300 hover:scale-105"
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

        {/* FOUNDATION */}
        <div className="bg-gradient-to-br from-primary/5 to-accent/10 p-10 rounded-2xl shadow-lg border border-white/10 animate-fade-in">
          <div className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
            Our Foundation
          </div>

          <h3 className="text-3xl font-bold text-foreground mb-4 tracking-tight">
            Building the <span className="text-primary">Future of Biomedical Research</span>
          </h3>

          <p className="text-lg leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">CERA MEDICAL</span> pioneers preclinical research in Pakistan,
            specializing in rigorous drug discovery and development. Unlike traditional CROs,
            we integrate <span className="text-primary font-medium">computational modeling</span> with in-vivo testing to
            accelerate timelines and reduce costs. Founded in 2020 by molecular biologists and data scientists,
            we’ve partnered with global biotech firms to deliver precise, data-driven results
            for novel therapies.
          </p>
        </div>

        {/* MISSION & VISION */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl shadow-md hover:shadow-xl transition">
            <h4 className="text-2xl font-semibold text-foreground mb-3">Our Mission</h4>
            <p className="text-muted-foreground text-lg leading-relaxed">
              We streamline drug development by delivering precise preclinical data, enabling biotech firms to bring
              life-saving therapies to market faster and more affordably.
            </p>
          </div>
          <div className="p-8 bg-gradient-to-br from-accent/5 to-primary/5 rounded-2xl shadow-md hover:shadow-xl transition">
            <h4 className="text-2xl font-semibold text-foreground mb-3">Our Vision</h4>
            <p className="text-muted-foreground text-lg leading-relaxed">
              To redefine preclinical research by merging cutting-edge science and technology, making Pakistan a global
              hub for biotech innovation and improving lives worldwide.
            </p>
          </div>
        </div>

        {/* CORE VALUES */}
        <div>
          <h3 className="text-3xl font-bold text-foreground mb-4">Core Values</h3>
          <p className="text-muted-foreground mb-8 text-lg">The principles that guide everything we do</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Scientific Excellence', desc: 'Commitment to the highest standards of research and development.' },
              { title: 'Innovation', desc: 'Pioneering new solutions for better health outcomes.' },
              { title: 'Collaboration', desc: 'Working together with partners to achieve common goals.' },
              { title: 'Integrity', desc: 'Maintaining ethical standards in all our endeavors.' },
            ].map((val, idx) => (
              <div
                key={idx}
                className="p-6 bg-white/5 rounded-xl shadow-md hover:shadow-lg hover:bg-gradient-to-br hover:from-primary/5 hover:to-accent/5 transition"
              >
                <h5 className="font-semibold text-foreground mb-2 text-lg">{val.title}</h5>
                <p className="text-sm text-muted-foreground leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* PARTNERS SLIDER */}
        <div className="animate-slide-up">
          <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-6">
            Institutional Partnerships
          </div>

          <h3 className="text-3xl font-bold text-foreground mb-10 text-center">
            Collaborating with Leading Institutions
          </h3>

          <div className="relative w-full h-48 overflow-hidden rounded-xl">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {partners.map((partner, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 w-full h-48 flex items-center justify-center bg-white shadow-md p-6"
                >
                  <img
                    src={partner.logo}
                    alt={partner.alt}
                    className="max-h-36 object-contain"
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
