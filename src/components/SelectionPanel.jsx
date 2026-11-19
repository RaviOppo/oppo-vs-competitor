'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import TypeSelector from './TypeSelector';
import ModelSelector from './ModelSelector';
import BrandSelector from './BrandSelector';
import PhoneCard from './PhoneCard';

export default function SelectionPanel({ oppoPhones, compPhones, oppoTypes, compBrands }) {
  const [oppoType, setOppoType] = useState('');
  const [oppoModel, setOppoModel] = useState(null);
  const [compBrand, setCompBrand] = useState('');
  const [compModel, setCompModel] = useState(null);

  const resetAll = () => {
    setOppoType('');
    setOppoModel(null);
    setCompBrand('');
    setCompModel(null);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* OPPO Side */}
      <motion.div className="glass-strong rounded-2xl p-6 border border-border/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <span className="font-bold text-lg">OPPO</span>
          </div>
          <div>
            <h2 className="text-xl font-bold">Pilih OPPO</h2>
            <p className="text-sm text-muted-foreground">Model yang ingin dibandingkan</p>
          </div>
        </div>

        <div className="space-y-4">
          <TypeSelector
            brand="OPPO"
            types={oppoTypes}
            selectedType={oppoType}
            onSelect={setOppoType}
            disabled={!!oppoModel}
          />
          <ModelSelector
            brand="OPPO"
            phones={oppoPhones}
            type={oppoType}
            selectedModel={oppoModel}
            onSelect={setOppoModel}
            disabled={!oppoType}
            label="Model OPPO"
          />
        </div>

        <PhoneCard
          phone={oppoModel}
          label="OPPO Terpilih"
          color="primary"
          onClear={() => { setOppoModel(null); setOppoType(''); }}
        />
      </motion.div>

      {/* Competitor Side */}
      <motion.div className="glass-strong rounded-2xl p-6 border border-border/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 3 4 7l4 4" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m16 21 4-4-4-4" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 17H4" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold">Pilih Kompetitor</h2>
            <p className="text-sm text-muted-foreground">Brand → Model</p>
          </div>
        </div>

        <div className="space-y-4">
          <BrandSelector
            brands={compBrands}
            selectedBrand={compBrand}
            onSelect={(brand) => {
              setCompBrand(brand);
              setCompModel(null);
            }}
            disabled={!!compModel}
          />
          <ModelSelector
            brand={compBrand}
            phones={compPhones}
            type={null}
            selectedModel={compModel}
            onSelect={setCompModel}
            disabled={!compBrand}
            label="Model Kompetitor"
          />
        </div>

        <PhoneCard
          phone={compModel}
          label="Kompetitor Terpilih"
          color="secondary"
          onClear={() => { setCompModel(null); setCompBrand(''); }}
        />
      </motion.div>

      {/* Action Buttons */}
      <motion.div className="lg:col-span-2 mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={resetAll}
          disabled={!oppoModel && !compModel}
          className="px-6 py-3 glass rounded-xl border border-border hover:border-destructive/30 hover:text-destructive transition-all flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Reset Semua
        </button>
      </motion.div>
    </div>
  );
}