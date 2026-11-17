import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, Camera, Clock } from 'lucide-react';
import { fetchStemLensStatus } from '../services/api';
import { DemoNotice } from '../components/DemoNotice';

export const StemLensPage: React.FC = () => {
  const [statusData, setStatusData] = useState<any>(null);

  useEffect(() => {
    fetchStemLensStatus().then((res) => {
      if (res.data) setStatusData(res.data);
    });
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      <DemoNotice />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full flex-1 flex flex-col justify-center items-center text-center">
        {/* Module Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-900 text-xs font-bold mb-6 border border-blue-200 shadow-2xs">
          <Camera className="w-4 h-4 text-blue-700" />
          <span>Feature Module • Owned by Robin</span>
        </div>

        {/* Hero Icon */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-xl shadow-blue-500/25 ring-8 ring-blue-50">
            <Camera className="w-12 h-12" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-amber-400 text-amber-950 p-1.5 rounded-xl border-2 border-white shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          STEM Lens
        </h1>

        <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-xl font-medium leading-relaxed">
          STEM Lens is being developed. Your exploration experience will be available here soon.
        </p>

        {/* Architectural Context Card */}
        <div className="mt-8 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm max-w-lg w-full text-left">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Module Architecture & Integration
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
              <Clock className="w-3 h-3 text-amber-600" />
              {statusData?.status || 'INTEGRATION_PENDING'}
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Discover the science behind everyday objects. Explore the mathematics, physics, biology, and engineering hidden in your rural surroundings.
          </p>

          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
            <div>
              <span className="font-semibold text-slate-700">Module Lead:</span> Robin
            </div>
            <div>
              <span className="font-semibold text-slate-700">Route:</span>{' '}
              <code className="font-mono text-slate-800">/app/stem-lens</code>
            </div>
            <div>
              <span className="font-semibold text-slate-700">Backend API:</span>{' '}
              <code className="font-mono text-slate-800">/api/v1/stem-lens/status</code>
            </div>
            <div>
              <span className="font-semibold text-slate-700">Permissions:</span> Camera (Optional)
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <Link
            to="/app/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </main>
    </div>
  );
};
