'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const colorClasses = {
  primary: 'bg-primary/10 text-primary border-primary/20',
  secondary: 'bg-secondary/10 text-secondary border-secondary/20',
  accent: 'bg-accent/10 text-accent border-accent/20',
};

export default function PhoneCard({ phone, label, color, onClear }) {
  if (!phone) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      className={`glass-strong rounded-2xl p-4 border ${colorClasses[color]} relative`}
    >
      <button
        onClick={onClear}
        className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-muted/50 hover:bg-muted text-muted-foreground transition-colors flex items-center justify-center"
        aria-label="Hapus pilihan"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3 mb-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colorClasses[color].replace('border-', '').replace('/10', '/20')}`}>
          <span className="text-xl font-bold">{phone.brand.charAt(0)}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wider mb-1">{label}</p>
          <p className="font-semibold truncate">{phone.model}</p>
          <p className="text-sm text-muted-foreground truncate">{phone.type}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="glass rounded-lg p-2">
          <p className="text-muted-foreground">Harga</p>
          <p className="font-medium truncate">{phone.harga}</p>
        </div>
        <div className="glass rounded-lg p-2">
          <p className="text-muted-foreground">Chipset</p>
          <p className="font-medium truncate">{phone.chipset}</p>
        </div>
        <div className="glass rounded-lg p-2">
          <p className="text-muted-foreground">RAM/ROM</p>
          <p className="font-medium truncate">{phone.ramRom}</p>
        </div>
        <div className="glass rounded-lg p-2">
          <p className="text-muted-foreground">Baterai</p>
          <p className="font-medium truncate">{phone.baterai}</p>
        </div>
      </div>
    </motion.div>
  );
}