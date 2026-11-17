import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  UserPlus,
  Info,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { fetchBoards, fetchCatalogue } from '../services/api';
import { setDemoSession } from '../services/demoAuth';
import { EducationBoard, DemoProfile } from '../types';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  // Form states
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('Demo@123');
  const [boardId, setBoardId] = useState<string>('CBSE');
  const [grade, setGrade] = useState<number>(8);
  const [medium, setMedium] = useState<string>('en');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['Mathematics', 'Science']);
  const [schoolName, setSchoolName] = useState<string>('');
  const [interests, setInterests] = useState<string>('');

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

  const toggleSubject = (sub: string) => {
    if (selectedSubjects.includes(sub)) {
      if (selectedSubjects.length > 1) {
        setSelectedSubjects(selectedSubjects.filter((s) => s !== sub));
      }
    } else {
      setSelectedSubjects([...selectedSubjects, sub]);
    }
  };

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
      subjects: selectedSubjects,
      schoolName: schoolName.trim() || undefined,
      interests: interests.trim() || undefined,
    };

    setDemoSession(newProfile);
    navigate('/app/dashboard');
  };

  return (
    <div className="flex-1 max-w-2xl mx-auto px-4 py-10 w-full">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center mx-auto mb-3 shadow-2xs">
          <UserPlus className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Student Registration</h1>
        <p className="text-xs text-slate-500 mt-1">
          Select your education board and grade to personalize your STEM laboratory
        </p>
      </div>

      {/* Demo Notice */}
      <div className="mb-6 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong>Demo Registration:</strong> This form creates a local demonstration profile in browser session storage. No actual Minor Account or guardian SMS OTP verification is triggered during this prototype stage.
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        {/* Basic Student Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Student Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ramesh Kumar"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address (Demo) *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@gaonlab.demo"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password (Demo-only) *
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Demo@123"
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Academic Details: Board & Grade */}
        <div className="border-t border-slate-100 pt-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
            Academic Track & Board
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Education Board *
              </label>
              <select
                value={boardId}
                onChange={(e) => setBoardId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="CBSE">CBSE (National NCERT Track)</option>
                <option value="KARNATAKA_STATE_BOARD">Karnataka State Board (KTBS)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Class / Standard *
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((g) => (
                  <option key={g} value={g}>
                    Class {g} {g >= 6 && g <= 8 ? '★ Active Middle School' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Medium of Instruction *
              </label>
              <select
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
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
          <div className="mt-3">
            {isCheckingCurriculum ? (
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-ping"></span>
                <span>Checking curriculum availability in database...</span>
              </div>
            ) : isCurriculumAvailable ? (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  <strong>Curriculum Available:</strong> {curriculumCount} verified subject catalogue(s) ready for {boardId === 'CBSE' ? 'CBSE' : 'Karnataka'} Class {grade}.
                </span>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Curriculum Unavailable:</strong> No board-specific curriculum versions are officially mapped for {boardId} Class {grade} in {medium.toUpperCase()} medium yet.
                  <div className="mt-1 text-[11px] text-amber-800">
                    <em>Tip:</em> Try selecting <strong>Class 6, 7, or 8</strong> for active board-certified middle-school textbooks, or choose English/Kannada medium.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Subjects Selection */}
        <div className="border-t border-slate-100 pt-4">
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Selected STEM Subjects *
          </label>
          <div className="flex flex-wrap gap-2">
            {['Mathematics', 'Science', 'Computer Science', 'Environmental Studies'].map((sub) => {
              const active = selectedSubjects.includes(sub);
              return (
                <button
                  type="button"
                  key={sub}
                  onClick={() => toggleSubject(sub)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    active
                      ? 'bg-brand-50 border-brand-500 text-brand-800 font-semibold shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {sub} {active && '✓'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Optional School & Interests */}
        <div className="border-t border-slate-100 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              School Name (Optional)
            </label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="e.g. Govt. High School, Sirsi"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Learning Interests (Optional)
            </label>
            <input
              type="text"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g. Farming tools, robotics, stars"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md shadow-brand-600/20 transition-all flex items-center justify-center gap-2 group"
          >
            <span>Complete Registration & Open Dashboard</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="text-center text-xs text-slate-500">
          Already have a demo account?{' '}
          <Link to="/signin" className="text-brand-700 font-semibold hover:underline">
            Sign In here
          </Link>
        </div>
      </form>
    </div>
  );
};
