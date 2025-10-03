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
    const whatsappNumber = "+923409052244"; // Replace with your number
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
    <section id="contact" className="section-padding bg-background">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-6">
            Get in Touch
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            Contact Our <span className="text-primary">Research Team</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Ready to collaborate on groundbreaking research or learn more about our services? 
            We'd love to hear from you and explore how we can work together.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div className="space-y-8 animate-slide-up">
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-6">
                Let's Start a Conversation
              </h3>
              <p className="text-muted-foreground leading-relaxed">
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
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-accent/20 transition-colors duration-200"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                      <info.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      {info.title}
                    </h4>
                    <p className="text-primary font-medium mb-1">
                      {info.details}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {info.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Google Map */}
            <div className="medical-card">
              <div className="w-full h-64 rounded-xl overflow-hidden shadow-lg">
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
          </div>

          {/* Contact Form */}
          <div className="animate-fade-in">
            <div className="medical-card">
              <h3 className="text-2xl font-semibold text-foreground mb-6">
                Send us a Message
              </h3>
              
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
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
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
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
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
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
                    className="w-full resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button type="button" className="btn-medical flex-1 group" onClick={handleWhatsAppSubmit}>
                    <Send className="h-5 w-5 mr-2" />
                    Send via WhatsApp
                  </Button>
                  <Button type="button" className="btn-outline flex-1 group" onClick={handleEmailSubmit}>
                    <Mail className="h-5 w-5 mr-2" />
                    Email Us
                  </Button>
                </div>
              </form>

              <div className="mt-8 p-4 bg-accent/20 rounded-xl">
                <p className="text-sm text-muted-foreground">
                  <strong>Response Time:</strong> We typically respond within 24 hours during business days. 
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
