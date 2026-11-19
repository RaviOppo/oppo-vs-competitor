'use client';

import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import React from 'react';

export default function TypeSelector({ brand, types, selectedType, onSelect, disabled }) {
  const [isOpen, setIsOpen] = React.useState(false);

  if (types.length === 0) {
    return (
      <div className="w-full px-4 py-3.5 glass rounded-xl border border-border text-muted-foreground">
        Tidak ada tipe untuk brand ini
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled || types.length === 0}
        className={`
          w-full px-4 py-3.5 text-left glass-strong rounded-xl
          flex items-center justify-between gap-3
          transition-all duration-200
          ${disabled || types.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/30 hover:shadow-lg'}
          focus:outline-none focus:ring-2 focus:ring-primary
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className={`
            w-10 h-10 rounded-xl flex items-center justify-center shrink-0
            ${selectedType ? 'bg-secondary/10 text-secondary' : 'bg-muted text-muted-foreground'}
          `}>
            {selectedType ? (
              <span className="text-xs font-semibold">{selectedType.charAt(0)}</span>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Tipe / Series</p>
            <p className={selectedType ? 'font-medium truncate' : 'text-muted-foreground truncate'}>
              {selectedType || 'Pilih tipe/series'}
            </p>
          </div>
        </div>
        <ChevronDown
          className={`
            w-5 h-5 text-muted-foreground transition-transform duration-200 shrink-0
            ${isOpen ? 'rotate-180' : ''}
          `}
        />
      </button>

      {isOpen && !disabled && types.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
          className="absolute top-full left-0 right-0 z-50 mt-2 glass-strong rounded-xl border shadow-xl overflow-hidden"
          role="listbox"
        >
          {types.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                onSelect(type);
                setIsOpen(false);
              }}
              role="option"
              aria-selected={selectedType === type}
              className={`
                w-full px-4 py-3.5 text-left flex items-center gap-3 transition-colors
                ${selectedType === type ? 'bg-secondary/5 text-secondary' : 'hover:bg-muted/50'}
              `}
            >
              <div className={`
                w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                ${selectedType === type ? 'bg-secondary/10' : 'bg-muted'}
              `}>
                <span className="text-xs font-semibold">{type.charAt(0)}</span>
              </div>
              <span className="font-medium">{type}</span>
            </button>
          ))}
        </motion.div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}