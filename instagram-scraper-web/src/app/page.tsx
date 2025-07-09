import Link from "next/link";
import { ArrowRight, Shield, Zap, BarChart3 } from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      icon: Shield,
      title: "Secure Auth",
      description: "Safe login with Playwright automation",
    },
    {
      icon: Zap,
      title: "Automated Collection",
      description: "Smart scraping and data organization",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Compare connections and manage contacts",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto py-8 text-center">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
          Automatize & Compare Instagram Connections
        </h1>

        <p className=" text-lg text-white/90 mb-8">
          Use secure authentication to log in with Instagram, collect profile
          data, and automatically compare who follows whom. We automate the
          login process with Playwright, scrape profile information, save
          followers and following lists using the official API, store profile
          pictures, and compare connections so you can manage your network with
          ease.
        </p>

        <Link
          href="/auth"
          className="inline-flex items-center space-x-3 bg-white text-[#dc6c6f] px-8 py-4 rounded-2xl font-bold text-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
        >
          <span>Start</span>
          <ArrowRight size={24} />
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-5">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="bg-white/15 backdrop-blur-xl rounded-3xl p-8 hover:bg-white/20 transition-all duration-300"
            >
              <div className="bg-white/20 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Icon size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-white/80">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
