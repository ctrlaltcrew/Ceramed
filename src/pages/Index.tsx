import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import Footer from '@/components/Footer';
import WhyUs from '@/components/WhyUs';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <WhyUs />
        <Stats />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
