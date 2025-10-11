import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Mail, Phone, Clock, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleWhatsAppSubmit = () => {
    const whatsappNumber = "+923409052244"; 
    const message = `
Hello CERA Medical Team,
My name is ${formData.name}.
Email: ${formData.email}
Message: ${formData.message}
    `;
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappURL, "_blank");
  };

  const handleEmailSubmit = () => {
    const emailAddress = "medicalcera@gmail.com";
    const subject = encodeURIComponent("Contact Form Submission");
    const body = encodeURIComponent(`
Hello CERA Medical Team,

My name is ${formData.name}.
Email: ${formData.email}
Message: ${formData.message}
    `);
    window.location.href = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Address',
      details: 'PAF-IAST, Mang, Haripur, Pakistan',
      description: 'Visit our state-of-the-art research facility',
    },
    {
      icon: Mail,
      title: 'Email',
      details: 'medicalcera@gmail.com',
      description: 'Get in touch for research collaborations',
    },
    {
      icon: Phone,
      title: 'Phone',
      details: '+92-3409052244',
      description: 'Call us during business hours',
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: 'Mon - Fri: 9:00 AM - 5:00 PM',
      description: 'Pakistan Standard Time (PST)',
    },
  ];

  return (
    <section id="contact" className="section-padding bg-white">
      <div className="container mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block px-5 py-2 bg-[#0b8686]/10 text-[#0b8686] rounded-full text-sm font-semibold mb-6 font-sans tracking-wide">
            Get in Touch
          </div>

          <h2 className="text-4xl lg:text-5xl font-extrabold text-[#0b8686] mb-4 leading-tight font-parka">
            Contact Our <span className="text-[#FFB84D]">Research Team</span>
          </h2>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed font-sans">
            Ready to collaborate on groundbreaking research or learn more about our services? 
            We’d love to hear from you and explore how we can work together.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          
          {/* Contact Information */}
          <div className="space-y-8 animate-slide-up">
            <div>
              <h3 className="text-2xl font-semibold text-[#0b8686] mb-4 font-parka">
                Let's Start a Conversation
              </h3>
              <p className="text-gray-600 leading-relaxed font-sans">
                Whether you're interested in our research services, product collaborations, 
                or academic partnerships, our team is here to help you achieve your goals 
                in biomedical innovation.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-4 p-5 rounded-xl border border-[#0b8686]/20 hover:bg-[#0b8686]/10 transition-colors duration-300"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-[#0b8686] rounded-xl flex items-center justify-center shadow-md">
                      <info.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#0b8686] mb-1 font-sans">{info.title}</h4>
                    <p className="text-[#FFB84D] font-medium mb-1 font-parka">{info.details}</p>
                    <p className="text-sm text-gray-600 font-sans">{info.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Google Map */}
            <div className="rounded-xl overflow-hidden shadow-lg border border-[#0b8686]/20">
              <iframe
                title="CERA Medical Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3327.0833333333335!2d72.933!3d34.0833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38deddf4e4b5a7d9%3A0x123456789abcdef!2sMang%2C%20Haripur%2C%20Pakistan!5e0!3m2!1sen!2s!4v1727969999999!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="animate-fade-in">
            <div className="p-8 bg-white rounded-2xl shadow-md border border-[#0b8686]/20">
              <h3 className="text-2xl font-semibold text-[#0b8686] mb-6 font-parka">
                Send us a Message
              </h3>
              
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-[#0b8686] mb-2">
                    Full Name *
                  </label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full border-[#0b8686]/30 focus:ring-[#FFB84D]"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-[#0b8686] mb-2">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    required
                    className="w-full border-[#0b8686]/30 focus:ring-[#FFB84D]"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-[#0b8686] mb-2">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us about your project or inquiry..."
                    rows={6}
                    required
                    className="w-full border-[#0b8686]/30 focus:ring-[#FFB84D]"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    type="button" 
                    className="flex-1 bg-[#0b8686] hover:bg-[#097575] text-white font-semibold"
                    onClick={handleWhatsAppSubmit}
                  >
                    <Send className="h-5 w-5 mr-2" />
                    Send via WhatsApp
                  </Button>

                  <Button 
                    type="button" 
                    className="flex-1 border-2   bg-[#FFB84D] text-white font-semibold"
                    onClick={handleEmailSubmit}
                  >
                    <Mail className="h-5 w-5 mr-2" />
                    Email Us
                  </Button>
                </div>
              </form>

              <div className="mt-8 p-4 bg-[#FFB84D]/10 rounded-xl">
                <p className="text-sm text-gray-700 font-medium font-sans">
                  <strong className="text-[#0b8686]">Response Time:</strong> We typically respond within 24 hours during business days. 
                  For urgent inquiries, please call us directly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
