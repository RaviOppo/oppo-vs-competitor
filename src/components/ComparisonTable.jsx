'use client';

import { motion } from 'framer-motion';
import { SPEC_FIELDS } from '../types/phone';
import SpecRow from './SpecRow';

export default function ComparisonTable({ oppoPhone, competitorPhone }) {
  if (!oppoPhone || !competitorPhone) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8 text-center"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
          <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">Pilih kedua smartphone</h3>
        <p className="text-muted-foreground">Pilih model OPPO dan kompetitor untuk melihat perbandingan detail</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="grid grid-cols-3 border-b border-border">
        <div className="col-span-1 px-4 py-4 bg-muted/50">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Spesifikasi</span>
        </div>
        <div className="col-span-1 px-4 py-4 text-center bg-primary/5 border-r border-border">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">OPPO</span>
          </div>
          <p className="font-semibold text-primary">{oppoPhone.model}</p>
          <p className="text-sm text-muted-foreground">{oppoPhone.type}</p>
        </div>
        <div className="col-span-1 px-4 py-4 text-center bg-secondary/5">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="w-8 h-8 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center font-bold text-sm">{competitorPhone.brand.charAt(0)}</span>
          </div>
          <p className="font-semibold text-secondary">{competitorPhone.model}</p>
          <p className="text-sm text-muted-foreground">{competitorPhone.type}</p>
        </div>
      </div>

      {/* Spec Rows */}
      <div className="divide-y divide-border">
        {SPEC_FIELDS.map((field) => {
          const oppoValue = oppoPhone[field.key] || '-';
          const compValue = competitorPhone[field.key] || '-';
          return (
            <SpecRow
              key={field.key}
              label={field.label}
              oppoValue={oppoValue}
              competitorValue={compValue}
            />
          );
        })}
      </div>

      {/* Summary */}
      <div className="p-4 bg-muted/30 border-t border-border">
        <div className="grid grid-cols-2 gap-4">
          <div className="glass rounded-xl p-4 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Harga OPPO</p>
            <p className="font-bold text-primary text-lg">{oppoPhone.harga}</p>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Harga {competitorPhone.brand}</p>
            <p className="font-bold text-secondary text-lg">{competitorPhone.harga}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}