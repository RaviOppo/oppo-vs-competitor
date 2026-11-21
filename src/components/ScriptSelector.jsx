'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ChevronDown, ChevronUp, Eye, Copy, Check, X } from 'lucide-react';

export default function ScriptSelector({ scripts = [], onSelect }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedScript, setSelectedScript] = useState(null);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelect = (script) => {
    setSelectedScript(script);
    onSelect?.(script);
  };

  const handleClose = () => {
    setSelectedScript(null);
    onSelect?.(null);
  };

  if (scripts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-4 border border-border/50"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent" />
            <span className="font-semibold text-foreground">Naskah</span>
            <span className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded-full">Belum ada naskah</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">Tambah naskah di panel admin untuk muncul di sini</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl border border-border/50 overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-accent" />
          <span className="font-semibold text-foreground">Naskah</span>
          <span className="px-2 py-0.5 text-xs bg-accent/10 text-accent rounded-full">{scripts.length} tersedia</span>
        </div>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-muted-foreground"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border/50 overflow-hidden"
          >
            {/* Script List */}
            <div className="max-h-64 overflow-y-auto divide-y divide-border/50 p-2">
              {scripts.map((script, index) => (
                <motion.div
                  key={script.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  className={`p-3 rounded-xl transition-colors cursor-pointer ${
                    selectedScript?.id === script.id
                      ? 'bg-accent/10 border border-accent/30'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => handleSelect(script)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground mb-1 truncate">{script.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">{script.content}</p>
                    </div>
                    <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                      {selectedScript?.id === script.id && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="px-2 py-0.5 text-xs bg-accent/20 text-accent rounded-full"
                        >
                          Dipilih
                        </motion.span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Selected Script Preview */}
            {selectedScript && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="border-t border-accent/20 bg-accent/5 p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-accent" />
                    <span className="font-semibold text-accent">{selectedScript.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      onClick={() => copyToClipboard(selectedScript.content)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 glass rounded-lg hover:bg-accent/20 text-accent transition-all"
                      aria-label="Salin naskah"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </motion.button>
                    <motion.button
                      onClick={handleClose}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 glass rounded-lg hover:bg-muted text-muted-foreground transition-all"
                      aria-label="Tutup naskah"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
                <div className="max-h-48 overflow-y-auto p-3 glass rounded-lg bg-background/50">
                  <pre className="whitespace-pre-wrap text-sm text-foreground font-sans leading-relaxed">{selectedScript.content}</pre>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}