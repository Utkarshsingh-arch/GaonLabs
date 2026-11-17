import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span>GaonLab (गाँव लैब) — Prototype Stage 3</span>
          <span className="inline-block w-1 h-1 rounded-full bg-slate-300"></span>
          <span className="flex items-center gap-1 text-slate-600">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-600" /> DPDP Compliant Architecture
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <span>Built for rural & underserved learners across India</span>
        </div>
      </div>
    </footer>
  );
};
