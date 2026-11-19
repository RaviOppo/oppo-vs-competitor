'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeftRight, RefreshCw, LogIn } from 'lucide-react';
import Link from 'next/link';
import SelectionPanel from '../components/SelectionPanel';
import ComparisonTable from '../components/ComparisonTable';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] } },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] } },
};

export default function Home() {
  const [oppoPhones, setOppoPhones] = useState([]);
  const [compPhones, setCompPhones] = useState([]);
  const [oppoTypes, setOppoTypes] = useState([]);
  const [compBrands, setCompBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selection state (lifted from SelectionPanel)
  const [oppoType, setOppoType] = useState('');
  const [oppoModel, setOppoModel] = useState(null);
  const [compBrand, setCompBrand] = useState('');
  const [compModel, setCompModel] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [oppoRes, compRes] = await Promise.all([
          fetch('/api/phones?category=oppo'),
          fetch('/api/phones?category=competitors'),
        ]);
        const oppo = await oppoRes.json();
        const comp = await compRes.json();
        setOppoPhones(oppo);
        setCompPhones(comp);
        setOppoTypes([...new Set(oppo.map(p => p.type))].sort());
        setCompBrands([...new Set(comp.map(p => p.brand))].sort());
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const resetAll = () => {
    setOppoType('');
    setOppoModel(null);
    setCompBrand('');
    setCompModel(null);
  };

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="sky-gradient" aria-hidden="true" />
        <div className="water-layer" aria-hidden="true" />
        <div className="floating-orbs" aria-hidden="true" />
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="sky-gradient" aria-hidden="true" />
      <div className="water-layer" aria-hidden="true" />
      <div className="floating-orbs" aria-hidden="true" />

      <svg
        className="fixed bottom-0 left-0 right-0 h-48 sm:h-64 z-[-1] pointer-events-none opacity-60 animate-island-breathe"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="islandGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#0D3B2A" />
            <stop offset="50%" stopColor="#14533D" />
            <stop offset="100%" stopColor="#0E4D6E" />
          </linearGradient>
        </defs>
        <path
          fill="url(#islandGradient)"
          d="M-40,200
             C100,180 200,140 300,150
             C380,158 450,130 520,140
             C580,148 640,160 720,155
             C800,150 880,130 950,135
             C1020,140 1100,155 1180,150
             C1260,145 1340,170 1440,165
             L1440,200 L-40,200 Z"
        />
        <ellipse cx="1200" cy="155" rx="80" ry="15" fill="#0D3B2A" opacity="0.5" />
        <ellipse cx="1350" cy="160" rx="50" ry="10" fill="#0D3B2A" opacity="0.4" />
        <ellipse cx="100" cy="170" rx="60" ry="12" fill="#0D3B2A" opacity="0.4" />
        <ellipse cx="1300" cy="60" rx="80" ry="80" fill="#E87A3E" opacity="0.15" />
        <ellipse cx="1300" cy="60" rx="40" ry="40" fill="#E87A3E" opacity="0.25" />
      </svg>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col">
        <motion.header
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8 sm:mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1 text-center">
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-4">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">OPPO vs Kompetitor</span>
              </motion.div>
              <motion.h1 variants={itemVariants} className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-3">
                Perbandingan Smartphone
              </motion.h1>
              <motion.p variants={itemVariants} className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                Bandingkan spesifikasi OPPO dengan kompetitor Vivo, Samsung, Xiaomi, Realme, Tecno, Infinix
              </motion.p>
            </div>
            <motion.div variants={itemVariants} style={{ transitionDelay: '200ms' }}>
              <Link
                href="/login"
                className="glass-strong rounded-xl border border-primary/30 bg-primary/5 text-primary px-5 py-2.5 font-medium hover:bg-primary/10 transition-all flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Admin Login</span>
              </Link>
            </motion.div>
          </div>
        </motion.header>

        <motion.section
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="w-full mb-8"
        >
          <SelectionPanel
            oppoPhones={oppoPhones}
            compPhones={compPhones}
            oppoTypes={oppoTypes}
            compBrands={compBrands}
            oppoType={oppoType}
            setOppoType={setOppoType}
            oppoModel={oppoModel}
            setOppoModel={setOppoModel}
            compBrand={compBrand}
            setCompBrand={setCompBrand}
            compModel={compModel}
            setCompModel={setCompModel}
            resetAll={resetAll}
          />
        </motion.section>

        <motion.section
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="w-full"
        >
          <ComparisonTable
            oppoPhone={oppoModel}
            competitorPhone={compModel}
          />
        </motion.section>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 mb-8 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Data bersifat referensi. Harga & spesifikasi dapat berubah.
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Create By Muhammad Ravi Maulana
          </p>
        </motion.footer>
      </main>
    </div>
  );
}