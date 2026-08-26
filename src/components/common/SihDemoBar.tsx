import React from 'react';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Play,
  X,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { useDemoWalkthrough, DEMO_STEPS } from '../../context/DemoWalkthroughContext';

export const SihDemoBar: React.FC = () => {
  const {
    isDemoActive,
    currentStepIndex,
    currentStep,
    stopDemo,
    nextStep,
    prevStep,
    goToStep,
    executeCurrentStepAction
  } = useDemoWalkthrough();

  if (!isDemoActive) return null;

  return (
    <div className="bg-slate-950 border-b-2 border-amber-500 text-white shadow-2xl px-3 sm:px-6 py-2.5 z-40 sticky top-14 transition-all">
      <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        
        {/* Left: Step Indicator & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SIH DEMO #{currentStep.stepNumber}</span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-amber-300 truncate">
                {currentStep.title}
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                ({currentStepIndex + 1}/{DEMO_STEPS.length})
              </span>
            </div>
            <p className="text-xs text-slate-300 line-clamp-1">
              {currentStep.shortDesc}
            </p>
          </div>
        </div>

        {/* Center: Step Pills on Large Screens */}
        <div className="hidden 2xl:flex items-center gap-1">
          {DEMO_STEPS.map((step, idx) => (
            <button
              key={step.stepNumber}
              onClick={() => goToStep(idx)}
              className={`w-6 h-6 rounded-full text-[10px] font-extrabold flex items-center justify-center transition-all ${
                idx === currentStepIndex
                  ? 'bg-amber-400 text-slate-950 scale-110 ring-2 ring-amber-300 shadow-md'
                  : idx < currentStepIndex
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
              title={`Step ${idx}: ${step.title}`}
            >
              {idx === 0 ? '0' : idx}
            </button>
          ))}
        </div>

        {/* Right: Controls & Action Trigger */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end flex-shrink-0">
          
          {/* Auto Action Button */}
          <button
            onClick={executeCurrentStepAction}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-transform active:scale-95"
            title="Automatically perform the action for this step"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Execute Action</span>
          </button>

          {/* Stepper Buttons */}
          <div className="flex items-center rounded-lg bg-slate-800 p-0.5 border border-slate-700">
            <button
              onClick={prevStep}
              disabled={currentStepIndex === 0}
              className="p-1.5 rounded hover:bg-slate-700 disabled:opacity-30 text-slate-300 transition-colors"
              title="Previous Demo Step"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 text-xs font-mono font-bold text-slate-300">
              {currentStepIndex + 1}/{DEMO_STEPS.length}
            </span>
            <button
              onClick={nextStep}
              disabled={currentStepIndex === DEMO_STEPS.length - 1}
              className="p-1.5 rounded hover:bg-slate-700 disabled:opacity-30 text-slate-300 transition-colors"
              title="Next Demo Step"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Close Demo */}
          <button
            onClick={stopDemo}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Exit Demo Mode"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
