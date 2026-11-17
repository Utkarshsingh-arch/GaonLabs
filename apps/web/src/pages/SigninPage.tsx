import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Info, Check, UserCheck, AlertCircle } from 'lucide-react';
import { DEMO_PROFILES, setDemoSession } from '../services/demoAuth';

export const SigninPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('asha.cbse@gaonlab.demo');
  const [password, setPassword] = useState<string>('Demo@123');
  const [error, setError] = useState<string | null>(null);

  const fillCredentials = (profileKey: 'asha' | 'kavya') => {
    const profile = DEMO_PROFILES[profileKey];
    setEmail(profile.email);
    setPassword(profile.passwordHint);
    setError(null);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Match with available demo profiles
    const matched = Object.values(DEMO_PROFILES).find(
      (p) => p.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (matched) {
      setDemoSession(matched);
      navigate('/app/dashboard');
    } else {
      // Allow custom email demo login
      const customDemoProfile = {
        name: email.split('@')[0].replace('.', ' ').toUpperCase(),
        email: email.trim(),
        boardId: 'CBSE',
        boardName: 'Central Board of Secondary Education',
        grade: 8,
        medium: 'en',
        mediumName: 'English',
        subjects: ['Mathematics', 'Science'],
      };
      setDemoSession(customDemoProfile);
      navigate('/app/dashboard');
    }
  };

  return (
    <div className="flex-1 max-w-md mx-auto px-4 py-10 w-full flex flex-col justify-center">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center mx-auto mb-3 shadow-2xs">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Student Sign In</h1>
        <p className="text-xs text-slate-500 mt-1">
          Access your personalised curriculum and textbooks
        </p>
      </div>

      {/* Demo Notice Banner */}
      <div className="mb-5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="leading-tight">
          <strong>Demo environment</strong> — no real student account is required. Click below to load pre-configured demonstration profiles.
        </div>
      </div>

      {/* Demo Credentials Quick-Fill Cards */}
      <div className="mb-6 space-y-2.5">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Available Demo Credentials
        </div>

        <button
          type="button"
          onClick={() => fillCredentials('asha')}
          className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
            email === DEMO_PROFILES.asha.email
              ? 'border-brand-500 bg-brand-50/50 shadow-2xs ring-1 ring-brand-400'
              : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-slate-900">Demo Student A: Asha Rao</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 font-semibold">
                CBSE Class 8
              </span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Email: <code className="font-mono text-slate-700">{DEMO_PROFILES.asha.email}</code>
            </div>
          </div>
          {email === DEMO_PROFILES.asha.email && <Check className="w-4 h-4 text-brand-600" />}
        </button>

        <button
          type="button"
          onClick={() => fillCredentials('kavya')}
          className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
            email === DEMO_PROFILES.kavya.email
              ? 'border-brand-500 bg-brand-50/50 shadow-2xs ring-1 ring-brand-400'
              : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-slate-900">Demo Student B: Kavya Hegde</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-semibold">
                Karnataka Class 7
              </span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Email: <code className="font-mono text-slate-700">{DEMO_PROFILES.kavya.email}</code>
            </div>
          </div>
          {email === DEMO_PROFILES.kavya.email && <Check className="w-4 h-4 text-brand-600" />}
        </button>
      </div>

      {/* Sign-in Form */}
      <form onSubmit={handleSignIn} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Student Email (Demo)
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all font-mono"
              placeholder="student@gaonlab.demo"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Password (Demo)
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all font-mono"
              placeholder="Demo@123"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm shadow-brand-600/20 transition-all flex items-center justify-center gap-2"
        >
          <UserCheck className="w-4 h-4" />
          <span>Launch Demo Dashboard</span>
        </button>

        <div className="text-center pt-2">
          <Link to="/signup" className="text-xs text-brand-700 hover:underline font-medium">
            Need to register a custom student profile? Sign up here →
          </Link>
        </div>
      </form>
    </div>
  );
};
