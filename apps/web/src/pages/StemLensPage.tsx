import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Camera,
  CheckCircle2
} from 'lucide-react';
import { SkillUpSidebar } from '../components/SkillUpSidebar';

export const StemLensPage: React.FC = () => {
  const [capturedItem, setCapturedItem] = useState<string | null>(null);

  const sampleSubjects = [
    {
      id: 'leaf',
      title: 'Neem Leaf Stomata',
      curriculum: 'Class 8 Science (NCERT Ch 1)',
      concept: 'Photosynthesis & Transpiration',
      badge: 'Biology',
    },
    {
      id: 'water-pump',
      title: 'Centrifugal Well Pump',
      curriculum: 'Class 8 Science (NCERT Ch 11)',
      concept: 'Atmospheric Pressure & Fluid Dynamics',
      badge: 'Physics',
    },
    {
      id: 'soil',
      title: 'Black Cotton Soil Sample',
      curriculum: 'Class 7 & 8 Science',
      concept: 'Capillary Action & Soil Permeability',
      badge: 'Earth Science',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FBFAF9] flex flex-col md:flex-row antialiased text-[#352F2A]">
      <SkillUpSidebar />

      <main className="flex-1 p-6 md:p-10 flex flex-col items-center justify-center max-w-4xl mx-auto w-full">
        {/* Module Header Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFEEDD] text-[#D47220] text-xs font-bold mb-6 border border-[#FFD9B8] shadow-soft-sm">
          <Camera className="w-4 h-4 text-[#FA9C4D]" />
          <span>Experiential Visual STEM Lab • Owned by Robin</span>
        </div>

        {/* Hero Card */}
        <div className="bg-[#FFFFFF] p-8 rounded-3xl border border-[#EFECE6] shadow-soft-sm w-full text-center relative overflow-hidden">
          <div className="w-20 h-20 rounded-3xl bg-[#FFEEDD] border border-[#FFD9B8] text-[#FA9C4D] flex items-center justify-center shadow-soft-sm mx-auto mb-5">
            <Camera className="w-10 h-10" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#352F2A] tracking-tight">
            STEM Lens Camera Lab
          </h1>

          <p className="mt-2 text-sm text-[#636160] max-w-lg mx-auto font-medium leading-relaxed">
            Discover the mathematics, physics, and biology hidden in your rural surroundings.
            Point the lens at real-world objects to link them directly with textbook chapters.
          </p>

          {/* Interactive Simulation Strip */}
          <div className="mt-8 pt-6 border-t border-[#EFECE6] text-left">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#352F2A] uppercase tracking-wider">
                Select an Object to Analyze
              </span>
              <span className="text-[11px] font-bold text-[#48AF76] bg-[#CEECDA] px-2.5 py-0.5 rounded-full">
                Interactive Preview
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {sampleSubjects.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCapturedItem(item.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    capturedItem === item.id
                      ? 'bg-[#FFEEDD] border-[#FA9C4D] shadow-soft-sm'
                      : 'bg-[#FBFAF9] border-[#EFECE6] hover:bg-[#FAF5EF]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FFFFFF] text-[#FA9C4D] border border-[#EFECE6]">
                      {item.badge}
                    </span>
                    {capturedItem === item.id && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#FA9C4D]" />
                    )}
                  </div>
                  <h4 className="text-xs font-extrabold text-[#352F2A]">{item.title}</h4>
                  <p className="text-[10px] text-[#9E9B97] mt-1">{item.curriculum}</p>
                </button>
              ))}
            </div>

            {capturedItem && (
              <div className="mt-4 p-4 rounded-2xl bg-[#FAF5EF] border border-[#EFECE6] flex items-center justify-between gap-4 animate-in fade-in">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#D47220]">
                    Syllabus Anchor Verified
                  </span>
                  <div className="text-xs font-bold text-[#352F2A] mt-0.5">
                    {sampleSubjects.find((s) => s.id === capturedItem)?.concept}
                  </div>
                </div>
                <Link
                  to="/app/dashboard"
                  className="px-3.5 py-1.5 rounded-xl bg-[#FA9C4D] text-white text-xs font-bold shadow-soft-sm hover:bg-[#EB8833] transition-colors shrink-0"
                >
                  Read NCERT Chapter
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Back Link */}
        <Link
          to="/app/dashboard"
          className="mt-6 flex items-center gap-2 text-xs font-bold text-[#636160] hover:text-[#FA9C4D] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
      </main>
    </div>
  );
};
