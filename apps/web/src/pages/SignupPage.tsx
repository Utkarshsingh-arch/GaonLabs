import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  UserPlus,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';
import { fetchBoards, fetchCatalogue } from '../services/api';
import { signUpStudent } from '../services/supabase';
import { EducationBoard } from '../types';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  // Form states
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [boardId, setBoardId] = useState<string>('CBSE');
  const [grade, setGrade] = useState<number>(8);
  const [medium, setMedium] = useState<string>('en');

  // Loading & error states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Curriculum availability checking
  const [boards, setBoards] = useState<EducationBoard[]>([]);
  const [isCheckingCurriculum, setIsCheckingCurriculum] = useState<boolean>(false);
  const [isCurriculumAvailable, setIsCurriculumAvailable] = useState<boolean>(true);
  const [curriculumCount, setCurriculumCount] = useState<number>(2);

  // Load available boards on mount
  useEffect(() => {
    fetchBoards().then((res) => {
      if (res.data && res.data.length > 0) {
        setBoards(res.data);
      }
    });
  }, []);

  // Update mediums depending on board
  const availableMediums =
    boardId === 'KARNATAKA_STATE_BOARD'
      ? [
          { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
          { code: 'en', name: 'English' },
        ]
      : [
          { code: 'en', name: 'English' },
          { code: 'hi', name: 'हिन्दी (Hindi)' },
          { code: 'ur', name: 'اردو (Urdu)' },
        ];

  // Check curriculum availability when board, grade, or medium changes
  useEffect(() => {
    setIsCheckingCurriculum(true);
    fetchCatalogue({ boardId, grade, medium })
      .then((res) => {
        const count = res.data?.length || 0;
        setCurriculumCount(count);
        setIsCurriculumAvailable(count > 0);
      })
      .catch(() => {
        setIsCurriculumAvailable(false);
      })
      .finally(() => {
        setIsCheckingCurriculum(false);
      });
  }, [boardId, grade, medium]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setSuccessMessage(null);

    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setAuthError('Passwords do not match. Please verify your password.');
      return;
    }

    const selectedBoardObj = boards.find((b) => b.id === boardId);
    const mediumObj = availableMediums.find((m) => m.code === medium);

    setIsLoading(true);

    try {
      await signUpStudent({
        name: name.trim() || 'Student',
        email: email.trim(),
        password,
        boardId,
        boardName: selectedBoardObj?.name || boardId,
        grade,
        medium,
        mediumName: mediumObj?.name || medium,
        schoolName: 'Govt. Model School',
      });

      setSuccessMessage('Student account successfully created! Redirecting to your dashboard...');
      setTimeout(() => {
        navigate('/app/dashboard');
      }, 1000);
    } catch (err: any) {
      console.error('Sign up error:', err);
      setAuthError(err.message || 'Failed to create student account. Please check your details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-[#FBFAF9] flex items-center justify-center p-4 sm:p-6 py-12">
      <div className="max-w-2xl w-full bg-[#FFFFFF] rounded-3xl border border-[#EFECE6] p-7 sm:p-9 shadow-soft-sm">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#FFEEDD] text-[#FA9C4D] flex items-center justify-center mx-auto mb-3 shadow-soft-sm">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#352F2A] tracking-tight">Student Registration</h1>
          <p className="text-xs text-[#636160] mt-1 font-medium">
            Create your individual GaonLabs account to access verified textbooks & STEM labs
          </p>
        </div>

        {/* Success Alert Banner */}
        {successMessage && (
          <div className="mb-5 p-3.5 rounded-2xl bg-[#CEECDA] border border-[#A1DCB9] text-xs text-[#389461] flex items-center gap-2.5 font-bold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Alert Banner */}
        {authError && (
          <div className="mb-5 p-3.5 rounded-2xl bg-[#FFE2E2] border border-[#FFD0D0] text-xs text-[#E5484D] flex items-center gap-2.5 font-semibold">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic Student Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#352F2A] mb-1.5">
                Student Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full px-3.5 py-2.5 text-xs bg-[#FBFAF9] border border-[#EFECE6] rounded-2xl text-[#352F2A] focus:outline-none focus:border-[#FA9C4D] focus:bg-[#FFFFFF] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#352F2A] mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                className="w-full px-3.5 py-2.5 text-xs bg-[#FBFAF9] border border-[#EFECE6] rounded-2xl text-[#352F2A] focus:outline-none focus:border-[#FA9C4D] focus:bg-[#FFFFFF] transition-all font-mono"
              />
            </div>
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#352F2A] mb-1.5">
                Account Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-3.5 pr-10 py-2.5 text-xs bg-[#FBFAF9] border border-[#EFECE6] rounded-2xl text-[#352F2A] focus:outline-none focus:border-[#FA9C4D] focus:bg-[#FFFFFF] transition-all font-mono"
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

            <div>
              <label className="block text-xs font-bold text-[#352F2A] mb-1.5">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className="w-full pl-3.5 pr-10 py-2.5 text-xs bg-[#FBFAF9] border border-[#EFECE6] rounded-2xl text-[#352F2A] focus:outline-none focus:border-[#FA9C4D] focus:bg-[#FFFFFF] transition-all font-mono"
                />
              </div>
            </div>
          </div>

          {/* Education Board Selection */}
          <div>
            <label className="block text-xs font-bold text-[#352F2A] mb-2">
              Select Education Board *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setBoardId('CBSE')}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  boardId === 'CBSE'
                    ? 'border-[#FA9C4D] bg-[#FFEEDD]/60 shadow-soft-sm'
                    : 'border-[#EFECE6] bg-[#FBFAF9] hover:bg-[#FAF5EF]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-extrabold text-[#352F2A]">CBSE</span>
                  {boardId === 'CBSE' && (
                    <span className="text-[10px] font-bold text-[#48AF76] bg-[#CEECDA] px-2 py-0.5 rounded-full">Selected</span>
                  )}
                </div>
                <p className="text-[11px] text-[#636160]">Central Board of Secondary Education (NCERT)</p>
              </button>

              <button
                type="button"
                onClick={() => setBoardId('KARNATAKA_STATE_BOARD')}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  boardId === 'KARNATAKA_STATE_BOARD'
                    ? 'border-[#FA9C4D] bg-[#FFEEDD]/60 shadow-soft-sm'
                    : 'border-[#EFECE6] bg-[#FBFAF9] hover:bg-[#FAF5EF]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-extrabold text-[#352F2A]">Karnataka State Board</span>
                  {boardId === 'KARNATAKA_STATE_BOARD' && (
                    <span className="text-[10px] font-bold text-[#48AF76] bg-[#CEECDA] px-2 py-0.5 rounded-full">Selected</span>
                  )}
                </div>
                <p className="text-[11px] text-[#636160]">Karnataka School Examination Board (KTBS / DSERT)</p>
              </button>
            </div>
          </div>

          {/* Grade and Medium */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#352F2A] mb-1.5">
                Class / Grade *
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-xs bg-[#FBFAF9] border border-[#EFECE6] rounded-2xl text-[#352F2A] focus:outline-none focus:border-[#FA9C4D] focus:bg-[#FFFFFF] transition-all"
              >
                {[6, 7, 8, 9, 10, 11, 12].map((g) => (
                  <option key={g} value={g}>
                    Class {g} {g === 8 ? '(Recommended)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#352F2A] mb-1.5">
                Medium of Instruction *
              </label>
              <select
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-[#FBFAF9] border border-[#EFECE6] rounded-2xl text-[#352F2A] focus:outline-none focus:border-[#FA9C4D] focus:bg-[#FFFFFF] transition-all"
              >
                {availableMediums.map((m) => (
                  <option key={m.code} value={m.code}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Curriculum Availability Status Indicator */}
          <div className="p-3 rounded-2xl bg-[#FBFAF9] border border-[#EFECE6] flex items-center justify-between text-xs">
            <span className="text-[#636160] font-medium">Curriculum Database Ingestion:</span>
            {isCheckingCurriculum ? (
              <span className="text-[#9E9B97] font-semibold">Checking repository...</span>
            ) : isCurriculumAvailable ? (
              <span className="text-[#48AF76] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {curriculumCount} Prescribed Subjects Available
              </span>
            ) : (
              <span className="text-[#FA9C4D] font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Ingestion Pending
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#FA9C4D] hover:bg-[#EB8833] disabled:opacity-50 text-white text-xs font-extrabold shadow-orange-glow transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <span>Creating Student Account...</span>
            ) : (
              <>
                <span>Complete Registration & Open Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-[#636160]">
          Already have an account?{' '}
          <Link to="/signin" className="font-bold text-[#FA9C4D] hover:underline">
            Sign In with Email & Password
          </Link>
        </div>
      </div>
    </div>
  );
};
