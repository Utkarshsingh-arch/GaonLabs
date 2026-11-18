import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Compass,
  Calendar,
  Award,
  BarChart3,
  Settings,
  LogOut,
  Camera,
  Building2,
  FlaskConical,
  BookOpen
} from 'lucide-react';
import { getDemoSession, clearDemoSession, setDemoSession, DEMO_PROFILES } from '../services/demoAuth';
import { DemoProfile } from '../types';

interface SidebarProps {
  currentProfile?: DemoProfile;
  onProfileChange?: (profile: DemoProfile) => void;
  onOpenExplorer?: () => void;
  onOpenSchedule?: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  onClick?: () => void;
  tag?: string;
}

export const SkillUpSidebar: React.FC<SidebarProps> = ({
  currentProfile,
  onProfileChange,
  onOpenExplorer,
  onOpenSchedule
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const session = currentProfile || getDemoSession();

  const handleLogout = () => {
    clearDemoSession();
    navigate('/');
  };

  const handleQuickSwitch = (key: 'asha' | 'kavya') => {
    const prof = DEMO_PROFILES[key];
    setDemoSession(prof);
    if (onProfileChange) {
      onProfileChange(prof);
    } else {
      navigate('/app/dashboard');
    }
  };

  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      path: '/app/dashboard',
      icon: Home,
      exact: true,
    },
    {
      label: 'Explore STEM',
      path: '/app/explore',
      icon: Compass,
    },
    {
      label: 'Experiment Studio',
      path: '/app/experiments',
      icon: FlaskConical,
    },
    {
      label: 'All Courses',
      path: '/app/dashboard#courses',
      icon: BookOpen,
      onClick: onOpenExplorer,
    },
    {
      label: 'STEM Lens',
      path: '/app/stem-lens',
      icon: Camera,
    },
    {
      label: 'Village Builder',
      path: '/app/village-builder',
      icon: Building2,
    },
    {
      label: 'Calendar',
      path: '/app/dashboard#schedule',
      icon: Calendar,
      onClick: onOpenSchedule,
    },
    {
      label: 'Achievements',
      path: '/app/dashboard#achievements',
      icon: Award,
    },
    {
      label: 'Statistics',
      path: '/app/dashboard#statistics',
      icon: BarChart3,
    },
  ];

  return (
    <aside className="w-64 bg-[#FBFAF9] border-r border-[#EFECE6] flex flex-col justify-between p-6 shrink-0 min-h-screen">
      {/* Top Branding */}
      <div>
        <Link to="/" className="flex items-center gap-2 mb-9 px-2 group">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-2xl tracking-tight text-[#352F2A]">
              Gaon<span className="text-[#FA9C4D]">Labs</span>
            </span>
            <div className="w-2 h-2 rounded-full bg-[#FA9C4D]" />
          </div>
          <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#FFEEDD] text-[#D47220] border border-[#FFD9B8]">
            गाँव लैब
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path.split('#')[0]) && item.path.split('#')[0] !== '/app/dashboard';

            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={item.onClick}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${isActive
                  ? 'bg-[#FAF5EF] text-[#352F2A] shadow-soft-sm border border-[#EFECE6]'
                  : 'text-[#636160] hover:text-[#352F2A] hover:bg-[#F8F4EE]/60'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 transition-colors ${isActive ? 'text-[#FA9C4D]' : 'text-[#9E9B97]'
                      }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.tag && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#FFEEDD] text-[#D47220]">
                    {item.tag}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Controls */}
      <div className="space-y-4 pt-6 border-t border-[#EFECE6]">
        {/* Profile Card & Switcher */}
        {session && (
          <div className="bg-[#FFFFFF] p-3 rounded-2xl border border-[#EFECE6] shadow-soft-sm">
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-8 h-8 rounded-full bg-[#FFEEDD] border border-[#FFD9B8] flex items-center justify-center text-[#FA9C4D] font-bold text-xs shrink-0">
                {session.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#352F2A] truncate">{session.name}</div>
                <div className="text-[11px] text-[#636160] truncate">
                  Class {session.grade} • {session.boardId === 'CBSE' ? 'CBSE' : 'KTBS'}
                </div>
              </div>
            </div>

            {/* Quick Profile Switcher */}
            <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-[#EFECE6]">
              <button
                type="button"
                onClick={() => handleQuickSwitch('asha')}
                className={`py-1 text-[10px] font-semibold rounded-lg transition-all ${session.email === DEMO_PROFILES.asha.email
                  ? 'bg-[#FFEEDD] text-[#D47220] font-bold'
                  : 'text-[#636160] hover:bg-[#F8F4EE]'
                  }`}
              >
                Asha (CBSE 8)
              </button>
              <button
                type="button"
                onClick={() => handleQuickSwitch('kavya')}
                className={`py-1 text-[10px] font-semibold rounded-lg transition-all ${session.email === DEMO_PROFILES.kavya.email
                  ? 'bg-[#FFEEDD] text-[#D47220] font-bold'
                  : 'text-[#636160] hover:bg-[#F8F4EE]'
                  }`}
              >
                Kavya (KTBS 7)
              </button>
            </div>
          </div>
        )}

        {/* Settings & Logout */}
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => alert('Settings: Offline sync and language preferences are active.')}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#636160] hover:text-[#352F2A] hover:bg-[#F8F4EE]/60 transition-colors"
          >
            <Settings className="w-4 h-4 text-[#9E9B97]" />
            <span>Settings</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#636160] hover:text-[#352F2A] hover:bg-[#F8F4EE]/60 transition-colors"
          >
            <LogOut className="w-4 h-4 text-[#9E9B97]" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export const GaonLabsSidebar = SkillUpSidebar;
