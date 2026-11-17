import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  UserPlus,
  Info,
  AlertTriangle,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { fetchBoards, fetchCatalogue } from '../services/api';
import { setDemoSession } from '../services/demoAuth';
import { EducationBoard, DemoProfile } from '../types';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  // Form states
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [boardId, setBoardId] = useState<string>('CBSE');
  const [grade, setGrade] = useState<number>(8);
  const [medium, setMedium] = useState<string>('en');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedBoardObj = boards.find((b) => b.id === boardId);
    const mediumObj = availableMediums.find((m) => m.code === medium);

    const newProfile: DemoProfile = {
      name: name.trim() || 'Demo Student',
      email: email.trim() || 'student@gaonlab.demo',
      boardId,
      boardName: selectedBoardObj?.name || boardId,
      grade,
      medium,
      mediumName: mediumObj?.name || medium,
      subjects: ['Mathematics', 'Science'],
    };

    setDemoSession(newProfile);
    navigate('/app/dashboard');
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
            Select your education board and grade to personalize your STEM laboratory
          </p>
        </div>

        {/* Demo Notice */}
        <div className="mb-6 p-3.5 rounded-2xl bg-[#FAF5EF] border border-[#EFECE6] text-xs text-[#352F2A] flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#FA9C4D] shrink-0 mt-0.5" />
          <div className="leading-tight font-medium">
            <strong>Demonstration Registration:</strong> This form creates a local profile in browser session storage. No actual Minor Account or SMS verification is required for testing.
          </div>
        </div>

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
                Email Address (Demo) *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@gaonlab.demo"
                className="w-full px-3.5 py-2.5 text-xs bg-[#FBFAF9] border border-[#EFECE6] rounded-2xl text-[#352F2A] focus:outline-none focus:border-[#FA9C4D] focus:bg-[#FFFFFF] transition-all font-mono"
              />
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
                    Class {g} {g === 8 ? '(Recommended for Demo)' : ''}
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
            <span className="text-[#636160] font-medium">Curriculum Database Ingestion Status:</span>
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
            className="w-full py-3.5 px-4 rounded-2xl bg-[#FA9C4D] hover:bg-[#EB8833] text-white text-xs font-extrabold shadow-orange-glow transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <span>Complete Registration & Open Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-[#636160]">
          Already have a demo account?{' '}
          <Link to="/signin" className="font-bold text-[#FA9C4D] hover:underline">
            Sign In Directly
          </Link>
        </div>
      </div>
    </div>
  );
};
