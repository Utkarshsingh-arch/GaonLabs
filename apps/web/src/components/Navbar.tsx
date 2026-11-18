import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, LogOut, ArrowRight, Compass, FlaskConical, BookOpen } from 'lucide-react';
import { getDemoSession, clearDemoSession } from '../services/demoAuth';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const session = getDemoSession();

  // If we are inside pages that render SkillUpSidebar (dashboard, stem-lens, village-builder), let the in-app sidebar and header handle navigation
  const hasAppSidebar = ['/app/dashboard', '/app/stem-lens', '/app/village-builder'].some(
    (p) => location.pathname === p || location.pathname.startsWith(p + '/')
  );
  if (hasAppSidebar) {
    return null;
  }

  const handleLogout = () => {
    clearDemoSession();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#EFECE6]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-2xl tracking-tight text-[#352F2A]">
              Gaon<span className="text-[#FA9C4D]">Labs</span>
            </span>
            <div className="w-2 h-2 rounded-full bg-[#FA9C4D]" />
          </div>
          <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#FFEEDD] text-[#D47220] border border-[#FFD9B8]">
            STEM
          </span>
        </Link>

        {/* Right Navigation */}
        <div className="flex items-center gap-2 sm:gap-3">
          {session ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/app/explore"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#FAF5EF] border border-[#EFECE6] hover:bg-[#FFEEDD] text-[#352F2A] hover:text-[#D47220] text-xs font-bold transition shadow-soft-sm"
              >
                <Compass className="w-3.5 h-3.5 text-[#FA9C4D]" />
                <span>Explore STEM</span>
              </Link>

              <Link
                to="/app/experiments"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#FAF5EF] border border-[#EFECE6] hover:bg-[#FFEEDD] text-[#352F2A] hover:text-[#D47220] text-xs font-bold transition shadow-soft-sm"
              >
                <FlaskConical className="w-3.5 h-3.5 text-[#FA9C4D]" />
                <span>Experiment Studio</span>
              </Link>

              <Link
                to="/app/library"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border border-[#EFECE6] hover:bg-[#FAF5EF] text-[#636160] hover:text-[#352F2A] text-xs font-semibold transition"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#9E9B97]" />
                <span>Book Library</span>
              </Link>

              <Link
                to="/app/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#FFEEDD] hover:bg-[#FFD9B8] transition-colors text-xs font-bold text-[#D47220] shadow-soft-sm"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-2xl border border-[#EFECE6] hover:bg-[#FAF5EF] text-[#636160] hover:text-[#352F2A] text-xs font-semibold transition-colors"
                title="Sign out of demo session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/signin"
                className="px-4 py-2 text-xs font-bold text-[#636160] hover:text-[#352F2A] transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-[#FA9C4D] hover:bg-[#EB8833] text-white text-xs font-bold shadow-orange-glow transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Student Sign Up</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
