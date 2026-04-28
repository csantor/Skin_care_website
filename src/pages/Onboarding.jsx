import React, { useState } from 'react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import RoutineTracker from '../components/features/RoutineTracker';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const steps = [
    { id: '01', label: 'Analysis' },
    { id: '02', label: 'Lifestyle' },
    { id: '03', label: 'Concerns' },
    { id: '04', label: 'Curation' }
  ];

  const handleNext = () => setStep(s => Math.min(s + 1, 4));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  return (
    <div className="pt-28 pb-12 px-4 max-w-4xl mx-auto min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4 uppercase">
          Skin <span className="text-primary italic">Profile</span> 0{step}
        </h1>
        <p className="text-on-surface-variant max-w-lg mx-auto leading-relaxed">
          Deep analysis of your skin's unique morning clarity. This session mimics the tactile sensation of a luxury clinical consultation.
        </p>
      </div>

      <RoutineTracker steps={steps} activeStep={step - 1} />

      <div className="mt-12 space-y-8">
        {step === 1 && (
          <Card tonal className="max-w-xl mx-auto space-y-8 p-10 animate-fade-in">
            <h3 className="text-2xl font-bold tracking-tight">Primary Skin Type</h3>
            <div className="grid grid-cols-2 gap-4">
              {['Dry', 'Oily', 'Combination', 'Sensitive'].map(type => (
                <button 
                  key={type}
                  className="p-6 rounded-2xl bg-surface-low text-on-surface font-bold hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1 active:scale-95"
                >
                  {type}
                </button>
              ))}
            </div>
          </Card>
        )}

        {step === 2 && (
          <Card tonal className="max-w-xl mx-auto space-y-8 p-10 animate-fade-in">
            <h3 className="text-2xl font-bold tracking-tight">Environmental Factors</h3>
            <p className="text-on-surface-variant italic">Select all that apply to your current residence.</p>
            <div className="space-y-4">
              {['Urban Pollution', 'Hard Water', 'High Humidity', 'Low Sunlight'].map(factor => (
                <div key={factor} className="flex items-center justify-between p-4 bg-surface-low rounded-xl group cursor-pointer hover:bg-surface-highest/50 transition-colors">
                  <span className="font-bold">{factor}</span>
                  <div className="w-6 h-6 rounded-full border-2 border-primary/20 group-hover:border-primary transition-all"></div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {step > 2 && (
          <Card tonal className="max-w-xl mx-auto p-10 flex flex-col items-center text-center space-y-6 animate-fade-in">
             <div className="w-20 h-20 rounded-full premium-gradient flex items-center justify-center text-white text-3xl animate-bounce">
                ◈
             </div>
             <h3 className="text-2xl font-bold tracking-tight">Processing Analysis...</h3>
             <p className="text-on-surface-variant italic max-w-sm">
                Our AI curator is currently deep-scanning your responses against 4,000+ ingredient formulations.
             </p>
          </Card>
        )}

        <div className="flex justify-between items-center max-w-xl mx-auto pt-8">
          <Button variant="ghost" onClick={handleBack} disabled={step === 1}>
            Previous
          </Button>
          <Button variant="primary" onClick={handleNext} disabled={step === 4} className="px-12">
            Next Level
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
