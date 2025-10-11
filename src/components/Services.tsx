"use client";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client"; // ✅ connect Supabase
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Microscope,
  FlaskConical,
  Activity,
  Dna,
  X,
} from "lucide-react";

const Services = () => {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const services = [
    {
      icon: Microscope,
      title: "Preclinical Studies",
      description:
        "Ensuring new treatments are safe and effective before human trials through comprehensive laboratory testing and analysis.",
      features: [
        "Safety Assessment",
        "Efficacy Testing",
        "Toxicology Studies",
        "Regulatory Compliance",
      ],
    },
    {
      icon: FlaskConical,
      title: "Biochemical Testing",
      description:
        "Detailed laboratory analysis of compounds and samples providing crucial research insights for drug development.",
      features: [
        "Compound Analysis",
        "Biomarker Testing",
        "Quality Control",
        "Method Development",
      ],
    },
    {
      icon: Activity,
      title: "Disease Modeling",
      description:
        "Simulating health conditions in controlled laboratory environments to test potential therapies and treatments.",
      features: [
        "In-Vitro Models",
        "Cellular Assays",
        "Pathway Analysis",
        "Therapeutic Testing",
      ],
    },
    {
      icon: Dna,
      title: "Molecular Research",
      description:
        "Advanced molecular biology techniques to understand genetic factors and develop targeted therapeutic approaches.",
      features: [
        "Genetic Analysis",
        "Protein Studies",
        "Gene Expression",
        "Molecular Diagnostics",
      ],
    },
  ];

  // Open modal with the selected service
  const handleOpenForm = (serviceTitle: string) => {
    setSelectedService(serviceTitle);
  };

  // ✅ Handle form submission (Supabase Insert)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: formData.name,
      email: formData.email,
      message: formData.message,
      service: selectedService,
    };

    try {
      const { error } = await supabase.from("research_requests").insert([payload]);

      if (error) {
        console.error("❌ Supabase error:", error);
        alert("Something went wrong! Please try again.");
        setLoading(false);
        return;
      }

      alert("✅ Your request has been submitted successfully!");
      setSelectedService(null);
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("⚠️ Unexpected error:", err);
      alert("Unexpected error occurred!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="services" className="py-20 bg-white font-sans relative">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block px-5 py-2 bg-[#0b8686]/10 text-[#0b8686] rounded-full text-sm font-semibold mb-6 font-parka">
            Our Services
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight font-parka">
            Comprehensive Research{" "}
            <span className="text-[#FFB84D]">Solutions</span>
          </h2>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed font-montserrat">
            We provide end-to-end research services that bridge the gap between
            scientific discovery and practical healthcare applications,
            ensuring the highest standards of quality and reliability.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => (
            <div
              key={index}
              onClick={() => handleOpenForm(service.title)}
              className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#0b8686]/40 cursor-pointer hover:scale-[1.02]"
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0b8686] text-white shadow-md group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="h-8 w-8" />
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-[#0b8686] mb-3 font-parka">
                    {service.title}
                  </h3>

                  <p className="text-gray-700 mb-4 leading-relaxed font-montserrat">
                    {service.description}
                  </p>

                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center text-sm text-gray-700 font-montserrat"
                      >
                        <div className="w-2 h-2 bg-[#FFB84D] rounded-full mr-3 flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 text-right">
                <span className="text-[#0b8686] text-sm font-semibold group-hover:underline flex justify-end items-center gap-1">
                  Avail this service or join research
                  <ArrowRight className="h-4 w-4 inline-block" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ MODAL FORM */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md relative shadow-xl animate-fade-in">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-[#0b8686]"
              onClick={() => setSelectedService(null)}
            >
              <X className="h-6 w-6" />
            </button>

            <h3 className="text-2xl font-semibold text-[#0b8686] mb-2 font-parka">
              Join Research / Avail Service
            </h3>
            <p className="text-gray-600 mb-6 text-sm font-montserrat">
              You are interested in:{" "}
              <span className="font-semibold text-[#FFB84D]">
                {selectedService}
              </span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#0b8686]"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#0b8686]"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
              <textarea
                placeholder="Message / Research Interest"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#0b8686]"
                rows={3}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
              ></textarea>

              <Button
                type="submit"
                disabled={loading}
                className={`w-full ${
                  loading
                    ? "bg-gray-400"
                    : "bg-[#0b8686] hover:bg-[#097373]"
                } text-white font-semibold py-3 rounded-lg shadow-md transition-all`}
              >
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Services;
