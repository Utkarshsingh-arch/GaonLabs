import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { createGameConfig } from './game/config';
import { BootScene } from './game/scenes/BootScene';
import { VillageScene } from './game/scenes/VillageScene';
import { VirtualJoystick } from './ui/hud/VirtualJoystick';
import { ZonePrompt } from './ui/hud/ZonePrompt';
import { HoverCard } from './ui/hud/HoverCard';
import { FactBubble } from './ui/hud/FactBubble';
import { NpcDialogueModal } from './ui/hud/NpcDialogueModal';
import { VillageEventBanner } from './ui/hud/VillageEventBanner';
import { LabPanel } from './ui/lab/LabPanel';
import { LearningHouseModal } from './ui/lab/LearningHouseModal';
import { HospitalModal } from './ui/civic/HospitalModal';
import { RailwayStationModal } from './ui/civic/RailwayStationModal';
import { VillageMarketModal } from './ui/civic/VillageMarketModal';
import { CooperativeBankModal } from './ui/civic/CooperativeBankModal';
import { NcertConceptModal, NcertModalTarget } from './ui/curriculum/NcertConceptModal';
import { StartScreen } from './ui/screens/StartScreen';
import { AvatarPreviewCanvas } from './ui/screens/AvatarPreviewCanvas';
import { ProgressScreen } from './ui/screens/ProgressScreen';
import { MitraHelper } from './ui/mitra/MitraHelper';
import { VILLAGE_BUILDINGS, BuildingPlacement } from './game/data/villageEntities';
import { CivicCenterId, VillageEventDef, VillageNpcDef } from './game/data/civicExpansionData';
import { decodeAvatarId } from './game/graphics/avatarAppearance';
import { normalizeSupportedGrade } from './learning/curriculum/curriculumMapper';
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
  const [activeCivicCenter, setActiveCivicCenter] = useState<CivicCenterId | null>(null);
  const [activeNpc, setActiveNpc] = useState<{ npc: VillageNpcDef; dialogueIndex: number } | null>(null);
  const [activeNcertTarget, setActiveNcertTarget] = useState<NcertModalTarget | null>(null);
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
        if (activeNcertTarget) handleCloseNcertModal();
        else if (activeNpc) handleCloseNpc();
        else if (activeCivicCenter) handleCloseCivicCenter();
        else if (activeLabZoneId) handleCloseLab();
        else if (activeLearningHouse) handleCloseLearningHouse();
        else if (showMitraHelper) setShowMitraHelper(false);
        else if (showProgressScreen) setShowProgressScreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeNcertTarget, activeNpc, activeCivicCenter, activeLabZoneId, activeLearningHouse, showMitraHelper, showProgressScreen]);

  // Optional handoff parameters from GaonLab main dashboard (?name=Asha&grade=8&embed=1)
  const [urlDefaults] = useState<{ name?: string; grade?: number }>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const rawName = params.get('name')?.trim();
      const rawGrade = Number(params.get('grade'));
      return {
        name: rawName ? rawName.slice(0, 20) : undefined,
        grade: Number.isFinite(rawGrade) && rawGrade >= 6 && rawGrade <= 12 ? rawGrade : undefined,
      };
    } catch {
      return {};
    }
  });

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

      // Inform Phaser scene of already completed labs & saved avatar once scene is ready
      eventBus.on('scene:ready', () => {
        if (existingProfile?.avatarId) {
          eventBus.emit('avatar:update', existingProfile.avatarId);
        }
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
        setActiveCivicCenter(null);
        setActiveLearningHouse(found);
        eventBus.emit('lab:open', found.id);
      }
    };

    const handleCivicEnter = (data: { id: string }) => {
      setActiveLabZoneId(null);
      setActiveLearningHouse(null);
      setActiveNpc(null);
      setActiveCivicCenter(data.id as CivicCenterId);
      eventBus.emit('lab:open', data.id);
    };

    const handleNpcInteract = (payload: { npc: VillageNpcDef; dialogueIndex: number }) => {
      setActiveNpc(payload);
      eventBus.emit('lab:open', payload.npc.id);
    };

    const handleLabCompleted = async (zoneId: string) => {
      await progressStore.completeLab(zoneId as ZoneId, 1.0, 6);
      setCompletedLabs((prev) => new Set(prev).add(zoneId));
      setTotalXp((xp) => xp + 100);
      setProfile((prev) => prev ? { ...prev, xp: prev.xp + 100 } : null);
    };

    eventBus.on('zone:enter', handleZoneEnter);
    eventBus.on('house:enter', handleHouseEnter);
    eventBus.on('civic:enter', handleCivicEnter);
    eventBus.on('npc:interact', handleNpcInteract);
    eventBus.on('lab:completed', handleLabCompleted);

    return () => {
      eventBus.off('zone:enter', handleZoneEnter);
      eventBus.off('house:enter', handleHouseEnter);
      eventBus.off('civic:enter', handleCivicEnter);
      eventBus.off('npc:interact', handleNpcInteract);
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
    eventBus.emit('avatar:update', newProfile.avatarId);
  };

  const handleCloseLab = () => {
    setActiveLabZoneId(null);
    eventBus.emit('lab:close');
  };

  const handleCloseLearningHouse = () => {
    setActiveLearningHouse(null);
    eventBus.emit('lab:close');
  };

  const handleCloseCivicCenter = () => {
    setActiveCivicCenter(null);
    eventBus.emit('lab:close');
  };

  const handleCloseNpc = () => {
    setActiveNpc(null);
    eventBus.emit('lab:close');
  };

  const handleAwardXp = async (amount: number, _reason: string) => {
    const updatedXp = await progressStore.addXp(amount);
    setTotalXp(updatedXp);
    setProfile((prev) => (prev ? { ...prev, xp: updatedXp } : null));
  };

  const handleAcceptNpcChallenge = () => {
    if (!activeNpc) return;
    const npc = activeNpc.npc;
    setActiveNpc(null);
    if (npc.targetKind === 'civic') {
      setActiveCivicCenter(npc.targetId as CivicCenterId);
    } else if (npc.targetKind === 'core_lab') {
      setActiveLabZoneId(npc.targetId as ZoneId);
    }
  };

  const handleJoinVillageEvent = (ev: VillageEventDef) => {
    eventBus.emit('lab:open', ev.id);
    if (ev.targetKind === 'civic') {
      setActiveCivicCenter(ev.targetId as CivicCenterId);
    } else {
      setActiveLabZoneId(ev.targetId as ZoneId);
    }
  };

  const handleOpenRelatedLab = (zoneId: ZoneId) => {
    setActiveLearningHouse(null);
    setActiveLabZoneId(zoneId);
  };

  const handleOpenNcertModal = (target: NcertModalTarget) => {
    setActiveNcertTarget(target);
    if (!activeLabZoneId && !activeLearningHouse && !activeCivicCenter) {
      eventBus.emit('lab:open', target.entityKey);
    }
  };

  const handleCloseNcertModal = () => {
    setActiveNcertTarget(null);
    if (!activeLabZoneId && !activeLearningHouse && !activeCivicCenter) {
      eventBus.emit('lab:close');
    }
  };

  const handleQuestionAnswered = (question: Question, evalResult: Evaluation) => {
    progressStore.recordConceptAttempt(question.concept, question.zone, evalResult.correct);
  };

  const currentLang: Lang = profile?.lang || 'en';
  const currentGrade = normalizeSupportedGrade(profile?.grade);

  return (
    <div className="gaonlab-theme relative w-screen h-screen bg-[#FBFAF9] text-[#352F2A] flex flex-col items-center justify-center overflow-hidden">
      {/* Phaser Canvas Container */}
      <div ref={gameContainerRef} className="w-full h-full absolute inset-0 z-0" />

      {/* Top HUD Overview & Action Bar — Official GaonLab Ivory & Saffron Palette */}
      <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left: Branding, Nickname & Grade */}
        <div className="flex items-center gap-3 bg-[#FFFFFF]/95 backdrop-blur-md border border-[#EFECE6] px-3.5 py-2 rounded-2xl shadow-soft-md pointer-events-auto">
          <button
            type="button"
            onClick={() => setShowStartScreen(true)}
            className="p-0.5 rounded-xl bg-[#FAF5EF] hover:bg-[#FFEEDD] border border-[#EFECE6] hover:border-[#FFD9B8] transition-colors cursor-pointer flex items-center justify-center"
            title="Profile & Character Settings"
          >
            <AvatarPreviewCanvas
              appearance={decodeAvatarId(profile?.avatarId)}
              size={34}
              animate={false}
            />
          </button>
          <div>
            <h1 className="font-extrabold text-[#352F2A] text-sm leading-tight flex items-center gap-2">
              <span>{profile?.nickname || 'Learner'}</span>
              <span className="px-2 py-0.5 rounded-full bg-[#E8F7EE] text-[#389461] text-[10px] font-bold border border-[#CEECDA]">
                Grade {profile?.grade || 7}
              </span>
            </h1>
            <p className="text-[11px] text-[#636160] font-medium flex items-center gap-2 mt-0.5">
              <span>WASD / Touch to Walk</span>
              <span className="text-[#D9D6D0]">•</span>
              <span className="text-[#389461] font-bold">
                ★ {completedLabs.size}/6 Labs
              </span>
            </p>
          </div>
        </div>

        {/* Right: XP Bar, Progress Badges Button & Language Switcher */}
        <div className="flex items-center gap-1.5 bg-[#FFFFFF]/95 backdrop-blur-md border border-[#EFECE6] p-1.5 rounded-2xl shadow-soft-md pointer-events-auto">
          {/* Mitra Guide Button */}
          <button
            type="button"
            onClick={() => setShowMitraHelper(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E8F7EE] hover:bg-[#CEECDA] text-[#389461] font-bold text-xs border border-[#CEECDA] transition-all active:scale-95 cursor-pointer"
          >
            <span>🤖 Mitra</span>
          </button>

          {/* XP & Progress Screen Launcher */}
          <button
            type="button"
            onClick={() => setShowProgressScreen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFEEDD] hover:bg-[#FFD9B8]/70 text-[#D47220] font-bold text-xs border border-[#FFD9B8] transition-all active:scale-95 cursor-pointer"
          >
            <span>⚡ {totalXp} XP</span>
            <span className="text-[#D47220]/40 text-[10px]">|</span>
            <span>🏅 Badges</span>
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            className="w-8 h-8 rounded-xl bg-[#FAF5EF] hover:bg-[#FFEEDD] border border-[#EFECE6] hover:border-[#FFD9B8] flex items-center justify-center text-xs text-[#352F2A] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FA9C4D] focus-visible:outline-none"
          >
            {isMuted ? '🔇' : '🔊'}
          </button>

          {/* Language Switcher */}
          <div className="flex bg-[#FAF5EF] rounded-xl p-0.5 border border-[#EFECE6] text-xs">
            {(['en', 'hi', 'kn'] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => handleLanguageChange(code)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  currentLang === code
                    ? 'bg-[#FA9C4D] text-white font-bold shadow-soft-sm'
                    : 'text-[#636160] hover:text-[#352F2A]'
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

      {/* Unified Hover Educational Card, Random Discovery Fact Bubble & Village Events */}
      <HoverCard studentGrade={currentGrade} onExploreNcert={handleOpenNcertModal} />
      <FactBubble studentGrade={currentGrade} onExploreNcert={handleOpenNcertModal} />
      <VillageEventBanner lang={currentLang} onJoinEvent={handleJoinVillageEvent} />

      {/* Mobile Virtual Joystick */}
      <VirtualJoystick />

      {/* Interactive Lab Overlay Panel */}
      {activeLabZoneId && (
        <LabPanel
          zoneId={activeLabZoneId}
          lang={currentLang}
          studentGrade={currentGrade}
          onClose={handleCloseLab}
          onQuestionAnswered={handleQuestionAnswered}
          onExploreNcert={handleOpenNcertModal}
        />
      )}

      {/* New Interactive Learning House Preview Modal */}
      {activeLearningHouse && (
        <LearningHouseModal
          building={activeLearningHouse}
          studentGrade={currentGrade}
          onClose={handleCloseLearningHouse}
          onOpenRelatedLab={handleOpenRelatedLab}
          onExploreNcert={handleOpenNcertModal}
        />
      )}

      {/* 4 New Village Civic STEM Centres (Hospital, Railway, Marketplace, Cooperative Bank) */}
      {activeCivicCenter === 'village_hospital' && (
        <HospitalModal
          lang={currentLang}
          studentGrade={currentGrade}
          onClose={handleCloseCivicCenter}
          onAwardXp={handleAwardXp}
          onExploreNcert={handleOpenNcertModal}
        />
      )}
      {activeCivicCenter === 'railway_station' && (
        <RailwayStationModal
          lang={currentLang}
          studentGrade={currentGrade}
          onClose={handleCloseCivicCenter}
          onAwardXp={handleAwardXp}
          onExploreNcert={handleOpenNcertModal}
        />
      )}
      {activeCivicCenter === 'village_marketplace' && (
        <VillageMarketModal
          lang={currentLang}
          studentGrade={currentGrade}
          onClose={handleCloseCivicCenter}
          onAwardXp={handleAwardXp}
          onExploreNcert={handleOpenNcertModal}
        />
      )}
      {activeCivicCenter === 'cooperative_bank' && (
        <CooperativeBankModal
          lang={currentLang}
          studentGrade={currentGrade}
          onClose={handleCloseCivicCenter}
          onAwardXp={handleAwardXp}
          onExploreNcert={handleOpenNcertModal}
        />
      )}

      {/* Interactive Villager NPC Dialogue */}
      {activeNpc && (
        <NpcDialogueModal
          npc={activeNpc.npc}
          dialogueIndex={activeNpc.dialogueIndex}
          studentName={profile?.nickname || 'Adventurer'}
          studentGrade={currentGrade}
          lang={currentLang}
          onAccept={handleAcceptNpcChallenge}
          onDecline={handleCloseNpc}
        />
      )}

      {/* NCERT Concept Explorer & Curriculum-Aligned Practice Modal */}
      {activeNcertTarget && (
        <NcertConceptModal
          target={activeNcertTarget}
          studentGrade={currentGrade}
          lang={currentLang}
          onClose={handleCloseNcertModal}
        />
      )}

      {/* Start Screen Overlay */}
      {showStartScreen && (
        <StartScreen
          initialProfile={profile}
          defaultName={urlDefaults.name}
          defaultGrade={urlDefaults.grade ? normalizeSupportedGrade(urlDefaults.grade) : undefined}
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
