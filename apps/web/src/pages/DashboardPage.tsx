import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  BookOpen,
  RefreshCw,
  LogOut,
  AlertTriangle,
  AlertCircle,
  Camera,
  Building2,
  ArrowRight,
  Globe,
  Clock,
  Sparkles,
  CheckCircle2,
  Compass,
  FlaskConical
} from 'lucide-react';
import {
  getDemoSession,
  setDemoSession,
  clearDemoSession,
  DEMO_PROFILES
} from '../services/demoAuth';
import { fetchCatalogue, fetchFeatureCatalogue } from '../services/api';
import { TextbookCard } from '../components/TextbookCard';
import { DemoNotice } from '../components/DemoNotice';
import { CatalogueEntry, DemoProfile, FeatureModuleItem, TextbookEditionItem } from '../types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  // Load session or default to Asha Rao
  const [profile, setProfile] = useState<DemoProfile>(() => {
    const existing = getDemoSession();
    if (existing) return existing;
    setDemoSession(DEMO_PROFILES.asha);
    return DEMO_PROFILES.asha;
  });

  const [languagePreference, setLanguagePreference] = useState<string>(() => {
    const existing = getDemoSession();
    return existing?.medium || 'en';
  });
  const [catalogue, setCatalogue] = useState<CatalogueEntry[]>([]);
  const [features, setFeatures] = useState<FeatureModuleItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFallback, setIsFallback] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [activeSubjectFilter, setActiveSubjectFilter] = useState<string>('ALL');

  // Load curriculum from API
  const loadCurriculum = async (currentProfile: DemoProfile) => {
    setIsLoading(true);
    setApiError(null);

    try {
      const [catalogueRes, featuresRes] = await Promise.all([
        fetchCatalogue({
          boardId: currentProfile.boardId,
          grade: currentProfile.grade,
          medium: currentProfile.medium,
        }),
        fetchFeatureCatalogue(),
      ]);

      setCatalogue(catalogueRes.data || []);
      setFeatures(featuresRes.data || []);
      setIsFallback(catalogueRes.isFallback || featuresRes.isFallback);

      if (catalogueRes.error) {
        setApiError(catalogueRes.error);
      }
    } catch (err: any) {
      console.error('Failed to load student curriculum:', err);
      setApiError(err.message || 'Error communicating with curriculum backend');
      setIsFallback(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCurriculum(profile);
  }, [profile.boardId, profile.grade, profile.medium]);

  // Switch between demo profiles directly from dashboard
  const handleSwitchProfile = (key: 'asha' | 'kavya') => {
    const newProfile = DEMO_PROFILES[key];
    setProfile(newProfile);
    setDemoSession(newProfile);
    setLanguagePreference(newProfile.medium);
    setActiveSubjectFilter('ALL');
  };

  const handleLogout = () => {
    clearDemoSession();
    navigate('/');
  };

  // Flatten prescribed textbook editions from catalogue
  const textbookCards: Array<{
    edition: TextbookEditionItem;
    subjectName: string;
    stemPillar: string;
  }> = [];

  catalogue.forEach((entry) => {
    entry.curriculumTextbooks?.forEach((ct) => {
      if (ct.textbookEdition) {
        textbookCards.push({
          edition: ct.textbookEdition,
          subjectName: entry.subject?.name || 'STEM Subject',
          stemPillar: entry.subject?.stemPillar || 'SCIENCE',
        });
      }
    });
  });

  const filteredTextbooks =
    activeSubjectFilter === 'ALL'
      ? textbookCards
      : textbookCards.filter((t) =>
          t.subjectName.toLowerCase().includes(activeSubjectFilter.toLowerCase())
        );

  // Separate Math & Science editions for "My Learning" overview
  const mathTextbook = textbookCards.find((t) => t.stemPillar === 'MATHEMATICS');
  const scienceTextbook = textbookCards.find((t) => t.stemPillar === 'SCIENCE');

  // Extract STEM Lens and Village Builder from feature registry
  const stemLensFeature = features.find((f) => f.featureId === 'STEM_LENS');
  const villageBuilderFeature = features.find((f) => f.featureId === 'VILLAGE_BUILDER');

  return (
    <div className="flex-1 flex flex-col bg-slate-50/60">
      {/* Banner */}
      <DemoNotice isFallback={isFallback} />

      {apiError && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-2 text-xs text-red-700 flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>Curriculum Service Notice: {apiError}</span>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full flex-1 space-y-8">
        {/* =========================================================================
            1. HEADER & ACADEMIC OVERVIEW
           ========================================================================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-brand-100/60 via-emerald-50/30 to-transparent pointer-events-none rounded-bl-full -z-0" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-100 text-brand-800 border border-brand-200">
                  Student Learning Dashboard
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {profile.boardId === 'CBSE' ? 'CBSE National Track' : 'Karnataka State Board Track'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome back, {profile.name}! 👋
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                Class {profile.grade} • {profile.boardName} • {profile.schoolName || 'Govt. Model School'}
              </p>
            </div>

            {/* Academic Badges & Language Selector */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Language Selector */}
              <div className="bg-slate-50 p-1.5 rounded-2xl border border-slate-200/80 flex items-center gap-1 self-start sm:self-auto">
                <Globe className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1" />
                <button
                  onClick={() => setLanguagePreference('en')}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
                    languagePreference === 'en'
                      ? 'bg-white text-slate-900 shadow-2xs font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguagePreference('hi')}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
                    languagePreference === 'hi'
                      ? 'bg-white text-slate-900 shadow-2xs font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  हिन्दी
                </button>
                <button
                  onClick={() => setLanguagePreference('kn')}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
                    languagePreference === 'kn'
                      ? 'bg-white text-slate-900 shadow-2xs font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  ಕನ್ನಡ
                </button>
              </div>

              {/* Academic Overview Card Pills */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200/80 text-center text-xs">
                <div className="px-3 py-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Class</div>
                  <div className="text-sm font-bold text-slate-900">Class {profile.grade}</div>
                </div>

                <div className="px-3 py-1 border-x border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Board</div>
                  <div className="text-sm font-bold text-slate-900">
                    {profile.boardId === 'CBSE' ? 'CBSE' : 'KTBS'}
                  </div>
                </div>

                <div className="px-3 py-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Medium</div>
                  <div className="text-sm font-bold text-slate-900 truncate" title={profile.mediumName}>
                    {profile.medium === 'en' ? 'English' : profile.medium === 'kn' ? 'Kannada' : profile.medium}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Demo Switcher & Status Row */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-slate-500">Switch Demo Student:</span>
              <button
                onClick={() => handleSwitchProfile('asha')}
                className={`px-3 py-1 rounded-xl border text-xs font-medium transition-all ${
                  profile.email === DEMO_PROFILES.asha.email
                    ? 'bg-blue-50 border-blue-400 text-blue-800 font-bold shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Asha Rao (CBSE Class 8)
              </button>
              <button
                onClick={() => handleSwitchProfile('kavya')}
                className={`px-3 py-1 rounded-xl border text-xs font-medium transition-all ${
                  profile.email === DEMO_PROFILES.kavya.email
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-800 font-bold shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Kavya Hegde (KTBS Class 7 Kannada)
              </button>
            </div>

            <button
              onClick={() => loadCurriculum(profile)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Curriculum</span>
            </button>
          </div>
        </section>

        {/* =========================================================================
            2. EXPLORE STEM — PROMINENT FEATURE CARDS (Robin & Prashanth)
           ========================================================================= */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Explore STEM</h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Experiential STEM learning modules connecting theory to village reality
              </p>
            </div>
            <span className="hidden sm:inline-block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Autonomous Feature Modules
            </span>
          </div>

          {/* Featured: Visual Topic Library & Narrated Videos */}
          <div className="mb-5 bg-gradient-to-r from-brand-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-lg border border-brand-700/40 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="relative z-10 max-w-2xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  {profile.medium === 'kn' ? 'ಹೊಸತು • 7ನೇ ತರಗತಿ ಕನ್ನಡ ಮಾಧ್ಯಮ' : 'NEW • STAGE 3 LIVE'}
                </span>
                <span className="text-[11px] text-brand-200">
                  {profile.medium === 'kn' ? 'KTBS Class 7 STEM Hub' : 'Classes 1–12 STEM Hub'}
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-white tracking-tight">
                {profile.medium === 'kn'
                  ? 'Explore STEM: ಪರಿಕಲ್ಪನೆಗಳು, ಸಚಿತ್ರ ಪಾಠಗಳು ಮತ್ತು ಕನ್ನಡ ವೀಡಿಯೊಗಳು'
                  : 'Explore STEM: Concepts, Illustrated Lessons & Narrated Videos'}
              </h3>
              <p className="mt-1.5 text-xs text-brand-100/90 leading-relaxed">
                {profile.medium === 'kn'
                  ? '7ನೇ ತರಗತಿ ವಿಜ್ಞಾನ ಮತ್ತು ಗಣಿತದ ಮೂಲ ಪರಿಕಲ್ಪನೆಗಳು, ಕನ್ನಡ ಧ್ವನಿ ವಿವರಣೆಯೊಂದಿಗೆ ಅನಿಮೇಷನ್ ವೀಡಿಯೊಗಳು ಮತ್ತು ಅಧಿಕೃತ KTBS ಪಠ್ಯಪುಸ್ತಕ ಉಲ್ಲೇಖಗಳು.'
                  : 'Discover fundamental STEM principles, watch HD narrated animations with subtitles, and reference verified textbook chapters across CBSE and Karnataka curricula.'}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {profile.medium === 'kn' ? (
                  <>
                    <Link
                      to="/app/explore/topics/topic-ktbs-heat-cl7-kn?tab=watch"
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/30 hover:bg-emerald-500/40 text-emerald-100 text-[11px] font-semibold transition border border-emerald-400/40"
                    >
                      🌡️ 7ನೇ ತರಗತಿ ಉಷ್ಣ (Heat Video)
                    </Link>
                    <Link
                      to="/app/explore/topics/topic-ktbs-integers-cl7-kn?tab=read"
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold transition border border-white/10"
                    >
                      🔢 7ನೇ ತರಗತಿ ಪೂರ್ಣಾಂಕಗಳು (Integers)
                    </Link>
                    <Link
                      to="/app/explore/topics/topic-ktbs-motion-time-cl7-kn?tab=read"
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold transition border border-white/10"
                    >
                      ⏳ 7ನೇ ತರಗತಿ ಚಲನೆ ಮತ್ತು ಕಾಲ (Motion & Time)
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/app/explore/topics/topic-shapes-class3?tab=watch"
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold transition border border-white/10"
                    >
                      📐 Class 3 Shapes Video
                    </Link>
                    <Link
                      to="/app/explore/topics/topic-forces-friction-cl8?tab=watch"
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold transition border border-white/10"
                    >
                      ⚙️ Class 8 Friction Video
                    </Link>
                    <Link
                      to="/app/explore/topics/topic-rotational-motion-cl11?tab=watch"
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold transition border border-white/10"
                    >
                      🔄 Class 11 Rotation Video
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className="relative z-10 shrink-0">
              <Link
                to="/app/explore"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-brand-500 hover:bg-brand-400 text-white font-extrabold text-xs shadow-lg shadow-brand-500/30 transition-all hover:scale-105"
              >
                <Compass className="w-4 h-4" />
                <span>{profile.medium === 'kn' ? 'Explore STEM (ಅನ್ವೇಷಿಸಿ)' : 'Open Explore STEM'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* 1. STEM Lens Card (Robin) */}
            <div className="group relative bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 rounded-3xl p-6 text-white shadow-lg shadow-indigo-950/15 overflow-hidden flex flex-col justify-between border border-indigo-800/40 hover:border-indigo-500/50 transition-all hover:-translate-y-0.5">
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-56 h-56 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/20 transition-all" />

              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-white tracking-tight">
                        {stemLensFeature?.name || 'STEM Lens'}
                      </h3>
                      <span className="text-[10px] text-indigo-300 font-medium">
                        Owned by Robin
                      </span>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    <Clock className="w-3 h-3" />
                    {stemLensFeature?.status || 'INTEGRATION_PENDING'}
                  </span>
                </div>

                <p className="text-xs text-indigo-100/90 leading-relaxed font-normal">
                  {stemLensFeature?.description ||
                    'Discover the science behind everyday objects. Explore the mathematics, physics, biology and engineering hidden in the world around you.'}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5 text-[10px] font-medium text-indigo-200/80">
                  <span className="px-2 py-0.5 rounded-lg bg-indigo-900/60 border border-indigo-700/40">
                    🔍 Object Exploration
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-indigo-900/60 border border-indigo-700/40">
                    🌾 Rural Mechanics
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-indigo-800/40 flex items-center justify-between gap-3">
                <span className="text-[11px] text-indigo-300/80 italic">
                  Integration Contract Ready
                </span>
                <Link
                  to="/app/stem-lens"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all group-hover:scale-[1.02]"
                >
                  <span>Open STEM Lens</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* 2. STEM Village Builder Card (Prashanth) */}
            <div className="group relative bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-950 rounded-3xl p-6 text-white shadow-lg shadow-teal-950/15 overflow-hidden flex flex-col justify-between border border-teal-800/40 hover:border-emerald-500/50 transition-all hover:-translate-y-0.5">
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition-all" />

              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-white tracking-tight">
                        {villageBuilderFeature?.name || 'STEM Village Builder'}
                      </h3>
                      <span className="text-[10px] text-emerald-300 font-medium">
                        Owned by Prashanth
                      </span>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    <Clock className="w-3 h-3" />
                    {villageBuilderFeature?.status || 'INTEGRATION_PENDING'}
                  </span>
                </div>

                <p className="text-xs text-emerald-100/90 leading-relaxed font-normal">
                  {villageBuilderFeature?.description ||
                    'Build, develop and transform a village using science, technology and engineering. Solve real-world challenges and improve your virtual community.'}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5 text-[10px] font-medium text-emerald-200/80">
                  <span className="px-2 py-0.5 rounded-lg bg-teal-900/60 border border-teal-700/40">
                    🌱 Agri-Physics
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-teal-900/60 border border-teal-700/40">
                    ⚡ Solar & Water
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-teal-800/40 flex items-center justify-between gap-3">
                <span className="text-[11px] text-emerald-300/80 italic">
                  Integration Contract Ready
                </span>
                <Link
                  to="/app/village-builder"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all group-hover:scale-[1.02]"
                >
                  <span>Open Village Builder</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* 3. GaonLab Experiment Studio Card (New Core Feature) */}
            <div className="group relative bg-gradient-to-br from-violet-950 via-purple-950 to-slate-950 rounded-3xl p-6 text-white shadow-lg shadow-purple-950/20 overflow-hidden flex flex-col justify-between border border-purple-800/50 hover:border-purple-400/60 transition-all hover:-translate-y-0.5">
              {/* Background glow */}
              <div className="absolute top-0 right-0 w-56 h-56 bg-purple-500/15 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/25 transition-all" />

              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
                      <FlaskConical className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-white tracking-tight">
                        Experiment Studio
                      </h3>
                      <span className="text-[10px] text-purple-300 font-medium font-mono">
                        Virtual STEM Lab
                      </span>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                    <CheckCircle2 className="w-3 h-3" />
                    LIVE BENCH
                  </span>
                </div>

                <p className="text-xs text-purple-100/90 leading-relaxed font-normal">
                  Conduct interactive laboratory simulations across Chemistry (Acids, Bases, Indicators) and Physics (Friction, Kinematics, Forces) through a 7-phase inquiry cycle.
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5 text-[10px] font-medium text-purple-200/80">
                  <span className="px-2 py-0.5 rounded-lg bg-purple-900/60 border border-purple-700/40">
                    🧪 Chemistry Reactions
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-purple-900/60 border border-purple-700/40">
                    ⚙️ Force Vectors
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-purple-800/40 flex items-center justify-between gap-3">
                <span className="text-[11px] text-purple-300/80 italic font-mono">
                  Offline Ready
                </span>
                <Link
                  to="/app/experiments"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all group-hover:scale-[1.02]"
                >
                  <span>Launch Lab Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. MY LEARNING (Mathematics & Science Overview)
           ========================================================================= */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-brand-700" />
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">My Learning</h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Active STEM curriculum tracks for Academic Year 2026–27
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Mathematics Subject Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
                    Mathematics
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active Track
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {mathTextbook?.edition?.titleInLanguage || 'Mathematics - Middle School'}
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  {mathTextbook?.edition?.totalChapters || 13} verified chapters indexed for Grade{' '}
                  {profile.grade}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 font-medium">
                  {profile.boardId === 'CBSE' ? 'NCERT Reference' : 'KTBS Prescribed'}
                </span>
                {mathTextbook?.edition?.id ? (
                  <Link
                    to={`/app/books/${mathTextbook.edition.id}`}
                    className="font-semibold text-brand-700 hover:text-brand-800 flex items-center gap-1"
                  >
                    <span>Read Book & Chapters</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <button
                    onClick={() => setActiveSubjectFilter('Mathematics')}
                    className="font-semibold text-brand-700 hover:text-brand-800"
                  >
                    View Textbook Details →
                  </button>
                )}
              </div>
            </div>

            {/* Science Subject Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                    Natural Science
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active Track
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {scienceTextbook?.edition?.titleInLanguage || 'Integrated Science - Middle School'}
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  {scienceTextbook?.edition?.totalChapters || 13} verified chapters indexed for Grade{' '}
                  {profile.grade}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 font-medium">
                  {profile.boardId === 'CBSE' ? 'NCERT Reference' : 'KTBS Prescribed'}
                </span>
                {scienceTextbook?.edition?.id ? (
                  <Link
                    to={`/app/books/${scienceTextbook.edition.id}`}
                    className="font-semibold text-brand-700 hover:text-brand-800 flex items-center gap-1"
                  >
                    <span>Read Book & Chapters</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <button
                    onClick={() => setActiveSubjectFilter('Science')}
                    className="font-semibold text-brand-700 hover:text-brand-800"
                  >
                    View Textbook Details →
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. MY TEXTBOOKS (Retrieved from Backend Curriculum API)
           ========================================================================= */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-700" />
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">My Textbooks</h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Official prescribed textbook editions retrieved from GaonLab curriculum database
              </p>
            </div>

            {/* Subject Filter Pills & Library Link */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <Link
                to="/app/library"
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 hover:bg-brand-100 text-brand-800 border border-brand-200 rounded-xl text-xs font-bold transition flex-shrink-0"
              >
                <span>Browse Full Library</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              {['ALL', 'Mathematics', 'Science'].map((sub) => (
                <button
                  key={sub}
                  onClick={() => setActiveSubjectFilter(sub)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all flex-shrink-0 ${
                    activeSubjectFilter === sub
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {sub === 'ALL' ? 'All Textbooks' : sub}
                </button>
              ))}
            </div>
          </div>

          {/* Loading / Error / Empty States */}
          {isLoading ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-semibold text-slate-700">Connecting to Curriculum Database...</p>
              <p className="text-[11px] text-slate-400 mt-1">Resolving textbook editions & chapters</p>
            </div>
          ) : filteredTextbooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredTextbooks.map(({ edition, subjectName, stemPillar }) => (
                <TextbookCard
                  key={edition.id}
                  edition={edition}
                  subjectName={subjectName}
                  stemPillar={stemPillar}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-slate-300">
              <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800">No Prescribed Textbooks Found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                No active textbook versions are currently registered in the database for{' '}
                <strong>
                  {profile.boardId} Class {profile.grade} in {profile.medium.toUpperCase()}
                </strong>{' '}
                medium.
              </p>
              <div className="mt-4">
                <button
                  onClick={() => handleSwitchProfile('asha')}
                  className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700"
                >
                  Switch to verified CBSE Class 8 demo
                </button>
              </div>
            </div>
          )}
        </section>

        {/* =========================================================================
            5. PROFILE DETAILS SUMMARY FOOTER
           ========================================================================= */}
        <section className="bg-white rounded-2xl p-5 border border-slate-200 text-xs text-slate-600">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="font-bold text-slate-800">Demonstration Identity Details</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Logged in as <code className="font-mono text-slate-700">{profile.email}</code> •{' '}
                {profile.schoolName || 'Govt. Model School'}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-brand-50 text-brand-800 font-semibold text-[11px] border border-brand-200">
                Stage 3 Dashboard Expansion
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-slate-500 hover:text-red-700 font-medium transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Exit Demo</span>
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
