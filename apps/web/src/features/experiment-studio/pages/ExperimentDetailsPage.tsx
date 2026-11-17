import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ExperimentManifest } from '@gaonlab/shared-types';
import { fetchExperimentManifest, startExperimentSession } from '../services/experimentApi';
import { getDemoSession } from '../../../services/demoAuth';
import {
  ArrowLeft,
  Play,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Layers,
  Wrench,
  Clock,
} from 'lucide-react';

export const ExperimentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const session = getDemoSession();
  const medium = session?.medium || 'en';

  const [manifest, setManifest] = useState<ExperimentManifest | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState<boolean>(false);

  useEffect(() => {
    async function load() {
      if (!id) return;
      setLoading(true);
      try {
        const data = await fetchExperimentManifest(id);
        setManifest(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load experiment details');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleStartLab = async () => {
    if (!manifest) return;
    setStarting(true);
    try {
      const res = await startExperimentSession(manifest.code, {
        boardId: session?.boardId || 'CBSE',
        grade: session?.grade || manifest.gradeRange.min,
        language: medium,
      });
      navigate(`/app/experiments/${manifest.code}/lab`, {
        state: { session: res.session, manifest: res.manifest },
      });
    } catch (err: any) {
      console.warn('Fallback starting lab directly:', err);
      navigate(`/app/experiments/${manifest.code}/lab`);
    } finally {
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500">Loading laboratory specification...</p>
      </div>
    );
  }

  if (error || !manifest) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center space-y-4">
        <p className="text-sm text-rose-600 font-bold">{error || 'Experiment not found'}</p>
        <Link
          to="/app/experiments"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Catalogue</span>
        </Link>
      </div>
    );
  }

  const title =
    medium === 'kn' && manifest.titleInLanguage?.kn ? manifest.titleInLanguage.kn : manifest.title;
  const description =
    medium === 'kn' && manifest.descriptionInLanguage?.kn
      ? manifest.descriptionInLanguage.kn
      : manifest.description;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Back Link */}
      <Link
        to="/app/experiments"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Experiments Catalogue</span>
      </Link>

      {/* Main Overview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 font-mono">
              {manifest.stemPillar}
            </span>
            <span className="text-xs text-slate-400 font-mono">Code: {manifest.code}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>Estimated: 15–20 Mins</span>
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
            {title}
          </h1>
          <p className="text-sm text-slate-600 mt-3 leading-relaxed">{description}</p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleStartLab}
            disabled={starting}
            className="flex items-center gap-2.5 px-8 py-4 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-bold rounded-2xl text-sm shadow-lg shadow-brand-600/30 transition"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>{starting ? 'Initializing Lab...' : 'Begin Interactive Experiment'}</span>
          </button>
        </div>

        {/* Safety & Protocol Banner */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-emerald-950">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">Verified Scientific Environment</span>
            <p className="text-emerald-900/90 leading-relaxed text-[11px]">
              {manifest.safetyProfile.approvedProcedureNotice}
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Details: Learning Objectives & Virtual Equipment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Objectives */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <BookOpen className="w-4 h-4 text-brand-600" />
            <span>Core Learning Objectives</span>
          </div>

          <div className="space-y-2.5">
            {manifest.learningObjectives.map((obj, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{obj}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Apparatus & Materials Preview */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Wrench className="w-4 h-4 text-brand-600" />
            <span>Apparatus & Materials</span>
          </div>

          <div className="space-y-2">
            {manifest.simulation.availableApparatus.map((app) => (
              <div
                key={app.id}
                className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 flex items-center justify-between text-xs"
              >
                <span className="font-semibold text-slate-800">{app.name}</span>
                <span className="text-[10px] font-mono text-slate-400">{app.category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Curriculum Alignment Section */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <Layers className="w-4 h-4 text-brand-600" />
          <span>Curriculum Linkages</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {manifest.curriculumMappings.map((cm, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs">
              <span className="font-bold text-slate-900 block">
                {cm.boardId} • Class {cm.grade} {cm.subjectName}
              </span>
              {cm.chapterTitle && (
                <p className="text-slate-600 mt-1">
                  Chapter {cm.chapterNumber}: {cm.chapterTitle}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
