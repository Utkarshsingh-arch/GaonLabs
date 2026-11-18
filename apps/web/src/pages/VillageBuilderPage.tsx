import React, { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  ArrowLeft,
  Maximize2,
  Minimize2,
  ExternalLink,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { SkillUpSidebar } from '../components/SkillUpSidebar';
import { getDemoSession } from '../services/demoAuth';
import { DemoProfile } from '../types';

export const VillageBuilderPage: React.FC = () => {
  const [profile, setProfile] = useState<DemoProfile | null>(() => getDemoSession());
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [reloadNonce, setReloadNonce] = useState<number>(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const explorerUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.set('embed', '1');
    if (profile?.name) {
      params.set('name', profile.name.split(' ')[0]);
    }
    if (profile?.grade && profile.grade >= 6 && profile.grade <= 12) {
      params.set('grade', String(profile.grade));
    }
    if (reloadNonce > 0) {
      params.set('r', String(reloadNonce));
    }
    return `/village-explorer/index.html?${params.toString()}`;
  }, [profile?.name, profile?.grade, reloadNonce]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#FBFAF9] flex flex-col md:flex-row antialiased text-[#352F2A]">
      {!isFullscreen && (
        <SkillUpSidebar
          currentProfile={profile || undefined}
          onProfileChange={(next) => setProfile(next)}
        />
      )}

      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Compact Professional GaonLab Workspace Header */}
        <header className="shrink-0 h-14 px-4 sm:px-6 bg-[#FFFFFF] border-b border-[#EFECE6] flex items-center justify-between gap-3 shadow-soft-sm z-10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#FFEEDD] border border-[#FFD9B8] text-[#FA9C4D] flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-extrabold text-[#352F2A] tracking-tight truncate">
                  Village Builder
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFEEDD] text-[#D47220] border border-[#FFD9B8]">
                  <Sparkles className="w-3 h-3" />
                  2.5D Gamified STEM World
                </span>
              </div>
              <p className="text-[11px] text-[#636160] font-medium truncate">
                Explore Labs, Hospital, Railway Station, Market &amp; Cooperative Bank • NCERT Classes 6–12
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {profile && (
              <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E8F7EE] text-[#389461] border border-[#CEECDA] text-[11px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#48AF76]" />
                {profile.name} • Class {profile.grade}
              </span>
            )}

            <button
              type="button"
              onClick={() => setReloadNonce((n) => n + 1)}
              title="Reload Village Explorer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#FAF5EF] hover:bg-[#FFEEDD] border border-[#EFECE6] hover:border-[#FFD9B8] text-[#636160] hover:text-[#D47220] text-xs font-bold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reload</span>
            </button>

            <a
              href={explorerUrl}
              target="_blank"
              rel="noreferrer"
              title="Open in new tab"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#FAF5EF] hover:bg-[#FFEEDD] border border-[#EFECE6] hover:border-[#FFD9B8] text-[#636160] hover:text-[#D47220] text-xs font-bold transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden md:inline">New Tab</span>
            </a>

            <button
              type="button"
              onClick={() => setIsFullscreen((f) => !f)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FA9C4D] hover:bg-[#EB8833] text-white text-xs font-bold shadow-soft-sm transition-colors cursor-pointer"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>Show Sidebar</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Full View</span>
                </>
              )}
            </button>

            <Link
              to="/app/dashboard"
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#FFFFFF] hover:bg-[#FAF5EF] border border-[#EFECE6] text-[#636160] hover:text-[#352F2A] text-xs font-bold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
          </div>
        </header>

        {/* Full-Height Embedded Gamified Village Explorer Platform */}
        <section className="relative flex-1 w-full bg-[#FBFAF9] overflow-hidden">
          <iframe
            ref={iframeRef}
            key={explorerUrl}
            src={explorerUrl}
            title="GaonLab Village Explorer — Interactive 2.5D STEM World"
            className="w-full h-full border-0 block bg-[#FBFAF9]"
            allow="autoplay; fullscreen"
          />
        </section>
      </main>
    </div>
  );
};
