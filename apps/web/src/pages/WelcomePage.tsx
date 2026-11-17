import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FlaskConical,
  WifiOff
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
    <div className="flex-1 flex flex-col justify-between">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
        {/* Soft background accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-brand-50/80 via-emerald-50/20 to-transparent pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100/80 text-brand-800 text-xs font-semibold mb-6 border border-brand-200 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>GaonLab (गाँव लैब) Prototype • Stage 3</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-tight">
            Connecting Formal School STEM with{' '}
            <span className="text-brand-700 underline decoration-brand-300 decoration-wavy decoration-2">
              Everyday Experiential Science
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            An offline-first STEM education ecosystem built for rural and underserved learners.
            Explore school textbooks from <strong>CBSE / NCERT</strong> and the{' '}
            <strong>Karnataka State Board</strong>, anchored to real-world rural surroundings.
          </p>

          {/* Primary CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-600/20 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Student Registration</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/signin"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-200 shadow-2xs transition-all flex items-center justify-center gap-2"
            >
              <span>Sign In with Demo</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Demo Access Cards */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-16 w-full">
        <div className="text-center mb-6">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            One-Click Demonstration Profiles
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Instantly load real curriculum catalogues from the backend without creating an account
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Demo Student A Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  CBSE National Track
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Demo Fixture</span>
              </div>
              <h3 className="mt-3 text-lg font-bold text-slate-900">Asha Rao</h3>
              <p className="text-xs text-slate-600 mt-1">
                Class 8 • English Medium • Mathematics & Science
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded bg-slate-100 text-[11px] text-slate-600">
                  Ganita Prakash 8
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-[11px] text-slate-600">
                  Curiosity 8
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-[11px] text-slate-600">
                  NCERT Portal Links
                </span>
              </div>
            </div>

            <button
              onClick={() => handleQuickDemo('asha')}
              className="mt-5 w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-brand-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Explore as Asha (CBSE Class 8)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Demo Student B Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Karnataka State Board
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Demo Fixture</span>
              </div>
              <h3 className="mt-3 text-lg font-bold text-slate-900">Kavya Hegde</h3>
              <p className="text-xs text-slate-600 mt-1">
                Class 7 • ಕನ್ನಡ (Kannada Medium) • ಗಣಿತ ಮತ್ತು ವಿಜ್ಞಾನ
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded bg-slate-100 text-[11px] text-slate-600">
                  KTBS ಗಣಿತ 7
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-[11px] text-slate-600">
                  KTBS ವಿಜ್ಞಾನ 7
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-[11px] text-slate-600">
                  DSERT Curricula
                </span>
              </div>
            </div>

            <button
              onClick={() => handleQuickDemo('kavya')}
              className="mt-5 w-full py-2.5 px-4 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Explore as Kavya (KTBS Class 7 Kannada)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Feature Pillars Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="p-4 rounded-xl bg-slate-100/70 border border-slate-200/60">
            <WifiOff className="w-5 h-5 text-brand-700 mb-2" />
            <h4 className="font-bold text-xs text-slate-900">Offline-First Design</h4>
            <p className="text-[11px] text-slate-600 mt-1">
              Engineered for intermittent connectivity in rural villages and remote classrooms.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-100/70 border border-slate-200/60">
            <FlaskConical className="w-5 h-5 text-brand-700 mb-2" />
            <h4 className="font-bold text-xs text-slate-900">Experiential Pedagogy</h4>
            <p className="text-[11px] text-slate-600 mt-1">
              Links textbook chapters to farmland, local soil, ecosystems, and village tools.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-100/70 border border-slate-200/60">
            <ShieldCheck className="w-5 h-5 text-brand-700 mb-2" />
            <h4 className="font-bold text-xs text-slate-900">DPDP Act Safeguards</h4>
            <p className="text-[11px] text-slate-600 mt-1">
              Minor data protection, revocable guardian consent, and zero user profiling.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
