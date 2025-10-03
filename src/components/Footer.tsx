import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook, ArrowUp } from 'lucide-react';
import React from 'react';

const Footer = () => {
  const quickLinks = [
    { name: 'About Us', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Products', href: '#products' },
    { name: 'Blog', href: '#blog' },
    { name: 'Contact', href: '#contact' },
  ];

  const services = [
    { name: 'Preclinical Studies', href: '#services' },
    { name: 'Biochemical Testing', href: '#services' },
    { name: 'Disease Modeling', href: '#services' },
    { name: 'Molecular Research', href: '#services' },
  ];

  // Smooth scroll handler
  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    targetId: string
  ) => {
    e.preventDefault();
    const section = document.getElementById(targetId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0b8686] text-white">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="text-2xl font-bold mb-6">
                CERA <span className="text-secondary">MEDICAL</span>
              </div>
              <p className="text-white/80 leading-relaxed mb-6">
                Advancing Health through Rigorous Research and Innovative Solutions.
                Leading biomedical R&D company dedicated to improving human health.
              </p>

              {/* Social Links */}
              <div className="flex gap-3">
                <Button size="icon" variant="ghost" className="bg-white/10 hover:bg-white/20 text-white">
                  <Linkedin className="h-5 w-5" />
                </Button>
                <Button size="icon" variant="ghost" className="bg-white/10 hover:bg-white/20 text-white">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button size="icon" variant="ghost" className="bg-white/10 hover:bg-white/20 text-white">
                  <Facebook className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => {
                  const targetId = link.href.replace('#', '');
                  return (
                    <li key={index}>
                      <a
                        href={link.href}
                        onClick={(e) => handleScroll(e, targetId)}
                        className="text-white/80 hover:text-white transition-colors duration-200 flex items-center group cursor-pointer"
                      >
                        <span className="w-1 h-1 bg-secondary rounded-full mr-3 group-hover:w-2 transition-all duration-200"></span>
                        {link.name}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Our Services</h3>
              <ul className="space-y-3">
                {services.map((service, index) => {
                  const targetId = service.href.replace('#', '');
                  return (
                    <li key={index}>
                      <a
                        href={service.href}
                        onClick={(e) => handleScroll(e, targetId)}
                        className="text-white/80 hover:text-white transition-colors duration-200 flex items-center group cursor-pointer"
                      >
                        <span className="w-1 h-1 bg-secondary rounded-full mr-3 group-hover:w-2 transition-all duration-200"></span>
                        {service.name}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Contact Info</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white/90 text-sm">
                      PAF-IAST, Mang,<br />
                      Haripur, Pakistan
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-secondary flex-shrink-0" />
                  <a
                    href="mailto:medicalcera@gmail.com"
                    className="text-white/90 hover:text-white transition-colors duration-200 text-sm"
                  >
                    medicalcera@gmail.com
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-secondary flex-shrink-0" />
                  <a
                    href="tel:+923409052244"
                    className="text-white/90 hover:text-white transition-colors duration-200 text-sm"
                  >
                    +92-3409052244
                  </a>
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="mt-8">
                <h4 className="text-sm font-semibold mb-3">Stay Updated</h4>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                  <Button size="sm" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
            <div className="text-center md:text-left">
              <p className="text-white/80 text-sm">
                © 2024 CERA MEDICAL. All rights reserved.
              </p>
              <p className="text-white/60 text-xs mt-1">
                Developed by <a href="https://ctrlaltcrew.com" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">CtrlAltCrew</a>
              </p>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-white/80 hover:text-white transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors duration-200">
                Cookie Policy
              </a>
            </div>

            {/* Back to Top */}
            <Button
              size="sm"
              variant="ghost"
              onClick={scrollToTop}
              className="bg-white/10 hover:bg-white/20 text-white"
            >
              <ArrowUp className="h-4 w-4 mr-1" />
              Top
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
