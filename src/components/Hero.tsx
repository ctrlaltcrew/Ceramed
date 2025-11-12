import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section
      id="home"
      className="relative min-h-[60vh] sm:min-h-[75vh] md:min-h-[85vh] lg:min-h-[100vh] flex items-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/wallpaper4.jpg"
          alt="Advanced biomedical research laboratory with cutting-edge equipment"
          className="w-full h-full object-cover max-h-[100vh] sm:max-h-[90vh] md:max-h-[85vh] lg:max-h-[100vh]"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-3xl mx-auto text-center text-white mt-[14rem] sm:mt-20"
        >
          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl leading-snug sm:leading-tight md:leading-tight font-parka font-bold mb-6">
            <span className="text-white drop-shadow-md block">
              Advancing Health Through
            </span>
            <span className="text-[#FFB84D] drop-shadow-lg block">
              Rigorous Research
            </span>
            <span className="text-white font-semibold drop-shadow-md block">
              and Innovative Solutions
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-sm sm:text-base md:text-lg mb-16 textgr max-w-xl mx-auto leading-relaxed">
            <span className="text-[#FFB84D]">CERA MEDICAL</span> is dedicated to improving human health through innovative solutions. We develop evidence-based natural health products and provide cutting-edge research services.
          </p>

          {/* Buttons: stacked on mobile, side by side on md+ */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-3 mb-12 max-w-sm mx-auto">
            <Button
              className="btn-medical text-sm sm:text-base px-4 py-2 flex justify-center items-center w-full md:w-[48%]"
              onClick={() => navigate('/products')}
            >
              Shop Products
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              variant="outline"
              className="text-sm sm:text-base px-4 py-2 border border-white text-white bg-transparent focus:ring-0 focus:outline-none w-full md:w-[48%]"
              onClick={() => navigate('/about')}
            >
              Who We Are
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 mt-4 text-white/80 text-xs sm:text-sm md:text-base">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>1+ Years Experience</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>9+ Research Projects</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>10+ Publications</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator (only on md+ screens) */}
      <div className="hidden md:block absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-4 h-8 sm:w-5 sm:h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-1 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
