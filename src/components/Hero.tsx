import { Button } from '@/components/ui/button';
import { ArrowRight, Play } from 'lucide-react';


const Hero = () => {
  return (
  <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background Image with Blur */}
      <div className="absolute inset-0">
        <img
  src="/bannerimg.png"
  alt="Advanced biomedical research laboratory with cutting-edge equipment"
  className="w-md h-md object-cover blur-md"
/>

        {/* Optional dark overlay for better contrast */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center text-white">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Advancing Health through 
              <span className="bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                {" "}Rigorous Research
              </span>
              <br />
              and Innovative Solutions
            </h1>
            
            <p className="text-l md:text-xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
              CERA MEDICAL is dedicated to improving human health through innovative solutions. 
              We develop evidence-based natural health products and provide cutting-edge research 
              services.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
               <a href="#Products">
              <Button 
                className="btn-medical text-lg px-8 py-6 group"
                onClick={() => {
                  const productsSection = document.getElementById('products');
                  if (productsSection) {
                    productsSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Shop Products
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              </a>
              <Button 
                variant="outline" 
                className="btn-medical-outline text-lg px-8 py-6 border-white text-white  text-primary"
                onClick={() => {
                  const aboutSection = document.getElementById('about');
                  if (aboutSection) {
                    aboutSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Who We Are
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-white/80">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>15+ Years Experience</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>50+ Research Projects</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>25+ Publications</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
