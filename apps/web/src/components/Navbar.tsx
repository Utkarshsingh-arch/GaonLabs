import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, LogOut, BookOpen, Compass } from 'lucide-react';
import { getDemoSession, clearDemoSession } from '../services/demoAuth';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const session = getDemoSession();

  const handleLogout = () => {
    clearDemoSession();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-500 flex items-center justify-center text-white shadow-sm shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-slate-900 tracking-tight">GaonLab</span>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-brand-100 text-brand-800">गाँव लैब</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-none">Experiential Rural STEM</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {session ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/app/explore"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-50 border border-brand-200 hover:bg-brand-100 text-brand-800 text-xs font-bold transition"
              >
                <Compass className="w-3.5 h-3.5 text-brand-700" />
                <span>Explore STEM</span>
              </Link>

              <Link
                to="/app/library"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-brand-500 hover:text-brand-700 text-slate-700 text-xs font-semibold transition"
              >
                <BookOpen className="w-3.5 h-3.5 text-brand-600" />
                <span>Book Library</span>
              </Link>

              <Link
                to="/app/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 transition-colors text-xs font-medium text-slate-800"
              >
                <div className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold">
                  {session.name.charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="leading-tight font-semibold text-slate-900">{session.name}</div>
                  <div className="text-[10px] text-slate-500">
                    Class {session.grade} • {session.boardId === 'CBSE' ? 'CBSE' : 'KTBS'}
                  </div>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-slate-600 text-xs font-medium transition-colors"
                title="Sign out of demo session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/signin"
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm shadow-brand-600/20 transition-all hover:shadow"
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
