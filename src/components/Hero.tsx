import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section
      id="home"
      className="relative min-h-[100dvh] flex items-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/bannerimg.png"
          alt="Advanced biomedical research laboratory with cutting-edge equipment"
          className="w-full h-full object-cover"
        />
        {/* Fallback + Blur Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center text-white">
          <div className="animate-fade-in">
            {/* Heading */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6">
              Advancing Health through
              <span className="bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                {" "}Rigorous Research
              </span>
              <br />
              and Innovative Solutions
            </h1>

            {/* Subheading */}
            <p className="text-sm sm:text-base md:text-lg mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
              CERA MEDICAL is dedicated to improving human health through innovative solutions. 
              We develop evidence-based natural health products and provide cutting-edge research 
              services.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                className="btn-medical text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 group"
                onClick={() => navigate('/products')}
              >
                Shop Products
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button 
                variant="outline" 
                className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 border border-white text-white bg-transparent focus:ring-0 focus:outline-none"
                onClick={() => navigate('/about')}
              >
                Who We Are
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 text-white/80 text-sm sm:text-base">
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
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-5 h-8 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-1 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
