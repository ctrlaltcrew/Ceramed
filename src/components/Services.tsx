import { Button } from '@/components/ui/button';
import { ArrowRight, Microscope, FlaskConical, Activity, Dna } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Microscope,
      title: 'Preclinical Studies',
      description: 'Ensuring new treatments are safe and effective before human trials through comprehensive laboratory testing and analysis.',
      features: ['Safety Assessment', 'Efficacy Testing', 'Toxicology Studies', 'Regulatory Compliance'],
    },
    {
      icon: FlaskConical,
      title: 'Biochemical Testing',
      description: 'Detailed laboratory analysis of compounds and samples providing crucial research insights for drug development.',
      features: ['Compound Analysis', 'Biomarker Testing', 'Quality Control', 'Method Development'],
    },
    {
      icon: Activity,
      title: 'Disease Modeling',
      description: 'Simulating health conditions in controlled laboratory environments to test potential therapies and treatments.',
      features: ['In-Vitro Models', 'Cellular Assays', 'Pathway Analysis', 'Therapeutic Testing'],
    },
    {
      icon: Dna,
      title: 'Molecular Research',
      description: 'Advanced molecular biology techniques to understand genetic factors and develop targeted therapeutic approaches.',
      features: ['Genetic Analysis', 'Protein Studies', 'Gene Expression', 'Molecular Diagnostics'],
    },
  ];

  return (
    <section id="services" className="section-padding bg-background">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-6 font-parka">
            Our Services
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight font-parka">
            Comprehensive Research 
            <span className="text-primary"> Solutions</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-montserrat">
            We provide end-to-end research services that bridge the gap between scientific discovery 
            and practical healthcare applications, ensuring the highest standards of quality and reliability.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => (
            <div 
              key={index}
              className="medical-card group hover:bg-gradient-card animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-foreground mb-3">
                    {service.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

      
      </div>
    </section>
  );
};

export default Services;