import Header from '@/components/Header';
import Hero from '@/components/Hero';
import WhyUs from '@/components/WhyUs';
import Stats from '@/components/Stats';
import HomeProductsPreview from '@/components/HomeProductsPreview'; // 👈 add this
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <WhyUs />
        <HomeProductsPreview /> {/* 👈 your small product preview */}
        <Stats />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
