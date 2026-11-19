'use client';

import { ChevronDown, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';
import React from 'react';

export default function ModelSelector({ brand, phones, type, selectedModel, onSelect, disabled, label }) {
  const [isOpen, setIsOpen] = React.useState(false);

  let models = [];
  if (brand === 'OPPO') {
    models = phones.filter(p => p.type === type);
  } else if (type) {
    models = phones.filter(p => p.brand === brand && p.type === type);
  } else {
    models = phones.filter(p => p.brand === brand);
  }

  if (models.length === 0) {
    return (
      <div className="w-full px-4 py-3.5 glass rounded-xl border border-border text-muted-foreground">
        Tidak ada model untuk tipe ini
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled || models.length === 0}
        className={`
          w-full px-4 py-3.5 text-left glass-strong rounded-xl
          flex items-center justify-between gap-3
          transition-all duration-200
          ${disabled || models.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/30 hover:shadow-lg'}
          focus:outline-none focus:ring-2 focus:ring-primary
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className={`
            w-10 h-10 rounded-xl flex items-center justify-center shrink-0
            ${selectedModel ? 'bg-accent/10 text-accent' : 'bg-muted text-muted-foreground'}
          `}>
            {selectedModel ? (
              <Smartphone className="w-5 h-5" />
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
            <p className={selectedModel ? 'font-medium truncate' : 'text-muted-foreground truncate'}>
              {selectedModel?.model || 'Pilih model'}
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

      {isOpen && !disabled && models.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
          className="absolute top-full left-0 right-0 z-50 mt-2 glass-strong rounded-xl border shadow-xl overflow-hidden max-h-64 overflow-y-auto"
          role="listbox"
        >
          {models.map((model) => (
            <button
              key={model.id}
              type="button"
              onClick={() => {
                onSelect(model);
                setIsOpen(false);
              }}
              role="option"
              aria-selected={selectedModel?.id === model.id}
              className={`
                w-full px-4 py-3.5 text-left flex items-center gap-3 transition-colors
                ${selectedModel?.id === model.id ? 'bg-accent/5 text-accent' : 'hover:bg-muted/50'}
              `}
            >
              <div className={`
                w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                ${selectedModel?.id === model.id ? 'bg-accent/10' : 'bg-muted'}
              `}>
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="font-medium truncate block">{model.model}</span>
                <span className="text-xs text-muted-foreground truncate block">{model.harga}</span>
              </div>
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