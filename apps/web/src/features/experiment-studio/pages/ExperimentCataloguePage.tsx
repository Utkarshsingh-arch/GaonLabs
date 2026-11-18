import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExperimentSummary } from '@gaonlab/shared-types';
import { fetchExperiments } from '../services/experimentApi';
import { getDemoSession } from '../../../services/demoAuth';
import {
  FlaskConical,
  Filter,
  WifiOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Atom,
} from 'lucide-react';

export const ExperimentCataloguePage: React.FC = () => {
  const navigate = useNavigate();
  const session = getDemoSession();
  const studentBoard = session?.boardId || 'CBSE';
  const studentGrade = session?.grade || 7;
  const medium = session?.medium || 'en';

  const [experiments, setExperiments] = useState<ExperimentSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedBoard, setSelectedBoard] = useState<string>(studentBoard);
  const [selectedGrade, setSelectedGrade] = useState<string>(studentGrade.toString());
  const [selectedPillar, setSelectedPillar] = useState<string>('ALL');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const filters: any = {};
        if (selectedBoard !== 'ALL') filters.boardId = selectedBoard;
        if (selectedGrade !== 'ALL') filters.grade = parseInt(selectedGrade, 10);
        if (selectedPillar !== 'ALL') filters.subjectId = selectedPillar;

        const data = await fetchExperiments(filters);
        setExperiments(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load experiments catalogue');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [selectedBoard, selectedGrade, selectedPillar]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-brand-900 via-brand-800 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-brand-200 text-xs font-semibold">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>GaonLab Experiment Studio</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {medium === 'kn' ? 'ಪ್ರಯೋಗ ಶಾಲೆ — ವರ್ಚುವಲ್ ಲ್ಯಾಬ್' : 'Experiential STEM Virtual Laboratory'}
          </h1>

          <p className="text-sm text-brand-100 leading-relaxed">
            {medium === 'kn'
              ? 'ಕೇವಲ ಸಿದ್ಧಾಂತ ಓದುವುದಲ್ಲದೆ, ಪರೀಕ್ಷಿಸಿ, ಊಹಿಸಿ ಮತ್ತು ನೈಜ ವೈಜ್ಞಾನಿಕ ಸಿಮ್ಯುಲೇಶನ್‌ಗಳೊಂದಿಗೆ ಅನ್ವೇಷಿಸಿ.'
              : 'Formulate hypotheses, manipulate virtual apparatus, observe authentic physical interactions, and apply scientific laws to solve everyday rural problems.'}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-brand-200 font-mono">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Safe Verified Materials
            </span>
            <span className="flex items-center gap-1.5">
              <WifiOff className="w-4 h-4 text-amber-300" /> Offline Capable
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-300" /> 7-Phase Inquiry Lifecycle
            </span>
          </div>
        </div>

        {/* Background Visual Flair */}
        <div className="absolute right-6 -bottom-8 opacity-10 pointer-events-none hidden md:block">
          <Atom className="w-72 h-72 text-white" />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Filter className="w-4 h-4 text-brand-600" />
          <span>Curriculum Filters:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Board Filter */}
          <div className="flex items-center gap-1.5">
            <label className="text-slate-500 font-medium">Board:</label>
            <select
              value={selectedBoard}
              onChange={(e) => setSelectedBoard(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="ALL">All Boards</option>
              <option value="CBSE">CBSE</option>
              <option value="KARNATAKA_STATE_BOARD">Karnataka State Board</option>
            </select>
          </div>

          {/* Grade Filter */}
          <div className="flex items-center gap-1.5">
            <label className="text-slate-500 font-medium">Class:</label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="ALL">All Classes</option>
              <option value="7">Class 7</option>
              <option value="8">Class 8</option>
              <option value="11">Class 11 (Senior)</option>
            </select>
          </div>

          {/* STEM Pillar Filter */}
          <div className="flex items-center gap-1.5">
            <label className="text-slate-500 font-medium">Pillar:</label>
            <select
              value={selectedPillar}
              onChange={(e) => setSelectedPillar(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="ALL">All STEM</option>
              <option value="CHEMISTRY">Chemistry</option>
              <option value="PHYSICS">Physics</option>
            </select>
          </div>
        </div>
      </div>

      {/* Experiments Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500">Loading virtual experiments catalogue...</p>
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center text-rose-800 text-xs">
          {error}
        </div>
      ) : experiments.length === 0 ? (
        <div className="bg-slate-50 border border-dashed border-slate-300 rounded-3xl p-12 text-center text-slate-500">
          <FlaskConical className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-700">No experiments found for this filter.</p>
          <p className="text-xs text-slate-400 mt-1">Try selecting "All Boards" or "All Classes".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiments.map((exp) => {
            const isPhysics = exp.stemPillar === 'PHYSICS';
            const isChemistry = exp.stemPillar === 'CHEMISTRY';

            const title =
              medium === 'kn' && exp.titleInLanguage?.kn ? exp.titleInLanguage.kn : exp.title;

            return (
              <div
                key={exp.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-300 transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-6 space-y-4">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full font-mono ${
                        isChemistry
                          ? 'bg-amber-100 text-amber-800'
                          : isPhysics
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {exp.stemPillar}
                    </span>

                    <span className="text-[10px] text-slate-400 font-mono">
                      Class {exp.minGrade}
                      {exp.maxGrade !== exp.minGrade && `–${exp.maxGrade}`}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-slate-900 group-hover:text-brand-600 transition leading-snug">
                      {title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                      {exp.shortDescription}
                    </p>
                  </div>

                  {/* Curriculum Alignment Tags */}
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {exp.curriculumMappings.map((cm, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600"
                      >
                        {cm.boardId} Ch {cm.chapterNumber || cm.grade}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer / Action */}
                <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500 font-mono">
                    {exp.simulationType.replace(/_/g, ' ')}
                  </span>

                  <button
                    type="button"
                    onClick={() => navigate(`/app/experiments/${exp.code}`)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-600 group-hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                  >
                    <span>Open Lab</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
