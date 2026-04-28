import React from 'react';
import GlassContainer from '../common/GlassContainer';

const RoutineTracker = ({ steps = [], activeStep = 0 }) => {
  return (
    <div className="flex items-center justify-center -space-x-8 py-12">
      {steps.map((step, index) => {
        const isActive = index === activeStep;
        const isCompleted = index < activeStep;
        
        return (
          <div key={index} className="relative group flex flex-col items-center translate-y-0 transition-transform duration-500">
            <GlassContainer 
              className={`w-32 h-32 rounded-full flex items-center justify-center p-4 shadow-xl border-none transition-all duration-700
                ${isActive ? 'w-40 h-40 scale-110 z-20 bg-white ring-8 ring-primary/5' : 'scale-90 opacity-60 z-10'}
                ${isCompleted ? 'premium-gradient !opacity-100 !ring-0' : 'bg-white/40'}
              `}
            >
              <div className={`p-4 rounded-full ${isActive ? 'bg-primary/5 scale-110' : ''}`}>
                <span className={`text-sm font-bold tracking-tighter transition-colors ${isCompleted ? 'text-white' : isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
                  {isCompleted ? '✔' : step.id}
                </span>
              </div>
            </GlassContainer>
            
            <div className={`mt-6 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
              <span className="text-sm font-bold text-primary tracking-widest uppercase italic">{step.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RoutineTracker;
