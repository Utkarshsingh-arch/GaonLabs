import React, { useState, useEffect } from 'react';
import { ExperimentSyncState } from '@gaonlab/shared-types';
import {
  subscribeSyncState,
  flushExperimentOutbox,
} from '../services/experimentApi';
import { getPendingCount } from '../services/experimentOfflineStorage';
import {
  CheckCircle2,
  HardDrive,
  CloudUpload,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

interface Props {
  className?: string;
}

export const SyncStatusIndicator: React.FC<Props> = ({ className = '' }) => {
  const [syncState, setSyncState] = useState<ExperimentSyncState>('SAVED_LOCAL');
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [isManualFlushing, setIsManualFlushing] = useState<boolean>(false);

  useEffect(() => {
    // Initial pending check
    getPendingCount().then((count) => {
      setPendingCount(count);
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        setSyncState(count > 0 ? 'WAITING_TO_SYNC' : 'SAVED_LOCAL');
      } else {
        setSyncState(count > 0 ? 'WAITING_TO_SYNC' : 'SYNCED');
      }
    });

    // Subscribe to outbox and network sync events
    const unsubscribe = subscribeSyncState((detail) => {
      setSyncState(detail.state);
      setPendingCount(detail.pendingCount);
    });

    return () => unsubscribe();
  }, []);

  const handleManualSync = async () => {
    setIsManualFlushing(true);
    try {
      await flushExperimentOutbox();
    } finally {
      setIsManualFlushing(false);
    }
  };

  if (syncState === 'SYNCHRONIZING' || isManualFlushing) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200 transition-all ${className}`}
        title="Sending experiment progress and observations to server"
      >
        <RefreshCw className="w-3.5 h-3.5 text-sky-600 animate-spin" />
        <span className="font-mono">Synchronizing...</span>
      </div>
    );
  }

  if (syncState === 'WAITING_TO_SYNC') {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 transition-all ${className}`}
        title="Changes saved locally; waiting to synchronize with cloud"
      >
        <div className="flex items-center gap-1.5">
          <CloudUpload className="w-3.5 h-3.5 text-amber-600" />
          <span>Waiting to sync {pendingCount > 0 ? `(${pendingCount})` : ''}</span>
        </div>
        <button
          type="button"
          onClick={handleManualSync}
          className="text-[10px] font-bold text-amber-900 bg-amber-200/70 hover:bg-amber-300 px-2 py-0.5 rounded-md transition shadow-xs"
        >
          Sync Now
        </button>
      </div>
    );
  }

  if (syncState === 'NEEDS_ATTENTION') {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-800 border border-rose-200 transition-all ${className}`}
        title="Sync paused due to connection issue. Your work is safe on this device."
      >
        <div className="flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
          <span>Needs attention</span>
        </div>
        <button
          type="button"
          onClick={handleManualSync}
          className="text-[10px] font-bold text-rose-900 bg-rose-200/70 hover:bg-rose-300 px-2 py-0.5 rounded-md transition shadow-xs"
        >
          Retry
        </button>
      </div>
    );
  }

  if (syncState === 'SAVED_LOCAL') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 transition-all ${className}`}
        title="Experiment progress is saved safely on this device"
      >
        <HardDrive className="w-3.5 h-3.5 text-slate-500" />
        <span>Saved on this device</span>
      </div>
    );
  }

  // Default: SYNCED
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 transition-all ${className}`}
      title="All experiment observations and questions are synchronized"
    >
      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
      <span>Synced</span>
    </div>
  );
};
