import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

interface DemoNoticeProps {
  isFallback?: boolean;
}

export const DemoNotice: React.FC<DemoNoticeProps> = ({ isFallback = false }) => {
  return (
    <div className="w-full bg-amber-50 border-y border-amber-200/80 px-4 py-2.5 text-xs text-amber-900 flex items-center justify-center gap-2">
      {isFallback ? (
        <>
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>
            <strong>Notice:</strong> Backend API is currently offline. Displaying cached demo curriculum for evaluation.
          </span>
        </>
      ) : (
        <>
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>
            <strong>Demo environment</strong> — No real student account is created. Session data is stored locally in temporary browser memory.
          </span>
        </>
      )}
    </div>
  );
};
