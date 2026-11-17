import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Info, Check, ArrowRight } from 'lucide-react';
import { DEMO_PROFILES, setDemoSession } from '../services/demoAuth';

export const SigninPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('asha.cbse@gaonlab.demo');
  const [password, setPassword] = useState<string>('Demo@123');

  const fillCredentials = (profileKey: 'asha' | 'kavya') => {
    const profile = DEMO_PROFILES[profileKey];
    setEmail(profile.email);
    setPassword(profile.passwordHint);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();

    const matched = Object.values(DEMO_PROFILES).find(
      (p) => p.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (matched) {
      setDemoSession(matched);
      navigate('/app/dashboard');
    } else {
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
    <div className="flex-1 bg-[#FBFAF9] flex items-center justify-center p-4 sm:p-6 py-12">
      <div className="max-w-md w-full bg-[#FFFFFF] rounded-3xl border border-[#EFECE6] p-7 sm:p-9 shadow-soft-sm">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#FFEEDD] text-[#FA9C4D] flex items-center justify-center mx-auto mb-3 shadow-soft-sm">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#352F2A] tracking-tight">Student Sign In</h1>
          <p className="text-xs text-[#636160] mt-1 font-medium">
            Access your personalised curriculum and textbooks
          </p>
        </div>

        {/* Demo Notice Banner */}
        <div className="mb-5 p-3.5 rounded-2xl bg-[#FAF5EF] border border-[#EFECE6] text-xs text-[#352F2A] flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#FA9C4D] shrink-0 mt-0.5" />
          <div className="leading-tight font-medium">
            <strong>Demonstration Mode</strong> — Select a pre-configured profile below to test real backend curriculum ingestion instantly.
          </div>
        </div>

        {/* Demo Credentials Quick-Fill Cards */}
        <div className="mb-6 space-y-2">
          <div className="text-[10px] font-bold text-[#9E9B97] uppercase tracking-wider">
            Available Demo Credentials
          </div>

          <button
            type="button"
            onClick={() => fillCredentials('asha')}
            className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
              email === DEMO_PROFILES.asha.email
                ? 'border-[#FA9C4D] bg-[#FFEEDD]/60 shadow-soft-sm'
                : 'border-[#EFECE6] bg-[#FBFAF9] hover:bg-[#FAF5EF]'
            }`}
          >
            <div>
              <div className="text-xs font-bold text-[#352F2A]">Asha Rao (CBSE Class 8)</div>
              <div className="text-[11px] text-[#636160] font-mono mt-0.5">{DEMO_PROFILES.asha.email}</div>
            </div>
            {email === DEMO_PROFILES.asha.email && (
              <Check className="w-4 h-4 text-[#FA9C4D]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => fillCredentials('kavya')}
            className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
              email === DEMO_PROFILES.kavya.email
                ? 'border-[#FA9C4D] bg-[#FFEEDD]/60 shadow-soft-sm'
                : 'border-[#EFECE6] bg-[#FBFAF9] hover:bg-[#FAF5EF]'
            }`}
          >
            <div>
              <div className="text-xs font-bold text-[#352F2A]">Kavya Hegde (KTBS Class 7)</div>
              <div className="text-[11px] text-[#636160] font-mono mt-0.5">{DEMO_PROFILES.kavya.email}</div>
            </div>
            {email === DEMO_PROFILES.kavya.email && (
              <Check className="w-4 h-4 text-[#FA9C4D]" />
            )}
          </button>
        </div>

        {/* Sign In Form */}
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#352F2A] mb-1.5">
              Login Identifier / Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#9E9B97] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2.5 text-xs bg-[#FBFAF9] border border-[#EFECE6] rounded-2xl text-[#352F2A] placeholder-[#9E9B97] focus:outline-none focus:border-[#FA9C4D] focus:bg-[#FFFFFF] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#352F2A] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#9E9B97] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2.5 text-xs bg-[#FBFAF9] border border-[#EFECE6] rounded-2xl text-[#352F2A] placeholder-[#9E9B97] focus:outline-none focus:border-[#FA9C4D] focus:bg-[#FFFFFF] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-2xl bg-[#FA9C4D] hover:bg-[#EB8833] text-white text-xs font-bold shadow-orange-glow transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <span>Enter Learning Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-[#636160]">
          Don't have a profile yet?{' '}
          <Link to="/signup" className="font-bold text-[#FA9C4D] hover:underline">
            Register for Demo
          </Link>
        </div>
      </div>
    </div>
  );
};
