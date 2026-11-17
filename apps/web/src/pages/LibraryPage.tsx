import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Search,
  School,
  Globe,
  Layers,
  Sparkles,
  ChevronRight,
  CheckCircle,
  ArrowLeft,
} from 'lucide-react';
import { fetchCatalogue, fetchBoards } from '../services/api';
import { getDemoSession, DEMO_PROFILES, setDemoSession } from '../services/demoAuth';
import { CatalogueEntry, EducationBoard } from '../types';

export const LibraryPage: React.FC = () => {
  const demoStudent = getDemoSession();

  // Filter states
  const [selectedBoard, setSelectedBoard] = useState(demoStudent?.boardId || 'CBSE');
  const [selectedGrade, setSelectedGrade] = useState<number>(demoStudent?.grade || 8);
  const [selectedMedium, setSelectedMedium] = useState(demoStudent?.medium || 'en');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [boards, setBoards] = useState<EducationBoard[]>([]);
  const [catalogueEntries, setCatalogueEntries] = useState<CatalogueEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load Boards
  useEffect(() => {
    fetchBoards().then((res) => {
      if (res.data) setBoards(res.data);
    });
  }, []);

  // Load Catalogue
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchCatalogue({
      boardId: selectedBoard,
      grade: selectedGrade,
      medium: selectedMedium,
    }).then((res) => {
      if (!isMounted) return;
      if (res.data) {
        setCatalogueEntries(res.data);
      }
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [selectedBoard, selectedGrade, selectedMedium]);

  // Handle Demo Student Switcher
  const handleSwitchDemoProfile = (key: 'asha' | 'kavya') => {
    const profile = DEMO_PROFILES[key];
    setDemoSession(profile);
    setSelectedBoard(profile.boardId);
    setSelectedGrade(profile.grade);
    setSelectedMedium(profile.medium);
  };

  // Flatten and filter textbooks from catalogue entries
  const booksList: Array<{
    editionId: string;
    title: string;
    publisher: string;
    grade: number;
    subject: string;
    language: string;
    totalChapters: number;
    status: string;
    isCompanionAvailable: boolean;
  }> = [];

  catalogueEntries.forEach((entry) => {
    entry.curriculumTextbooks.forEach((ct) => {
      const ed = ct.textbookEdition;
      const title = ed.titleInLanguage || ed.textbook.canonicalTitle;
      const publisher = ed.textbook.publisher.name;
      const subject = entry.subject.name;

      if (selectedSubject !== 'ALL' && entry.subject.id !== selectedSubject && entry.subject.code !== selectedSubject) {
        return;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (
          !title.toLowerCase().includes(q) &&
          !publisher.toLowerCase().includes(q) &&
          !subject.toLowerCase().includes(q)
        ) {
          return;
        }
      }

      // Check if forces and friction companion exists
      const isFrictionCompanion =
        entry.level.numericGrade === 8 &&
        (subject.toLowerCase().includes('science') || title.toLowerCase().includes('curiosity'));

      booksList.push({
        editionId: ed.id,
        title,
        publisher,
        grade: entry.level.numericGrade,
        subject,
        language: ed.medium,
        totalChapters: ed.totalChapters || ed.chapters?.length || 13,
        status: ed.status,
        isCompanionAvailable: isFrictionCompanion,
      });
    });
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <Link
              to="/app/dashboard"
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition"
              title="Return to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                  Curriculum Library
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {demoStudent ? `Learner: ${demoStudent.name}` : 'Student Library'}
                </span>
              </div>
              <h1 className="text-base font-bold text-slate-900 leading-tight">
                Textbook & Chapter Library
              </h1>
            </div>
          </div>

          {/* Quick Demo Student Switcher */}
          <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl text-xs">
            <span className="text-[11px] font-semibold text-slate-500 pl-2 pr-1">Demo Student:</span>
            <button
              onClick={() => handleSwitchDemoProfile('asha')}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                selectedBoard === 'CBSE'
                  ? 'bg-white text-brand-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Asha (CBSE Cl 8)
            </button>
            <button
              onClick={() => handleSwitchDemoProfile('kavya')}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                selectedBoard === 'KARNATAKA_STATE_BOARD'
                  ? 'bg-white text-brand-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kavya (KTBS Cl 7)
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Filters & Search Toolbar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search textbook title, author, subject..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500 transition"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {/* Board Selector */}
              <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
                <School className="w-3.5 h-3.5 text-slate-500" />
                <select
                  value={selectedBoard}
                  onChange={(e) => setSelectedBoard(e.target.value)}
                  className="bg-transparent font-semibold text-slate-700 focus:outline-none cursor-pointer"
                >
                  {boards.length > 0 ? (
                    boards.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.code} ({b.jurisdiction === 'CENTRAL' ? 'National' : 'State'})
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="CBSE">CBSE (National)</option>
                      <option value="KARNATAKA_STATE_BOARD">Karnataka State Board</option>
                    </>
                  )}
                </select>
              </div>

              {/* Grade Selector */}
              <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
                <span className="font-semibold text-slate-500">Class:</span>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(Number(e.target.value))}
                  className="bg-transparent font-semibold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value={6}>Class 6</option>
                  <option value={7}>Class 7</option>
                  <option value={8}>Class 8</option>
                  <option value={9}>Class 9</option>
                  <option value={10}>Class 10</option>
                </select>
              </div>

              {/* Medium Selector */}
              <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <select
                  value={selectedMedium}
                  onChange={(e) => setSelectedMedium(e.target.value)}
                  className="bg-transparent font-semibold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="en">English Medium</option>
                  <option value="kn">Kannada (ಕನ್ನಡ)</option>
                  <option value="hi">Hindi (हिंदी)</option>
                </select>
              </div>

              {/* Subject Selector */}
              <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
                <Layers className="w-3.5 h-3.5 text-slate-500" />
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="bg-transparent font-semibold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Subjects</option>
                  <option value="MATH">Mathematics</option>
                  <option value="SCIENCE">Science</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Books Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600">
              Prescribed Textbooks ({booksList.length})
            </h2>
            <span className="text-xs text-slate-500">
              Academic Year 2026–27
            </span>
          </div>

          {isLoading ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <div className="w-8 h-8 border-3 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-slate-500 font-medium">Fetching curriculum catalogue...</p>
            </div>
          ) : booksList.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700">No Textbooks Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No textbooks matched the selected board, class, or language combination. Try switching
                filters or choosing another demo profile.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {booksList.map((bk) => {
                const isKannada = bk.language === 'kn';

                return (
                  <div
                    key={bk.editionId}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between group"
                  >
                    <div>
                      {/* Book Cover Illustration Header */}
                      <div
                        className={`p-5 text-white flex flex-col justify-between h-36 ${
                          isKannada
                            ? 'bg-gradient-to-br from-amber-600 to-red-800'
                            : bk.subject.toLowerCase().includes('math')
                            ? 'bg-gradient-to-br from-brand-700 to-emerald-900'
                            : 'bg-gradient-to-br from-brand-800 to-indigo-900'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-black/25">
                            Class {bk.grade}
                          </span>
                          <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-white/20">
                            {bk.language === 'kn' ? 'Kannada' : 'English'}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-base font-extrabold leading-tight line-clamp-2">
                            {bk.title}
                          </h3>
                          <p className="text-[10px] text-white/80 uppercase font-semibold mt-1">
                            {bk.publisher}
                          </p>
                        </div>
                      </div>

                      {/* Content Info */}
                      <div className="p-4 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-500">Subject</span>
                          <span className="font-bold text-slate-800">{bk.subject}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-500">Chapters Ingested</span>
                          <span className="font-bold text-slate-800">{bk.totalChapters} Chapters</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-500">Verification</span>
                          <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-700">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            <span>{bk.status}</span>
                          </span>
                        </div>

                        {bk.isCompanionAvailable && (
                          <div className="mt-2 bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-[11px] text-emerald-800 flex items-center space-x-1.5 font-medium">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Authorized Visual Guide Ready</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="p-4 pt-0">
                      <Link
                        to={`/app/books/${bk.editionId}`}
                        className="w-full py-2.5 bg-slate-900 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 shadow-sm group-hover:bg-brand-700"
                      >
                        <span>Browse Book & Chapters</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
