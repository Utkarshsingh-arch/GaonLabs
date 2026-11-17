import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  ArrowLeft,
  Sun,
  Droplets,
  Wind
} from 'lucide-react';
import { SkillUpSidebar } from '../components/SkillUpSidebar';

export const VillageBuilderPage: React.FC = () => {
  const [activeModel, setActiveModel] = useState<string>('solar');

  const villageSimulations = [
    {
      id: 'solar',
      title: 'Solar Photovoltaic Irrigation',
      icon: Sun,
      curriculum: 'Class 8 Science (NCERT Ch 12: Electricity & Heating Effects)',
      efficiency: '88% Output',
      notes: 'Calculate kilowatt-hours and pump depth to supply 5 acres of crops.',
    },
    {
      id: 'water',
      title: 'Rainwater Gravity Harvesting',
      icon: Droplets,
      curriculum: 'Class 8 Science (NCERT Ch 11: Pressure & Fluids)',
      efficiency: '12,000 Litres Stored',
      notes: 'Model hydro-static pressure in rooftop collection channels.',
    },
    {
      id: 'wind',
      title: 'Mini Wind Turbine Aerodynamics',
      icon: Wind,
      curriculum: 'Class 8 Physics (NCERT Ch 10: Exploring Forces)',
      efficiency: '450 Watts Generated',
      notes: 'Analyze torque, blade pitch, and kinetic energy conversion.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FBFAF9] flex flex-col md:flex-row antialiased text-[#352F2A]">
      <SkillUpSidebar />

      <main className="flex-1 p-6 md:p-10 flex flex-col items-center justify-center max-w-4xl mx-auto w-full">
        {/* Module Header Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFEEDD] text-[#D47220] text-xs font-bold mb-6 border border-[#FFD9B8] shadow-soft-sm">
          <Building2 className="w-4 h-4 text-[#FA9C4D]" />
          <span>Village Systems Simulation • Owned by Prashanth</span>
        </div>

        {/* Hero Card */}
        <div className="bg-[#FFFFFF] p-8 rounded-3xl border border-[#EFECE6] shadow-soft-sm w-full text-center relative overflow-hidden">
          <div className="w-20 h-20 rounded-3xl bg-[#FFEEDD] border border-[#FFD9B8] text-[#FA9C4D] flex items-center justify-center shadow-soft-sm mx-auto mb-5">
            <Building2 className="w-10 h-10" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#352F2A] tracking-tight">
            STEM Village Builder
          </h1>

          <p className="mt-2 text-sm text-[#636160] max-w-lg mx-auto font-medium leading-relaxed">
            Build and transform a village ecosystem using science, physics, and ecology.
            Apply principles of fluid dynamics, solar electricity, and mechanical levers.
          </p>

          {/* Interactive Simulation Strip */}
          <div className="mt-8 pt-6 border-t border-[#EFECE6] text-left">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#352F2A] uppercase tracking-wider">
                Select a Village Infrastructure Model
              </span>
              <span className="text-[11px] font-bold text-[#48AF76] bg-[#CEECDA] px-2.5 py-0.5 rounded-full">
                Interactive Model
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {villageSimulations.map((sim) => {
                const Icon = sim.icon;
                return (
                  <button
                    key={sim.id}
                    onClick={() => setActiveModel(sim.id)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      activeModel === sim.id
                        ? 'bg-[#FFEEDD] border-[#FA9C4D] shadow-soft-sm'
                        : 'bg-[#FBFAF9] border-[#EFECE6] hover:bg-[#FAF5EF]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-xl bg-[#FFFFFF] border border-[#EFECE6] flex items-center justify-center text-[#FA9C4D]">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold text-[#48AF76]">
                        {sim.efficiency}
                      </span>
                    </div>
                    <h4 className="text-xs font-extrabold text-[#352F2A]">{sim.title}</h4>
                    <p className="text-[10px] text-[#9E9B97] mt-1 line-clamp-2">{sim.curriculum}</p>
                  </button>
                );
              })}
            </div>

            {activeModel && (
              <div className="mt-4 p-4 rounded-2xl bg-[#FAF5EF] border border-[#EFECE6] flex items-center justify-between gap-4 animate-in fade-in">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#D47220]">
                    Real-World Physics Link
                  </span>
                  <div className="text-xs font-bold text-[#352F2A] mt-0.5">
                    {villageSimulations.find((s) => s.id === activeModel)?.notes}
                  </div>
                </div>
                <Link
                  to="/app/dashboard"
                  className="px-3.5 py-1.5 rounded-xl bg-[#FA9C4D] text-white text-xs font-bold shadow-soft-sm hover:bg-[#EB8833] transition-colors shrink-0"
                >
                  Explore in Syllabus
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
