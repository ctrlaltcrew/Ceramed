import Header from "@/components/Header";
import About from "@/components/About";
import Footer from "@/components/Footer";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white font-montserrat text-gray-800">
      {/* ✅ Header Section */}
      <Header />

      {/* ✅ Main Section */}
      <main className="pt-24 pb-16 bg-gradient-to-b from-white via-[#f9fdfa] to-[#e9f9f9]">
        <section className="container mx-auto px-6 text-center">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-[#0b8686] mb-6 font-parka">
            About <span className="text-[#FFB84D]">CERA Medical</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed font-montserrat">
            Advancing health through research and innovation — CERA Medical
            bridges the gap between scientific discovery and practical healthcare
            solutions. Our mission is to empower progress in biomedicine with
            integrity, precision, and care.
          </p>
        </section>

        {/* ✅ About Component */}
        <About />
      </main>

      {/* ✅ Footer Section */}
      <Footer />
    </div>
  );
};

export default AboutPage;
