import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FlaskConical,
  WifiOff,
  Flame
} from 'lucide-react';
import { DEMO_PROFILES, setDemoSession } from '../services/demoAuth';

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleQuickDemo = (profileKey: 'asha' | 'kavya') => {
    const profile = DEMO_PROFILES[profileKey];
    setDemoSession(profile);
    navigate('/app/dashboard');
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#FBFAF9]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
        {/* Soft warm background radial accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#FFEEDD]/60 via-[#FAF5EF]/30 to-transparent pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFEEDD] text-[#D47220] text-xs font-bold mb-6 border border-[#FFD9B8] shadow-soft-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#FA9C4D]" />
            <span>SkillUp • GaonLab (गाँव लैब) Prototype • Stage 3</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#352F2A] tracking-tight leading-tight sm:leading-tight">
            Connecting Formal School STEM with{' '}
            <span className="text-[#FA9C4D] underline decoration-[#FFCF4F] decoration-wavy decoration-2">
              Everyday Experiential Science
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-[#636160] max-w-2xl mx-auto leading-relaxed font-medium">
            An offline-first STEM education ecosystem built for rural and underserved learners.
            Explore school textbooks from <strong>CBSE / NCERT</strong> and the{' '}
            <strong>Karnataka State Board</strong>, anchored to real-world rural surroundings.
          </p>

          {/* Primary CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#FA9C4D] hover:bg-[#EB8833] text-white font-extrabold text-sm shadow-orange-glow transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group"
            >
              <span>Student Registration</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/signin"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#FFFFFF] hover:bg-[#FAF5EF] text-[#352F2A] font-bold text-sm border border-[#EFECE6] shadow-soft-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Sign In with Demo</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Demo Access Cards */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-16 w-full">
        <div className="text-center mb-7">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FA9C4D] uppercase tracking-wider mb-1">
            <Flame className="w-3.5 h-3.5 fill-[#FA9C4D]" /> Instant Access
          </div>
          <h2 className="text-xl font-extrabold text-[#352F2A]">
            One-Click Demonstration Profiles
          </h2>
          <p className="text-xs text-[#636160] mt-1 font-medium">
            Instantly load real curriculum catalogues from the backend without creating an account
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Demo Student A Card */}
          <div className="bg-[#FFFFFF] rounded-3xl p-6 border border-[#EFECE6] shadow-soft-sm hover:shadow-soft-md transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FFEEDD] text-[#D47220] border border-[#FFD9B8]">
                  CBSE National Track
                </span>
                <span className="text-[11px] text-[#9E9B97] font-semibold">Verified Snapshot</span>
              </div>
              <h3 className="mt-4 text-xl font-extrabold text-[#352F2A] group-hover:text-[#FA9C4D] transition-colors">
                Asha Rao
              </h3>
              <p className="text-xs text-[#636160] mt-1 font-medium">
                Class 8 • English Medium • Mathematics & Science
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-xl bg-[#F8F4EE] text-[11px] font-semibold text-[#636160]">
                  Ganita Prakash 8
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-[#F8F4EE] text-[11px] font-semibold text-[#636160]">
                  Curiosity 8
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-[#CEECDA] text-[11px] font-bold text-[#389461]">
                  13 Chapters
                </span>
              </div>
            </div>

            <button
              onClick={() => handleQuickDemo('asha')}
              className="mt-6 w-full py-3 px-4 rounded-2xl bg-[#352F2A] hover:bg-[#FA9C4D] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-soft-sm"
            >
              <span>Explore as Asha (CBSE Class 8)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Demo Student B Card */}
          <div className="bg-[#FFFFFF] rounded-3xl p-6 border border-[#EFECE6] shadow-soft-sm hover:shadow-soft-md transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#CEECDA] text-[#389461]">
                  Karnataka State Board
                </span>
                <span className="text-[11px] text-[#9E9B97] font-semibold">Verified Snapshot</span>
              </div>
              <h3 className="mt-4 text-xl font-extrabold text-[#352F2A] group-hover:text-[#FA9C4D] transition-colors">
                Kavya Hegde
              </h3>
              <p className="text-xs text-[#636160] mt-1 font-medium">
                Class 7 • ಕನ್ನಡ (Kannada Medium) • ಗಣಿತ ಮತ್ತು ವಿಜ್ಞಾನ
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-xl bg-[#F8F4EE] text-[11px] font-semibold text-[#636160]">
                  KTBS ಗಣಿತ 7
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-[#F8F4EE] text-[11px] font-semibold text-[#636160]">
                  KTBS ವಿಜ್ಞಾನ 7
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-[#CEECDA] text-[11px] font-bold text-[#389461]">
                  12 Chapters
                </span>
              </div>
            </div>

            <button
              onClick={() => handleQuickDemo('kavya')}
              className="mt-6 w-full py-3 px-4 rounded-2xl bg-[#FA9C4D] hover:bg-[#EB8833] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-orange-glow transition-all"
            >
              <span>Explore as Kavya (KTBS Class 7 Kannada)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Feature Pillars Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#EFECE6] shadow-soft-sm">
            <div className="w-10 h-10 rounded-2xl bg-[#FFEEDD] flex items-center justify-center text-[#FA9C4D] mb-3">
              <WifiOff className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-sm text-[#352F2A]">Offline-First Design</h4>
            <p className="text-xs text-[#636160] mt-1 leading-relaxed">
              Engineered for intermittent connectivity in rural villages and remote classrooms.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#EFECE6] shadow-soft-sm">
            <div className="w-10 h-10 rounded-2xl bg-[#FFCF4F]/30 flex items-center justify-center text-[#D47220] mb-3">
              <FlaskConical className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-sm text-[#352F2A]">Experiential Pedagogy</h4>
            <p className="text-xs text-[#636160] mt-1 leading-relaxed">
              Links textbook chapters to farmland, local soil, ecosystems, and village tools.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#EFECE6] shadow-soft-sm">
            <div className="w-10 h-10 rounded-2xl bg-[#CEECDA] flex items-center justify-center text-[#389461] mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-sm text-[#352F2A]">DPDP Act Safeguards</h4>
            <p className="text-xs text-[#636160] mt-1 leading-relaxed">
              Minor data protection, revocable guardian consent, and zero user profiling.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
