'use client';

import React, { useState } from 'react';
import { WizardStep1 } from './Step1';
import { WizardStep2 } from './Step2';
import { WizardStep3 } from './Step3';
import { WizardStep4 } from './Step4';

type WizardStep = 1 | 2 | 3 | 4;

interface WizardState {
  step: WizardStep;
  type?: string;
  subtype?: string;
  formData?: Record<string, string>;
  generatedLetter?: string;
}

const STEP_LABELS = ['Jenis Surat', 'Tipe Spesifik', 'Isi Formulir', 'Unduh'];

export function WizardContainer(): JSX.Element {
  const [state, setState] = useState<WizardState>({ step: 1 });

  const handleNext = (data: Partial<WizardState>): void => {
    setState((prev) => ({
      ...prev,
      ...data,
      step: Math.min(4, prev.step + 1) as WizardStep,
    }));
  };

  const handlePrev = (): void => {
    setState((prev) => ({
      ...prev,
      step: Math.max(1, prev.step - 1) as WizardStep,
    }));
  };

  const handleRestart = (): void => {
    setState({ step: 1 });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top progress bar */}
      <div className="h-1 bg-gray-200">
        <div
          className="h-1 bg-primary-500 transition-all duration-300"
          style={{ width: `${(state.step / 4) * 100}%` }}
        />
      </div>

      {/* Step indicators */}
      <div className="border-b border-gray-100 bg-white px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          {STEP_LABELS.map((label, i) => {
            const stepNum = (i + 1) as WizardStep;
            const isActive = stepNum === state.step;
            const isDone = stepNum < state.step;
            return (
              <div key={label} className="flex flex-col items-center gap-0.5">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    isDone
                      ? 'bg-primary-500 text-white'
                      : isActive
                      ? 'bg-primary-100 text-primary-600 border-2 border-primary-500'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {isDone ? '✓' : stepNum}
                </div>
                <span
                  className={`text-xs hidden sm:block ${
                    isActive ? 'text-primary-600 font-semibold' : 'text-gray-400'
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-6 md:py-10">
        {state.step === 1 && (
          <WizardStep1 onNext={(d) => handleNext(d)} />
        )}
        {state.step === 2 && state.type && (
          <WizardStep2
            type={state.type}
            onNext={(d) => handleNext(d)}
            onPrev={handlePrev}
          />
        )}
        {state.step === 3 && state.subtype && (
          <WizardStep3
            subtype={state.subtype}
            onNext={(d) => handleNext(d)}
            onPrev={handlePrev}
          />
        )}
        {state.step === 4 && state.generatedLetter && (
          <WizardStep4
            letter={state.generatedLetter}
            onPrev={handlePrev}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  );
}
