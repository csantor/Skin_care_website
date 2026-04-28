import React from 'react';
import Button from '../components/common/Button';
import heroImage from '../assets/hero.png';

const Home = () => {
  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-surface-low min-h-[600px] flex items-center mb-12">
        <div className="absolute inset-y-0 right-0 w-full md:w-2/3 h-full overflow-hidden">
          <img 
            src={heroImage} 
            alt="Premium Skincare" 
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface-low via-surface-low/60 to-transparent"></div>
        </div>
        
        <div className="relative z-10 w-full md:w-1/2 px-8 lg:px-16 space-y-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold tracking-wide">
             <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
             THE DEWY CURATOR
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tighter text-on-surface leading-[0.9]">
            The Future of <br />
            <span className="text-primary italic font-medium">Bespoke</span> Skin.
          </h1>
          <p className="text-lg text-on-surface-variant max-w-md leading-relaxed">
            Move beyond generic health templates. Our AI curator provides high-end, editorial skincare experiences tailored to your unique morning clarity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button variant="primary" className="text-lg shadow-xl shadow-primary/30">
              Start Your Profile
            </Button>
            <Button variant="secondary">
              Explore Science
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Grid - Tonal Layering No Borders */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "Precision Analysis", desc: "Harnessing clinical-grade AI to decode your skin's silent signals.", icon: "◈" },
          { title: "Editorial Routines", desc: "Crafted like a high-end boutique magazine, for your eyes only.", icon: "✧" },
          { title: "Tactile Progress", desc: "Track every drop of progress with our fluid glass interface.", icon: "◎" }
        ].map((feature, i) => (
          <div key={i} className="bg-surface-lowest p-10 rounded-3xl transition-all hover:bg-white hover:shadow-xl hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-surface-low flex items-center justify-center text-primary text-2xl font-bold mb-6">
              {feature.icon}
            </div>
            <h3 className="text-2xl font-bold mb-4 tracking-tight">{feature.title}</h3>
            <p className="text-on-surface-variant leading-relaxed">
              {feature.desc}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;
