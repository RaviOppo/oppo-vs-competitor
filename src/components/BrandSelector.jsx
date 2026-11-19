'use client';

import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import React from 'react';

export default function BrandSelector({ brands, selectedBrand, onSelect, disabled }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-4 py-3.5 text-left glass-strong rounded-xl
          flex items-center justify-between gap-3
          transition-all duration-200
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/30 hover:shadow-lg'}
          focus:outline-none focus:ring-2 focus:ring-primary
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className={`
            w-10 h-10 rounded-xl flex items-center justify-center shrink-0
            ${selectedBrand ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}
          `}>
            {selectedBrand ? (
              <span className="text-sm font-semibold">{selectedBrand.charAt(0)}</span>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Brand Kompetitor</p>
            <p className={selectedBrand ? 'font-medium truncate' : 'text-muted-foreground truncate'}>
              {selectedBrand || 'Pilih brand kompetitor'}
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

      {isOpen && !disabled && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
          className="absolute top-full left-0 right-0 z-50 mt-2 glass-strong rounded-xl border shadow-xl overflow-hidden"
          role="listbox"
        >
          {brands.map((brand) => (
            <button
              key={brand}
              type="button"
              onClick={() => {
                onSelect(brand);
                setIsOpen(false);
              }}
              role="option"
              aria-selected={selectedBrand === brand}
              className={`
                w-full px-4 py-3.5 text-left flex items-center gap-3 transition-colors
                ${selectedBrand === brand ? 'bg-primary/5 text-primary' : 'hover:bg-muted/50'}
              `}
            >
              <div className={`
                w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                ${selectedBrand === brand ? 'bg-primary/10' : 'bg-muted'}
              `}>
                <span className="text-xs font-semibold">{brand.charAt(0)}</span>
              </div>
              <span className="font-medium">{brand}</span>
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