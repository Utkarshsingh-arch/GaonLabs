import React from 'react';
import { useLocation } from 'react-router-dom';
import { ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const location = useLocation();

  if (location.pathname.startsWith('/app/')) {
    return null;
  }

  return (
    <footer className="mt-auto border-t border-[#EFECE6] bg-[#FFFFFF] py-7 text-xs text-[#636160]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="font-extrabold text-[#352F2A]">SkillUp • GaonLab (गाँव लैब)</span>
          <span className="inline-block w-1 h-1 rounded-full bg-[#D9D6D0]"></span>
          <span className="flex items-center gap-1.5 text-[#389461] font-semibold bg-[#CEECDA] px-2.5 py-0.5 rounded-full text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" /> DPDP Compliant Architecture
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-[#9E9B97]">
          <span>Built with</span>
          <Heart className="w-3 h-3 text-[#FA9C4D] fill-[#FA9C4D]" />
          <span>for rural & underserved learners across India</span>
        </div>
      </div>
    </footer>
  );
};
