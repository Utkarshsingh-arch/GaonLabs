import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Sparkles,
  ChevronRight,
  ArrowRight,
  AlertCircle,
  Compass,
  FlaskConical
} from 'lucide-react';
import {
  getDemoSession,
  setDemoSession,
  DEMO_PROFILES
} from '../services/demoAuth';
import { fetchCatalogue, fetchEditionChapters } from '../services/api';
import { SkillUpSidebar } from '../components/SkillUpSidebar';
import { SkillUpHeader } from '../components/SkillUpHeader';
import { SkillUpRightSidebar } from '../components/SkillUpRightSidebar';
import {
  RocketIllustration,
  MapIllustration,
  BackpackIllustration,
  TutorIllustration,
  CodeBracketsIllustration,
  DocumentIllustration
} from '../components/SkillUpIllustrations';
import { ChapterDrawerModal } from '../components/ChapterDrawerModal';
import { CurriculumExplorerModal } from '../components/CurriculumExplorerModal';
import { CatalogueEntry, DemoProfile, TextbookEditionItem } from '../types';

export const DashboardPage: React.FC = () => {
  // Load session or default to Asha Rao
  const [profile, setProfile] = useState<DemoProfile>(() => {
    const existing = getDemoSession();
    if (existing) return existing;
    setDemoSession(DEMO_PROFILES.asha);
    return DEMO_PROFILES.asha;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [catalogue, setCatalogue] = useState<CatalogueEntry[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);

  // Modals state
  const [selectedEdition, setSelectedEdition] = useState<TextbookEditionItem | null>(null);
  const [selectedSubjectName, setSelectedSubjectName] = useState<string>('');
  const [isExplorerOpen, setIsExplorerOpen] = useState<boolean>(false);

  // Load real curriculum from API
  const loadCurriculum = async (currentProfile: DemoProfile) => {
    setApiError(null);

    try {
      const catalogueRes = await fetchCatalogue({
        boardId: currentProfile.boardId,
        grade: currentProfile.grade,
        medium: currentProfile.medium,
      });

      setCatalogue(catalogueRes.data || []);

      if (catalogueRes.error) {
        setApiError(catalogueRes.error);
      }
    } catch (err: any) {
      console.error('Failed to load student curriculum:', err);
      setApiError(err.message || 'Error communicating with curriculum backend');
    }
  };

  useEffect(() => {
    loadCurriculum(profile);
  }, [profile.boardId, profile.grade, profile.medium]);

  const handleProfileChange = (newProfile: DemoProfile) => {
    setProfile(newProfile);
    setDemoSession(newProfile);
  };

  // Flatten prescribed textbook editions from real catalogue
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

  const mathTextbook = textbookCards.find((t) => t.stemPillar === 'MATHEMATICS') || textbookCards[0];
  const scienceTextbook = textbookCards.find((t) => t.stemPillar === 'SCIENCE') || textbookCards[1];

  // Open Chapter Drawer
  const handleOpenChapterDrawer = async (edition: TextbookEditionItem, subjectName: string) => {
    setSelectedSubjectName(subjectName);
    if (!edition.chapters || edition.chapters.length === 0) {
      try {
        const res = await fetchEditionChapters(edition.id);
        if (res.data) {
          edition.chapters = res.data;
        }
      } catch (err) {
        console.error('Failed to load chapters for drawer:', err);
      }
    }
    setSelectedEdition(edition);
  };

  const studentFirstName = profile.name.split(' ')[0] || 'Student';

  return (
    <div className="min-h-screen bg-[#FBFAF9] flex flex-col md:flex-row antialiased text-[#352F2A]">
      {/* =======================================================================
          1. LEFT NAVIGATION SIDEBAR (Matching Screenshot)
         ======================================================================= */}
      <SkillUpSidebar
        currentProfile={profile}
        onProfileChange={handleProfileChange}
        onOpenExplorer={() => setIsExplorerOpen(true)}
      />

      {/* =======================================================================
          2. MAIN CONTENT & RIGHT COLUMN
         ======================================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header with Pill Search Bar & Profile Avatar */}
        <SkillUpHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          profile={profile}
          onOpenNotifications={() =>
            alert(`Notifications: Official curriculum active in ${profile.boardName} (Class ${profile.grade}).`)
          }
        />

        {apiError && (
          <div className="bg-[#FFEEDD] border-b border-[#FFD9B8] px-6 py-2 text-xs text-[#D47220] flex items-center justify-between">
            <span className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Offline Fallback Active: Serving local verified curriculum snapshot.</span>
            </span>
            <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-[#FFD9B8]">
              Local Postgres Synced
            </span>
          </div>
        )}

        {/* Dashboard Body Grid: Center Content (2/3) + Right Widgets (1/3) */}
        <main className="flex-1 p-6 md:p-8 flex flex-col xl:flex-row gap-8 max-w-[1600px] w-full mx-auto">
          {/* Main Central Column */}
          <div className="flex-1 space-y-8 min-w-0">
            {/* =================================================================
                HERO BANNER (SkillUp Warm Orange Card & Rocket)
               ================================================================= */}
            <section className="relative overflow-hidden rounded-3xl bg-[#FA9C4D] p-7 md:p-9 text-white shadow-soft-md">
              <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none -z-0" />

              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="max-w-md">
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                    Hi, {studentFirstName}!
                  </h1>
                  <p className="mt-2 text-sm sm:text-base font-medium text-white/95 leading-relaxed">
                    Welcome back! Let's have some fun today. New STEM discoveries await
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-xs text-white border border-white/20">
                      <Sparkles className="w-3.5 h-3.5 text-[#FFCF4F]" />
                      Class {profile.grade} • {profile.boardId === 'CBSE' ? 'CBSE National' : 'Karnataka KTBS'} ({profile.medium === 'kn' ? 'ಕನ್ನಡ' : 'English'})
                    </span>
                    <Link
                      to="/app/experiments"
                      className="px-3.5 py-1 rounded-full text-xs font-bold bg-white text-[#FA9C4D] hover:bg-[#FFEEDD] transition-colors shadow-soft-sm inline-flex items-center gap-1.5"
                    >
                      <FlaskConical className="w-3.5 h-3.5" />
                      <span>Virtual Lab</span>
                    </Link>
                    <Link
                      to="/app/explore"
                      className="px-3.5 py-1 rounded-full text-xs font-bold bg-white/15 hover:bg-white/25 text-white transition-colors border border-white/20 inline-flex items-center gap-1.5"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>Explore STEM</span>
                    </Link>
                  </div>
                </div>

                {/* Rocket Illustration */}
                <div className="shrink-0 self-center sm:self-auto">
                  <RocketIllustration className="w-32 h-32 md:w-36 md:h-36 drop-shadow-md" />
                </div>
              </div>
            </section>

            {/* =================================================================
                MY COURSES (SkillUp Course Cards)
               ================================================================= */}
            <section id="courses" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-[#352F2A] tracking-tight">
                  My Courses
                </h2>
                <button
                  onClick={() => setIsExplorerOpen(true)}
                  className="text-xs font-bold text-[#FA9C4D] hover:text-[#D47220] transition-colors flex items-center gap-1"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 3 Course Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* -------------------------------------------------------------
                    Course Card 1: Coding Quest Style (Mathematics)
                   ------------------------------------------------------------- */}
                <div
                  onClick={() =>
                    mathTextbook &&
                    handleOpenChapterDrawer(
                      mathTextbook.edition,
                      mathTextbook.subjectName
                    )
                  }
                  className="bg-[#FFFFFF] rounded-3xl border border-[#EFECE6] overflow-hidden p-4 flex flex-col justify-between hover:shadow-soft-md transition-all cursor-pointer group"
                >
                  <div>
                    <div className="w-full h-32 bg-[#F8F4EE] rounded-2xl flex items-center justify-center p-2 mb-3.5 group-hover:bg-[#FAF5EF] transition-colors">
                      <MapIllustration className="w-full h-28" />
                    </div>

                    <h3 className="font-extrabold text-base text-[#352F2A] group-hover:text-[#FA9C4D] transition-colors leading-tight">
                      Mathematics Lab
                    </h3>
                    <p className="text-xs text-[#9E9B97] font-semibold mt-1">
                      {mathTextbook ? mathTextbook.edition.titleInLanguage : `Class ${profile.grade}: Mathematics`}
                    </p>
                  </div>

                  <div className="mt-5 space-y-2">
                    <div className="w-full h-2 bg-[#F8F4EE] rounded-full overflow-hidden">
                      <div className="w-4/5 h-full bg-[#48AF76] rounded-full" />
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-bold text-[#9E9B97]">
                      <span>{mathTextbook?.edition.chapters?.length || 13} Chapters</span>
                      <span>Verified Curriculum</span>
                    </div>
                  </div>
                </div>

                {/* -------------------------------------------------------------
                    Course Card 2: Code Adventure Style (Integrated Science)
                   ------------------------------------------------------------- */}
                <div
                  onClick={() =>
                    scienceTextbook &&
                    handleOpenChapterDrawer(
                      scienceTextbook.edition,
                      scienceTextbook.subjectName
                    )
                  }
                  className="bg-[#FFFFFF] rounded-3xl border border-[#EFECE6] overflow-hidden p-4 flex flex-col justify-between hover:shadow-soft-md transition-all cursor-pointer group"
                >
                  <div>
                    <div className="w-full h-32 bg-[#F8F4EE] rounded-2xl flex items-center justify-center p-2 mb-3.5 group-hover:bg-[#FAF5EF] transition-colors">
                      <BackpackIllustration className="w-full h-28" />
                    </div>

                    <h3 className="font-extrabold text-base text-[#352F2A] group-hover:text-[#FA9C4D] transition-colors leading-tight">
                      Science & Curiosity
                    </h3>
                    <p className="text-xs text-[#9E9B97] font-semibold mt-1">
                      {scienceTextbook ? scienceTextbook.edition.titleInLanguage : `Class ${profile.grade}: Science`}
                    </p>
                  </div>

                  <div className="mt-5 space-y-2">
                    <div className="w-full h-2 bg-[#F8F4EE] rounded-full overflow-hidden">
                      <div className="w-3/5 h-full bg-[#FA9C4D] rounded-full" />
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-bold text-[#9E9B97]">
                      <span>{scienceTextbook?.edition.chapters?.length || 13} Chapters</span>
                      <span>Smart Reader Ready</span>
                    </div>
                  </div>
                </div>

                {/* -------------------------------------------------------------
                    Course Card 3: "Add New Course" (Dashed Border Card)
                   ------------------------------------------------------------- */}
                <div
                  onClick={() => setIsExplorerOpen(true)}
                  className="bg-[#FBFAF9] rounded-3xl border-2 border-dashed border-[#EFECE6] hover:border-[#FFD9B8] p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#FAF5EF] transition-all group min-h-[260px]"
                >
                  <div className="w-14 h-14 rounded-full bg-[#FFEEDD] border border-[#FFD9B8] flex items-center justify-center text-[#FA9C4D] group-hover:scale-110 transition-transform shadow-soft-sm mb-3">
                    <Plus className="w-7 h-7 stroke-[2.5]" />
                  </div>
                  <h3 className="font-extrabold text-sm text-[#FA9C4D] group-hover:text-[#D47220] transition-colors">
                    Add New Course
                  </h3>
                  <p className="text-[11px] text-[#9E9B97] mt-1 max-w-[180px]">
                    Explore CBSE and Karnataka State Board textbooks
                  </p>
                </div>
              </div>
            </section>

            {/* =================================================================
                EXPERIENTIAL STEM LABS & EXPLORATION
               ================================================================= */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-[#352F2A] tracking-tight flex items-center gap-2">
                    <span>Virtual STEM Laboratories</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFEEDD] text-[#D47220] border border-[#FFD9B8]">
                      Interactive
                    </span>
                  </h2>
                  <p className="text-xs text-[#9E9B97] mt-0.5">
                    Manipulate authentic physical and chemical systems with offline-first persistence
                  </p>
                </div>
                <Link
                  to="/app/experiments"
                  className="text-xs font-bold text-[#FA9C4D] hover:text-[#D47220] transition-colors flex items-center gap-1"
                >
                  <span>All Experiments</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* 1. Experiment Studio Card */}
                <Link
                  to="/app/experiments"
                  className="bg-[#FFFFFF] rounded-3xl border border-[#EFECE6] p-5 hover:shadow-soft-md transition-all flex flex-col justify-between group hover:border-[#FFD9B8]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#FFEEDD] border border-[#FFD9B8] flex items-center justify-center text-[#FA9C4D] group-hover:scale-105 transition-transform">
                        <FlaskConical className="w-6 h-6 stroke-[2.2]" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#CEECDA] text-[#246A42]">
                        Verified Simulation
                      </span>
                    </div>

                    <h3 className="font-extrabold text-base text-[#352F2A] group-hover:text-[#FA9C4D] transition-colors">
                      GaonLab Experiment Studio
                    </h3>
                    <p className="text-xs text-[#636160] mt-1.5 leading-relaxed">
                      Hands-on STEM investigations in Chemistry (Acids, Bases & Indicators) and Physics (Kinematics & Friction) with 7-phase inquiry and offline sync.
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#EFECE6] flex items-center justify-between text-xs font-bold text-[#FA9C4D]">
                    <div className="flex items-center gap-2 text-[11px] text-[#9E9B97] font-semibold">
                      <span>Offline Capable</span>
                      <span>•</span>
                      <span>Safe Household Materials</span>
                    </div>
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Open Lab</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>

                {/* 2. Explore STEM Card */}
                <Link
                  to="/app/explore"
                  className="bg-[#FFFFFF] rounded-3xl border border-[#EFECE6] p-5 hover:shadow-soft-md transition-all flex flex-col justify-between group hover:border-[#FFD9B8]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#FFEEDD] border border-[#FFD9B8] flex items-center justify-center text-[#FA9C4D] group-hover:scale-105 transition-transform">
                        <Compass className="w-6 h-6 stroke-[2.2]" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FAF5EF] text-[#D47220] border border-[#FFD9B8]">
                        Bilingual Video & Lessons
                      </span>
                    </div>

                    <h3 className="font-extrabold text-base text-[#352F2A] group-hover:text-[#FA9C4D] transition-colors">
                      Explore STEM Hub
                    </h3>
                    <p className="text-xs text-[#636160] mt-1.5 leading-relaxed">
                      Discover core curriculum topics across Physics, Chemistry, Biology and Math with original GaonLab lessons, narrated animated videos, and KTBS Kannada support.
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#EFECE6] flex items-center justify-between text-xs font-bold text-[#FA9C4D]">
                    <div className="flex items-center gap-2 text-[11px] text-[#9E9B97] font-semibold">
                      <span>Kannada & English</span>
                      <span>•</span>
                      <span>Textbook Synced</span>
                    </div>
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Explore Topics</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              </div>
            </section>

            {/* =================================================================
                RELEVANT RESOURCES & EXTENSIONS
               ================================================================= */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-[#352F2A] tracking-tight">
                  Relevant Resources
                </h2>
                <span className="text-xs text-[#9E9B97] font-semibold">
                  Connected Learning Tools
                </span>
              </div>

              {/* 3 Resource Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Resource Card 1: Tutor / STEM Lens */}
                <Link
                  to="/app/stem-lens"
                  className="bg-[#FFFFFF] rounded-3xl border border-[#EFECE6] p-4 hover:shadow-soft-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-full h-24 bg-[#F8F4EE] rounded-2xl flex items-center justify-center p-2 mb-3 group-hover:bg-[#FAF5EF] transition-colors">
                      <TutorIllustration className="w-full h-20" />
                    </div>
                    <h3 className="font-extrabold text-sm text-[#352F2A] group-hover:text-[#FA9C4D] transition-colors">
                      STEM Lens
                    </h3>
                    <p className="text-[11px] text-[#9E9B97] mt-1 line-clamp-2">
                      Real-world camera recognition connecting rural agricultural phenomena to curriculum concepts
                    </p>
                  </div>
                  <div className="mt-4 pt-2.5 border-t border-[#EFECE6] flex items-center justify-between text-[11px] font-bold text-[#FA9C4D]">
                    <span>Open Camera Lab</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

                {/* Resource Card 2: Code Brackets / Village Builder */}
                <Link
                  to="/app/village-builder"
                  className="bg-[#FFFFFF] rounded-3xl border border-[#EFECE6] p-4 hover:shadow-soft-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-full h-24 bg-[#F8F4EE] rounded-2xl flex items-center justify-center p-2 mb-3 group-hover:bg-[#FAF5EF] transition-colors">
                      <CodeBracketsIllustration className="w-full h-20" />
                    </div>
                    <h3 className="font-extrabold text-sm text-[#352F2A] group-hover:text-[#FA9C4D] transition-colors">
                      Village Builder
                    </h3>
                    <p className="text-[11px] text-[#9E9B97] mt-1 line-clamp-2">
                      Rural engineering & systems dynamics simulator for community problem-solving
                    </p>
                  </div>
                  <div className="mt-4 pt-2.5 border-t border-[#EFECE6] flex items-center justify-between text-[11px] font-bold text-[#FA9C4D]">
                    <span>Explore Simulation</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

                {/* Resource Card 3: Document / Official Syllabus */}
                <div
                  onClick={() => setIsExplorerOpen(true)}
                  className="bg-[#FFFFFF] rounded-3xl border border-[#EFECE6] p-4 hover:shadow-soft-md transition-all flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    <div className="w-full h-24 bg-[#F8F4EE] rounded-2xl flex items-center justify-center p-2 mb-3 group-hover:bg-[#FAF5EF] transition-colors">
                      <DocumentIllustration className="w-full h-20" />
                    </div>
                    <h3 className="font-extrabold text-sm text-[#352F2A] group-hover:text-[#FA9C4D] transition-colors">
                      Prescribed Textbooks
                    </h3>
                    <p className="text-[11px] text-[#9E9B97] mt-1 line-clamp-2">
                      Official verified NCERT (CBSE) and KTBS (Karnataka) syllabus editions with Smart Reader
                    </p>
                  </div>
                  <div className="mt-4 pt-2.5 border-t border-[#EFECE6] flex items-center justify-between text-[11px] font-bold text-[#FA9C4D]">
                    <span>Browse All Textbooks</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* ===================================================================
              RIGHT COLUMN: Weekly Progress, Recent Tasks, Activity
             =================================================================== */}
          <SkillUpRightSidebar />
        </main>
      </div>

      {/* =======================================================================
          MODALS & DRAWERS
         ======================================================================= */}
      {selectedEdition && (
        <ChapterDrawerModal
          edition={selectedEdition}
          subjectName={selectedSubjectName}
          onClose={() => setSelectedEdition(null)}
        />
      )}

      <CurriculumExplorerModal
        isOpen={isExplorerOpen}
        onClose={() => setIsExplorerOpen(false)}
        profile={profile}
      />
    </div>
  );
};
