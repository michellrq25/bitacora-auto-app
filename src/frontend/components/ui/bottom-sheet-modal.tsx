'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface BottomSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function BottomSheetModal({
  isOpen,
  onClose,
  title,
  children,
}: BottomSheetModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm transition-opacity sm:items-center p-0 sm:p-4">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal / Sheet container */}
      <div className="relative z-10 w-full max-w-lg rounded-t-3xl sm:rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl transition-transform max-h-[90vh] overflow-y-auto">
        {/* Grab bar on mobile */}
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-700 sm:hidden" />

        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
