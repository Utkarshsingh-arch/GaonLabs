import React from 'react';
import { Search, Bell } from 'lucide-react';
import { DemoProfile } from '../types';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  profile: DemoProfile;
  onOpenNotifications?: () => void;
}

export const SkillUpHeader: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  profile,
  onOpenNotifications,
}) => {
  return (
    <header className="flex items-center justify-between gap-4 py-4 px-6 md:px-8 bg-[#FBFAF9]">
      {/* Pill Search Input */}
      <div className="relative flex-1 max-w-xl">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-[#9E9B97]" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search textbooks, chapters, STEM experiments..."
          className="w-full pl-11 pr-4 py-2.5 bg-[#FFFFFF] border border-[#EFECE6] rounded-full text-xs sm:text-sm text-[#352F2A] placeholder-[#9E9B97] focus:outline-none focus:ring-2 focus:ring-[#FA9C4D]/30 focus:border-[#FA9C4D] transition-all shadow-soft-sm"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs text-[#9E9B97] hover:text-[#352F2A]"
          >
            Clear
          </button>
        )}
      </div>

      {/* Right Controls: Notification & User Avatar */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Notification Bell with Badge */}
        <button
          type="button"
          onClick={onOpenNotifications}
          className="relative w-10 h-10 rounded-full bg-[#FFFFFF] border border-[#EFECE6] flex items-center justify-center text-[#636160] hover:text-[#352F2A] hover:border-[#D9D6D0] transition-colors shadow-soft-sm"
          title="Curriculum Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#FA9C4D] ring-2 ring-white" />
        </button>

        {/* User Profile Avatar matching screenshot */}
        <div className="flex items-center gap-2 pl-2">
          <div className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-[#FAC05E] to-[#FFCF4F] border-2 border-white shadow-soft-sm flex items-center justify-center text-white font-extrabold text-sm overflow-hidden">
            <svg viewBox="0 0 36 36" fill="none" className="w-full h-full">
              <circle cx="18" cy="18" r="18" fill="#FAC05E" />
              <path d="M6 14C8 10 14 8 22 8C28 8 32 10 32 14L30 18H6L6 14Z" fill="#FA9C4D" />
              <ellipse cx="18" cy="20" rx="9" ry="8" fill="#FFEEDD" />
              <circle cx="15" cy="19" r="1.5" fill="#352F2A" />
              <circle cx="21" cy="19" r="1.5" fill="#352F2A" />
              <path d="M15 23C16.5 25 19.5 25 21 23" stroke="#352F2A" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-bold text-[#352F2A] leading-tight flex items-center gap-1">
              <span>{profile.name}</span>
            </div>
            <div className="text-[10px] text-[#9E9B97]">
              Class {profile.grade} • {profile.boardId}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
