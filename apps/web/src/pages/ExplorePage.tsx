import React, { useEffect, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Compass,
  Search,
  BookOpen,
  Video,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { fetchExploreTopics, fetchBoards } from '../services/api';
import { getDemoSession } from '../services/demoAuth';
import { TopicSummary, EducationBoard } from '../types';

export const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const demoStudent = getDemoSession();

  // URL-driven or default state
  const initialGrade = searchParams.get('grade')
    ? (searchParams.get('grade') === 'ALL' ? 'ALL' : parseInt(searchParams.get('grade')!, 10))
    : demoStudent?.grade || 8;
  const initialBoard = searchParams.get('board') || (demoStudent?.boardId || 'ALL');
  const initialSubject = searchParams.get('subject') || 'ALL';
  const initialMedium = searchParams.get('medium') || (demoStudent?.medium === 'kn' ? 'kn' : 'ALL');

  const [selectedBoard, setSelectedBoard] = useState<string>(initialBoard);
  const [selectedGrade, setSelectedGrade] = useState<number | 'ALL'>(initialGrade);
  const [selectedSubject, setSelectedSubject] = useState<string>(initialSubject);
  const [selectedMedium, setSelectedMedium] = useState<string>(initialMedium);
  const [filterMedia, setFilterMedia] = useState<'ALL' | 'VIDEO' | 'LESSON'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [boards, setBoards] = useState<EducationBoard[]>([]);
  const [topics, setTopics] = useState<TopicSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFallback, setIsFallback] = useState<boolean>(false);

  // Load Boards
  useEffect(() => {
    fetchBoards().then((res) => {
      if (res.data) setBoards(res.data);
    });
  }, []);

  // Fetch Topics from API
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    const filters: any = {};
    if (selectedBoard !== 'ALL') filters.boardId = selectedBoard;
    if (selectedGrade !== 'ALL') filters.grade = selectedGrade;
    if (selectedSubject !== 'ALL') filters.subjectId = selectedSubject;
    if (selectedMedium !== 'ALL') filters.medium = selectedMedium;

    fetchExploreTopics(filters).then((res) => {
      if (!isMounted) return;
      setTopics(res.data || []);
      setIsFallback(res.isFallback);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [selectedBoard, selectedGrade, selectedSubject, selectedMedium]);

  // Sync state to URL params
  useEffect(() => {
    const nextParams = new URLSearchParams();
    if (selectedGrade !== 'ALL') nextParams.set('grade', selectedGrade.toString());
    if (selectedBoard !== 'ALL') nextParams.set('board', selectedBoard);
    if (selectedSubject !== 'ALL') nextParams.set('subject', selectedSubject);
    if (selectedMedium !== 'ALL') nextParams.set('medium', selectedMedium);
    setSearchParams(nextParams, { replace: true });
  }, [selectedGrade, selectedBoard, selectedSubject, selectedMedium, setSearchParams]);

  // Filter topics by search query and media type
  const filteredTopics = useMemo(() => {
    return topics.filter((topic) => {
      // Medium filter
      if (selectedMedium !== 'ALL' && topic.medium?.toLowerCase() !== selectedMedium.toLowerCase()) {
        return false;
      }

      // Media filter
      if (filterMedia === 'VIDEO' && !topic.hasVideo) return false;
      if (filterMedia === 'LESSON' && !topic.hasLesson) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = topic.title.toLowerCase().includes(q);
        const matchesSummary = topic.shortDescription.toLowerCase().includes(q);
        const matchesSubject = topic.subjectName.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSummary && !matchesSubject) {
          return false;
        }
      }

      return true;
    });
  }, [topics, selectedMedium, filterMedia, searchQuery]);

  const handleResetFilters = () => {
    setSelectedBoard(demoStudent?.boardId || 'ALL');
    setSelectedGrade(demoStudent?.grade || 8);
    setSelectedSubject('ALL');
    setSelectedMedium(demoStudent?.medium === 'kn' ? 'kn' : 'ALL');
    setFilterMedia('ALL');
    setSearchQuery('');
  };

  const subjectsList = [
    { id: 'ALL', name: 'All Subjects' },
    { id: 'MATHEMATICS', name: 'Mathematics' },
    { id: 'SCIENCE', name: 'Integrated Science' },
    { id: 'PHYSICS', name: 'Physics' },
    { id: 'CHEMISTRY', name: 'Chemistry' },
    { id: 'BIOLOGY', name: 'Biology' },
    { id: 'COMPUTER_SCIENCE', name: 'Computer Science' },
    { id: 'INFORMATICS_PRACTICES', name: 'Informatics Practices' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header Banner */}
      <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-indigo-950 text-white py-10 px-4 sm:px-6 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-700/60 border border-brand-500/30 text-brand-200 text-xs font-semibold mb-3">
                <Compass className="w-3.5 h-3.5 text-brand-300" />
                <span>Explore STEM • Visual Curriculum Hub</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Concepts, Animated Videos & Lessons
              </h1>
              <p className="mt-2 text-sm sm:text-base text-brand-100/90 max-w-2xl leading-relaxed">
                Browse core STEM principles across Grades 1–12. Read original illustrated GaonLab lessons,
                watch narrated concept animations, and reference official curriculum chapters.
              </p>
            </div>

            {demoStudent && (
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-xs shrink-0 max-w-xs">
                <div className="text-brand-200 font-medium">Currently Exploring As</div>
                <div className="text-white font-bold text-sm mt-0.5">{demoStudent.name}</div>
                <div className="text-brand-200/80 mt-1 flex items-center gap-2">
                  <span>Enrolled: Class {demoStudent.grade}</span>
                  <span>•</span>
                  <span>{demoStudent.boardId === 'CBSE' ? 'CBSE' : 'KTBS'}</span>
                </div>
                <div className="text-[11px] text-emerald-300 mt-2 flex items-center gap-1 font-medium">
                  <Sparkles className="w-3 h-3" />
                  <span>Free to explore any standard 1–12 below!</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Search Input */}
          <div className="mt-6 max-w-2xl relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search concepts, topics, formulas (e.g. friction, rotation, shapes, gravity)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/95 text-slate-900 rounded-xl shadow-lg border border-white/30 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-400 text-sm font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-800 px-2 py-1 bg-slate-200/70 rounded"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        {/* Filters Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <Filter className="w-4 h-4 text-brand-600" />
              <span>Curriculum Filters</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-brand-600 transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            </div>
          </div>

          {/* Filter Controls Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Education Board Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Education Board
              </label>
              <select
                value={selectedBoard}
                onChange={(e) => setSelectedBoard(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="ALL">All Boards (CBSE & State)</option>
                {boards.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.code === 'CBSE' ? 'CBSE (NCERT)' : b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Class / Standard Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Class / Standard
              </label>
              <select
                value={selectedGrade}
                onChange={(e) =>
                  setSelectedGrade(e.target.value === 'ALL' ? 'ALL' : parseInt(e.target.value, 10))
                }
                className="w-full text-xs font-medium px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="ALL">All Standards (1 to 12)</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
                  <option key={g} value={g}>
                    Class {g} {demoStudent?.grade === g ? '⭐ (Enrolled)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {subjectsList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Medium of Instruction Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Medium / Language
              </label>
              <select
                value={selectedMedium}
                onChange={(e) => setSelectedMedium(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="ALL">All Languages</option>
                <option value="en">English (en)</option>
                <option value="kn">ಕನ್ನಡ - Kannada (kn)</option>
              </select>
            </div>

            {/* Media Type Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Content Format
              </label>
              <div className="flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setFilterMedia('ALL')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${
                    filterMedia === 'ALL'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setFilterMedia('VIDEO')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition flex items-center justify-center gap-1 ${
                    filterMedia === 'VIDEO'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Video className="w-3 h-3 text-red-500" />
                  <span>Video</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFilterMedia('LESSON')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition flex items-center justify-center gap-1 ${
                    filterMedia === 'LESSON'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <BookOpen className="w-3 h-3 text-blue-500" />
                  <span>Read</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Grade Filter Pills */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-500 font-medium shrink-0 mr-1">Quick Class:</span>
            <button
              type="button"
              onClick={() => setSelectedGrade('ALL')}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition shrink-0 ${
                selectedGrade === 'ALL'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Grades
            </button>
            {[3, 7, 8, 9, 10, 11, 12].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setSelectedGrade(g)}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition shrink-0 ${
                  selectedGrade === g
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Class {g} {g === 3 ? '(Shapes)' : g === 7 ? '(ಉಷ್ಣ / Heat)' : g === 8 ? '(Friction)' : g === 11 ? '(Rotation)' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Available STEM Topics</h2>
            <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-xs font-bold">
              {filteredTopics.length}
            </span>
          </div>

          {isFallback && (
            <span className="text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
              Demo Catalogue Cache
            </span>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-1/3 mb-4" />
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-3" />
                <div className="h-16 bg-slate-100 rounded mb-4" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredTopics.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm max-w-md mx-auto">
            <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No topics match your filters</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
              Try adjusting the Class, Subject, or search query to find more topics in the catalogue.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-lg transition"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Topic Cards Grid */}
        {!isLoading && filteredTopics.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTopics.map((topic) => {
              const pillarColor =
                topic.stemPillar === 'MATHEMATICS'
                  ? 'border-blue-200 bg-blue-50/50 text-blue-700'
                  : topic.stemPillar === 'PHYSICS'
                  ? 'border-purple-200 bg-purple-50/50 text-purple-700'
                  : topic.stemPillar === 'CHEMISTRY'
                  ? 'border-emerald-200 bg-emerald-50/50 text-emerald-700'
                  : 'border-teal-200 bg-teal-50/50 text-teal-700';

              return (
                <div
                  key={topic.topicId}
                  className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-300 transition-all flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-5">
                    {/* Header: Grade & Subject Pill */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${pillarColor}`}>
                        Class {topic.grade} • {topic.subjectName}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-slate-400 font-mono">
                          {topic.boardId === 'CBSE' ? 'CBSE/NCERT' : 'KTBS'}
                        </span>
                        {topic.medium === 'kn' && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            ಕನ್ನಡ
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Topic Title */}
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition leading-snug">
                      <Link to={`/app/explore/topics/${topic.topicId}`}>{topic.title}</Link>
                    </h3>

                    {/* Summary */}
                    <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {topic.shortDescription}
                    </p>

                    {/* Meta info: Read Time */}
                    <div className="mt-4 flex items-center gap-3 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>5 min read</span>
                      </span>
                    </div>

                    {/* Availability Badges */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {topic.hasLesson && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          <BookOpen className="w-3 h-3 text-blue-500" />
                          <span>In-App Lesson</span>
                        </span>
                      )}
                      {topic.hasVideo && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-red-50 text-red-700 border border-red-200">
                          <Video className="w-3 h-3 text-red-500" />
                          <span>Narrated Video</span>
                        </span>
                      )}
                      {topic.hasOfficialResources && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span>Official Ref</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {topic.hasVideo && (
                        <Link
                          to={`/app/explore/topics/${topic.topicId}?tab=watch`}
                          className="p-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 transition"
                          title="Watch animated video"
                        >
                          <Video className="w-4 h-4" />
                        </Link>
                      )}
                      {topic.hasLesson && (
                        <Link
                          to={`/app/explore/topics/${topic.topicId}?tab=read`}
                          className="p-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 transition"
                          title="Read original lesson"
                        >
                          <BookOpen className="w-4 h-4" />
                        </Link>
                      )}
                    </div>

                    <Link
                      to={`/app/explore/topics/${topic.topicId}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-brand-500 hover:text-brand-700 text-xs font-bold text-slate-700 shadow-sm transition group-hover:bg-brand-50"
                    >
                      <span>Explore Topic</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
