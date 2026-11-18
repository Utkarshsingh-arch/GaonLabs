import React, { useState } from 'react';
import { ExperimentManifest } from '@gaonlab/shared-types';
import { Award, CheckCircle2, RotateCcw, Home, BookOpen, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CompletionPanelProps {
  manifest: ExperimentManifest;
  recordedObservationsCount: number;
  questionsCount: number;
  language?: string;
  onFinish: (reflectionNote: string) => Promise<void>;
  onRestart: () => void;
}

export const CompletionPanel: React.FC<CompletionPanelProps> = ({
  manifest,
  recordedObservationsCount,
  questionsCount,
  language: _language = 'en',
  onFinish,
  onRestart,
}) => {
  const navigate = useNavigate();
  const [reflection, setReflection] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await onFinish(reflection);
      setIsSaved(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#FA9C4D]/20 shadow-sm flex flex-col gap-6 text-center sm:text-left">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="w-16 h-16 rounded-3xl bg-[#FFEEDD] border-2 border-[#FA9C4D]/50 flex items-center justify-center text-[#FA9C4D] shadow-sm shrink-0">
          <Award className="w-8 h-8" />
        </div>
        <div className="flex-1">
          <span className="text-xs font-bold text-[#48AF76] bg-[#CEECDA]/60 px-3 py-1 rounded-full uppercase tracking-wider font-mono inline-block">
            Experiment Successfully Completed
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#2D2926] mt-2">
            Outstanding Work on {manifest.title}!
          </h2>
          <p className="text-xs text-[#6E675F] mt-1">
            You investigated the scientific question, tested empirical hypotheses, and connected formulas to practical village life.
          </p>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#FBFAF9] border border-[#CEECDA] rounded-2xl p-4 text-center">
          <span className="text-[10px] uppercase font-bold text-[#6E675F] font-mono block">
            Hypothesis
          </span>
          <span className="text-lg font-black text-[#48AF76] mt-1 block">Validated</span>
        </div>
        <div className="bg-[#FBFAF9] border border-[#CEECDA] rounded-2xl p-4 text-center">
          <span className="text-[10px] uppercase font-bold text-[#6E675F] font-mono block">
            Trials Logged
          </span>
          <span className="text-lg font-black text-[#FA9C4D] mt-1 block">
            {recordedObservationsCount} Trials
          </span>
        </div>
        <div className="bg-[#FBFAF9] border border-[#CEECDA] rounded-2xl p-4 text-center">
          <span className="text-[10px] uppercase font-bold text-[#6E675F] font-mono block">
            Investigation
          </span>
          <span className="text-lg font-black text-[#2D2926] mt-1 block">
            {questionsCount} Questions
          </span>
        </div>
        <div className="bg-[#FBFAF9] border border-[#CEECDA] rounded-2xl p-4 text-center">
          <span className="text-[10px] uppercase font-bold text-[#6E675F] font-mono block">
            Community Challenge
          </span>
          <span className="text-lg font-black text-[#48AF76] mt-1 block">Solved</span>
        </div>
      </div>

      {/* Learner Reflection Note Input */}
      <div className="bg-[#FBFAF9] border border-[#FA9C4D]/20 rounded-2xl p-5 text-left space-y-2">
        <label className="block text-xs font-bold text-[#2D2926] uppercase tracking-wider">
          Student Science Reflection (Saved to your profile)
        </label>
        <p className="text-xs text-[#6E675F]">
          What was the most surprising takeaway from this experiment? Write in your own words:
        </p>
        <textarea
          rows={3}
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="e.g. I realized that laundry soap turns turmeric red because soap is basic, and adding lime water makes phenolphthalein vivid magenta..."
          className="w-full text-xs p-3 rounded-xl border border-[#FA9C4D]/20 focus:outline-none focus:ring-2 focus:ring-[#FA9C4D] focus:border-[#FA9C4D] bg-white text-[#2D2926]"
        />
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting || isSaved}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#FA9C4D] hover:bg-[#EE8838] text-white rounded-xl text-xs font-bold transition disabled:opacity-60 shadow-sm"
          >
            {isSaved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            <span>{isSaved ? 'Reflection Saved!' : isSubmitting ? 'Saving...' : 'Save Lab Report'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="pt-4 border-t border-[#FA9C4D]/10 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onRestart}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#FA9C4D]/20 hover:bg-[#FFEEDD]/40 text-[#2D2926] text-xs font-bold transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Rerun Experiment</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/app/experiments')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2D2926] hover:bg-[#3D3834] text-white text-xs font-bold transition"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>More Experiments</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/app/dashboard')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#FA9C4D] hover:bg-[#EE8838] text-white text-xs font-bold transition shadow-sm"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Student Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
