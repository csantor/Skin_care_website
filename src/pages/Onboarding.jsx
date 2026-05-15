import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import RoutineTracker from '../components/features/RoutineTracker';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { generateRecommendations } from '../lib/curator';
import { useLanguage } from '../context/LanguageContext';

const Onboarding = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  // Form State
  const [skinType, setSkinType] = useState('');
  const [lifestyle, setLifestyle] = useState([]);
  const [concerns, setConcerns] = useState([]);

  const steps = [
    { id: '01', label: 'Analysis' },
    { id: '02', label: 'Lifestyle' },
    { id: '03', label: 'Concerns' },
    { id: '04', label: 'Curation' }
  ];

  const toggleLifestyle = (item) => {
    setLifestyle(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const toggleConcern = (item) => {
    setConcerns(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const saveProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // 1. Generate Recommendations first
      const results = await generateRecommendations({ skin_type: skinType, lifestyle, concerns });
      setRecommendations(results);

      // 2. Save everything to Database
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          skin_type: skinType,
          lifestyle: lifestyle,
          concerns: concerns,
          saved_routine: results,
          updated_at: new Date()
        });

      if (error) throw error;
      setStep(4);
    } catch (err) {
      console.error('Error saving profile:', err);
      // Fallback: show recommendations even if DB fails
      const results = await generateRecommendations({ skin_type: skinType, lifestyle, concerns });
      setRecommendations(results);
      setStep(4);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 3) {
      saveProfile();
    } else {
      setStep(s => Math.min(s + 1, 4));
    }
  };

  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  return (
    <div className="pt-28 pb-12 px-4 max-w-4xl mx-auto min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4 uppercase">
          Skin <span className="text-primary italic">Profile</span> 0{step}
        </h1>
        <p className="text-on-surface-variant max-w-lg mx-auto leading-relaxed">
          {step < 4 
            ? "Deep analysis of your skin's unique morning clarity. This session mimics the tactile sensation of a luxury clinical consultation."
            : "Based on your unique profile, our AI curator has architected a bespoke morning ritual."}
        </p>
      </div>

      <RoutineTracker steps={steps} activeStep={step - 1} />

      <div className="mt-12 space-y-8">
        {step === 1 && (
          <Card tonal className="max-w-xl mx-auto space-y-8 p-10 animate-fade-in">
            <h3 className="text-2xl font-bold tracking-tight text-center">Primary Skin Type</h3>
            <div className="grid grid-cols-2 gap-4">
              {['Dry', 'Oily', 'Combination', 'Sensitive'].map(type => (
                <button 
                  key={type}
                  onClick={() => setSkinType(type)}
                  className={`p-6 rounded-2xl font-bold transition-all transform hover:-translate-y-1 active:scale-95 ${
                    skinType === type 
                      ? 'bg-primary text-white shadow-lg' 
                      : 'bg-surface-low text-on-surface hover:bg-surface-highest'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </Card>
        )}

        {step === 2 && (
          <Card tonal className="max-w-xl mx-auto space-y-8 p-10 animate-fade-in">
            <h3 className="text-2xl font-bold tracking-tight text-center">Environmental Factors</h3>
            <div className="space-y-4">
              {['Urban Pollution', 'Hard Water', 'High Humidity', 'Low Sunlight'].map(factor => (
                <div 
                  key={factor} 
                  onClick={() => toggleLifestyle(factor)}
                  className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-colors ${
                    lifestyle.includes(factor) ? 'bg-primary/10 border-primary' : 'bg-surface-low border-transparent'
                  } border-2`}
                >
                  <span className="font-bold">{factor}</span>
                  <div className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${
                    lifestyle.includes(factor) ? 'bg-primary border-primary' : 'border-primary/20'
                  }`}>
                    {lifestyle.includes(factor) && <span className="text-white text-xs">✓</span>}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {step === 3 && (
          <Card tonal className="max-w-xl mx-auto space-y-8 p-10 animate-fade-in">
            <h3 className="text-2xl font-bold tracking-tight text-center">Primary Concerns</h3>
            <div className="grid grid-cols-2 gap-4">
              {['Acne', 'Aging', 'Dullness', 'Redness', 'Dehydration'].map(concern => (
                <button 
                  key={concern}
                  onClick={() => toggleConcern(concern)}
                  className={`p-5 rounded-2xl font-bold transition-all border-2 ${
                    concerns.includes(concern) 
                      ? 'bg-primary/5 border-primary text-primary' 
                      : 'bg-surface-low border-transparent text-on-surface hover:border-surface-highest'
                  }`}
                >
                  {concern}
                </button>
              ))}
            </div>
          </Card>
        )}

        {step === 4 && (
          <div className="space-y-8 animate-fade-in">
            {loading ? (
              <Card tonal className="max-w-xl mx-auto p-10 flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 rounded-full premium-gradient flex items-center justify-center text-white text-3xl animate-spin">
                    ◈
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-on-surface">Synthesizing Formula...</h3>
                <p className="text-on-surface-variant italic">Scanning our library of 4,000+ clinical formulations for your match.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendations.map((product, idx) => (
                  <Card key={product.id} className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-500">
                    <div className="aspect-[16/9] relative bg-surface-low overflow-hidden">
                      <img 
                        src={product.metadata?.image_url || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop'} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        alt={product.name}
                      />
                      <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-widest text-primary">
                        {product.routine_type}
                      </div>
                    </div>
                    <div className="p-6 space-y-2">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">{product.brand}</span>
                      <h4 className="font-bold text-lg line-clamp-1">
                        {language === 'el' && product.metadata?.greek_title ? product.metadata.greek_title : product.name}
                      </h4>
                      <p className="text-sm text-on-surface-variant line-clamp-2 italic font-light leading-relaxed">
                        {product.description}
                      </p>
                      <Button variant="ghost" className="w-full mt-4" onClick={() => navigate(`/product/${product.id}`)}>
                        View Formulation
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between items-center max-w-xl mx-auto pt-8">
          <Button variant="ghost" onClick={handleBack} disabled={step === 1 || loading}>
            Previous
          </Button>
          {step < 4 ? (
            <Button 
              variant="primary" 
              onClick={handleNext} 
              disabled={(step === 1 && !skinType) || loading} 
              className="px-12"
            >
              {step === 3 ? 'Finalize Curation' : 'Next Level'}
            </Button>
          ) : (
            <Button variant="primary" onClick={() => navigate('/library')} className="px-12">
              Explore Library
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;

