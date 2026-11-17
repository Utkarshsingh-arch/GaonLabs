import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { createGameConfig } from './game/config';
import { BootScene } from './game/scenes/BootScene';
import { VillageScene } from './game/scenes/VillageScene';
import { VirtualJoystick } from './ui/hud/VirtualJoystick';
import { ZonePrompt } from './ui/hud/ZonePrompt';
import { HoverCard } from './ui/hud/HoverCard';
import { FactBubble } from './ui/hud/FactBubble';
import { LabPanel } from './ui/lab/LabPanel';
import { LearningHouseModal } from './ui/lab/LearningHouseModal';
import { StartScreen } from './ui/screens/StartScreen';
import { ProgressScreen } from './ui/screens/ProgressScreen';
import { MitraHelper } from './ui/mitra/MitraHelper';
import { VILLAGE_BUILDINGS, BuildingPlacement } from './game/data/villageEntities';
import { ZoneId, Lang, Question, Evaluation } from './learning/types';
import { eventBus } from './game/eventBus';
import { progressStore } from './storage/progressStore';
import { UserProfileRecord } from './storage/db';

export default function App(): React.JSX.Element {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  // User Profile & Progress State
  const [profile, setProfile] = useState<UserProfileRecord | null>(null);
  const [showStartScreen, setShowStartScreen] = useState<boolean>(false);
  const [showProgressScreen, setShowProgressScreen] = useState<boolean>(false);
  const [showMitraHelper, setShowMitraHelper] = useState<boolean>(false);
  const [activeLabZoneId, setActiveLabZoneId] = useState<ZoneId | null>(null);
  const [activeLearningHouse, setActiveLearningHouse] = useState<BuildingPlacement | null>(null);
  const [completedLabs, setCompletedLabs] = useState<Set<string>>(new Set());
  const [totalXp, setTotalXp] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    try {
      return localStorage.getItem('gaonlab_sound_muted') === 'true';
    } catch {
      return false;
    }
  });

  const toggleSound = () => {
    setIsMuted((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('gaonlab_sound_muted', String(next));
      } catch {}
      eventBus.emit('sound:mute', next);
      return next;
    });
  };

  // Keyboard accessibility: ESC closes active dialogs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeLabZoneId) handleCloseLab();
        else if (activeLearningHouse) handleCloseLearningHouse();
        else if (showMitraHelper) setShowMitraHelper(false);
        else if (showProgressScreen) setShowProgressScreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLabZoneId, activeLearningHouse, showMitraHelper, showProgressScreen]);

  // Initialize and Hydrate from Dexie IndexedDB
  useEffect(() => {
    async function hydrate() {
      const existingProfile = await progressStore.getProfile();
      if (existingProfile) {
        setProfile(existingProfile);
        setTotalXp(existingProfile.xp);
      } else {
        setShowStartScreen(true);
      }

      const labs = await progressStore.getCompletedLabs();
      const labSet = new Set(labs.map((l) => l.zoneId));
      setCompletedLabs(labSet);

      // Inform Phaser scene of already completed labs once scene is ready
      eventBus.on('scene:ready', () => {
        labSet.forEach((zoneId) => {
          eventBus.emit('lab:completed', zoneId);
        });
      });
    }

    hydrate();
  }, []);

  // Initialize Phaser Game instance
  useEffect(() => {
    if (!gameContainerRef.current) return;

    if (!gameRef.current) {
      const config = createGameConfig(gameContainerRef.current, [BootScene, VillageScene]);
      gameRef.current = new Phaser.Game(config);
    }

    // Zone & Lab Event Listeners
    const handleZoneEnter = (data: { id: string }) => {
      setActiveLearningHouse(null);
      setActiveLabZoneId(data.id as ZoneId);
      eventBus.emit('lab:open', data.id);
    };

    const handleHouseEnter = (data: { id: string }) => {
      const found = VILLAGE_BUILDINGS.find((b) => b.id === data.id && b.category === 'learning_house');
      if (found) {
        setActiveLabZoneId(null);
        setActiveLearningHouse(found);
        eventBus.emit('lab:open', found.id);
      }
    };

    const handleLabCompleted = async (zoneId: string) => {
      await progressStore.completeLab(zoneId as ZoneId, 1.0, 6);
      setCompletedLabs((prev) => new Set(prev).add(zoneId));
      setTotalXp((xp) => xp + 100);
      setProfile((prev) => prev ? { ...prev, xp: prev.xp + 100 } : null);
    };

    eventBus.on('zone:enter', handleZoneEnter);
    eventBus.on('house:enter', handleHouseEnter);
    eventBus.on('lab:completed', handleLabCompleted);

    return () => {
      eventBus.off('zone:enter', handleZoneEnter);
      eventBus.off('house:enter', handleHouseEnter);
      eventBus.off('lab:completed', handleLabCompleted);

      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  const handleLanguageChange = async (newLang: Lang) => {
    if (profile) {
      const updated = await progressStore.saveProfile({ lang: newLang });
      setProfile(updated);
    }
  };

  const handleStartProfile = (newProfile: UserProfileRecord) => {
    setProfile(newProfile);
    setTotalXp(newProfile.xp);
    setShowStartScreen(false);
  };

  const handleCloseLab = () => {
    setActiveLabZoneId(null);
    eventBus.emit('lab:close');
  };

  const handleCloseLearningHouse = () => {
    setActiveLearningHouse(null);
    eventBus.emit('lab:close');
  };

  const handleOpenRelatedLab = (zoneId: ZoneId) => {
    setActiveLearningHouse(null);
    setActiveLabZoneId(zoneId);
  };

  const handleQuestionAnswered = (question: Question, evalResult: Evaluation) => {
    progressStore.recordConceptAttempt(question.concept, question.zone, evalResult.correct);
  };

  const currentLang: Lang = profile?.lang || 'en';

  return (
    <div className="relative w-screen h-screen bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
      {/* Phaser Canvas Container */}
      <div ref={gameContainerRef} className="w-full h-full absolute inset-0 z-0" />

      {/* Top HUD Overview & Action Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        {/* Left: Branding, Nickname & Grade */}
        <div className="flex items-center gap-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-4 py-2.5 rounded-2xl shadow-xl pointer-events-auto">
          <button
            type="button"
            onClick={() => setShowStartScreen(true)}
            className="text-2xl p-1 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
            title="Profile Settings"
          >
            {profile?.avatarId === 'avatar_2' ? '👩‍🔬' : profile?.avatarId === 'avatar_3' ? '🧑‍🔧' : '🧑‍🌾'}
          </button>
          <div>
            <h1 className="font-bold text-amber-400 text-sm leading-tight flex items-center gap-2">
              <span>{profile?.nickname || 'Learner'}</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                Grade {profile?.grade || 7}
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 flex items-center gap-2">
              <span>WASD / Touch to Walk</span>
              <span>•</span>
              <span className="text-emerald-400 font-semibold">
                ★ {completedLabs.size}/6 Labs
              </span>
            </p>
          </div>
        </div>

        {/* Right: XP Bar, Progress Badges Button & Language Switcher */}
        <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-1.5 rounded-2xl shadow-xl pointer-events-auto">
          {/* Mitra Guide Button */}
          <button
            type="button"
            onClick={() => setShowMitraHelper(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-emerald-500/20 to-emerald-600/30 hover:from-emerald-500/30 hover:to-emerald-600/40 text-emerald-300 font-bold text-xs border border-emerald-500/40 transition-transform active:scale-95 cursor-pointer"
          >
            <span>🤖 Mitra</span>
          </button>

          {/* XP & Progress Screen Launcher */}
          <button
            type="button"
            onClick={() => setShowProgressScreen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/30 hover:from-amber-500/30 hover:to-amber-600/40 text-amber-300 font-bold text-xs border border-amber-500/40 transition-transform active:scale-95 cursor-pointer"
          >
            <span>⚡ {totalXp} XP</span>
            <span className="text-slate-400 text-[10px]">|</span>
            <span>🏅 Badges</span>
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-xs transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
          >
            {isMuted ? '🔇' : '🔊'}
          </button>

          {/* Language Switcher */}
          <div className="flex bg-slate-800 rounded-xl p-0.5 border border-slate-700 text-xs">
            {(['en', 'hi', 'kn'] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => handleLanguageChange(code)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  currentLang === code
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {code === 'hi' ? 'हिन्दी' : code === 'kn' ? 'ಕನ್ನಡ' : 'EN'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Zone Interaction Prompt */}
      <ZonePrompt lang={currentLang} />

      {/* Unified Hover Educational Card & Random Discovery Fact Bubble */}
      <HoverCard />
      <FactBubble />

      {/* Mobile Virtual Joystick */}
      <VirtualJoystick />

      {/* Interactive Lab Overlay Panel */}
      {activeLabZoneId && (
        <LabPanel
          zoneId={activeLabZoneId}
          lang={currentLang}
          onClose={handleCloseLab}
          onQuestionAnswered={handleQuestionAnswered}
        />
      )}

      {/* New Interactive Learning House Preview Modal */}
      {activeLearningHouse && (
        <LearningHouseModal
          building={activeLearningHouse}
          onClose={handleCloseLearningHouse}
          onOpenRelatedLab={handleOpenRelatedLab}
        />
      )}

      {/* Start Screen Overlay */}
      {showStartScreen && (
        <StartScreen
          initialProfile={profile}
          onStart={handleStartProfile}
        />
      )}

      {/* Progress & Badges Screen Overlay */}
      {showProgressScreen && profile && (
        <ProgressScreen
          profile={profile}
          lang={currentLang}
          onClose={() => setShowProgressScreen(false)}
        />
      )}

      {/* Mitra Village STEM Guide Overlay */}
      {showMitraHelper && (
        <MitraHelper
          lang={currentLang}
          grade={profile?.grade || 7}
          isOpen={showMitraHelper}
          onClose={() => setShowMitraHelper(false)}
        />
      )}
    </div>
  );
}
