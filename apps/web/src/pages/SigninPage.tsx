import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Lock,
  Mail,
  Check,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { DEMO_PROFILES, setDemoSession } from '../services/demoAuth';
import { signInStudent } from '../services/supabase';

export const SigninPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('asha.cbse@gaonlab.demo');
  const [password, setPassword] = useState<string>('Demo@123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const fillCredentials = (profileKey: 'asha' | 'kavya') => {
    const profile = DEMO_PROFILES[profileKey];
    setEmail(profile.email);
    setPassword(profile.passwordHint);
    setAuthError(null);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoading(true);

    // 1. Check if it's one of the built-in demo profiles
    const matched = Object.values(DEMO_PROFILES).find(
      (p) => p.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (matched) {
      setDemoSession(matched);
      setIsLoading(false);
      navigate('/app/dashboard');
      return;
    }

    // 2. Authenticate against Supabase Auth
    try {
      await signInStudent(email, password);
      navigate('/app/dashboard');
    } catch (err: any) {
      console.error('Sign in error:', err);
      // If user not found or wrong password
      if (err.message?.includes('Invalid login credentials') || err.message?.includes('Email not confirmed')) {
        setAuthError(
          err.message?.includes('Email not confirmed')
            ? 'Your email address has not been confirmed yet. Please verify your email or contact support.'
            : 'Invalid login credentials. Please check your email and password, or register below.'
        );
      } else {
        setAuthError(err.message || 'Unable to sign in. Please verify your internet connection.');
      }
    } finally {
      setIsLoading(false);
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
            Access your individual curriculum, textbooks, and STEM laboratory
          </p>
        </div>

        {/* Error Alert Banner */}
        {authError && (
          <div className="mb-5 p-3.5 rounded-2xl bg-[#FFE2E2] border border-[#FFD0D0] text-xs text-[#E5484D] flex items-start gap-2.5 font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="leading-tight">{authError}</div>
          </div>
        )}

        {/* Demo Credentials Quick-Fill Cards */}
        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-bold text-[#9E9B97] uppercase tracking-wider">
            <span>One-Click Demo Profiles</span>
            <span className="text-[#FA9C4D]">Instant Access</span>
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
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#9E9B97] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="student@example.com"
                className="w-full pl-10 pr-3 py-2.5 text-xs bg-[#FBFAF9] border border-[#EFECE6] rounded-2xl text-[#352F2A] placeholder-[#9E9B97] focus:outline-none focus:border-[#FA9C4D] focus:bg-[#FFFFFF] transition-all font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#352F2A] mb-1.5">
              Account Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#9E9B97] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-2.5 text-xs bg-[#FBFAF9] border border-[#EFECE6] rounded-2xl text-[#352F2A] placeholder-[#9E9B97] focus:outline-none focus:border-[#FA9C4D] focus:bg-[#FFFFFF] transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9B97] hover:text-[#352F2A]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-2xl bg-[#FA9C4D] hover:bg-[#EB8833] disabled:opacity-50 text-white text-xs font-bold shadow-orange-glow transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <span>Enter Learning Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-[#636160]">
          Don't have a student account yet?{' '}
          <Link to="/signup" className="font-bold text-[#FA9C4D] hover:underline">
            Register New Student
          </Link>
        </div>
      </div>
    </div>
  );
};
