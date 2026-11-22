'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, Edit, Save, X, Smartphone, LogOut,
  Search, Loader2, CheckCircle2, AlertCircle, Layers, Home, FileText
} from 'lucide-react';

const SPEC_FIELDS = [
  { key: 'brand', label: 'Brand', type: 'text', required: true, placeholder: 'Contoh: Vivo, Samsung, Xiaomi' },
  { key: 'model', label: 'Model', type: 'text', required: true, placeholder: 'Contoh: Reno 16F' },
  { key: 'type', label: 'Tipe/Series', type: 'text', required: true, placeholder: 'Contoh: Reno 16 Series' },
  { key: 'harga', label: 'Harga', type: 'text', required: true, placeholder: 'Contoh: Rp 7.999.000' },
  { key: 'rearCamera', label: 'Kamera Belakang', type: 'text', required: true, placeholder: 'Contoh: 50MP + 8MP' },
  { key: 'selfieCamera', label: 'Kamera Depan', type: 'text', required: true, placeholder: 'Contoh: 50MP Ultra Wide' },
  { key: 'layar', label: 'Layar', type: 'text', required: true, placeholder: 'Contoh: 6.57" AMOLED 120Hz' },
  { key: 'speaker', label: 'Speaker', type: 'text', required: false, placeholder: 'Contoh: Dual Stereo 300%' },
  { key: 'baterai', label: 'Baterai & Charging', type: 'text', required: true, placeholder: 'Contoh: 7000mAh + 80W' },
  { key: 'ramRom', label: 'RAM / ROM', type: 'text', required: true, placeholder: 'Contoh: 8GB/256GB' },
  { key: 'sertifikasi', label: 'Sertifikasi Ketahanan', type: 'text', required: false, placeholder: 'Contoh: IP68, IP69K' },
  { key: 'chipset', label: 'Chipset', type: 'text', required: true, placeholder: 'Contoh: Dimensity 7300' },
  { key: 'os', label: 'Sistem Operasi', type: 'text', required: true, placeholder: 'Contoh: ColorOS 16.1' },
  { key: 'aiFitur', label: 'Fitur AI', type: 'textarea', required: false, placeholder: 'Pisahkan dengan koma' },
  { key: 'fiturKamera', label: 'Fitur Kamera Khusus', type: 'text', required: false, placeholder: 'Contoh: POP Camera, Underwater' },
];

// Simplified fields for Naskah - only Judul and Isi Text
const NASKAH_FIELDS = [
  { key: 'model', label: 'Judul', type: 'text', required: true, placeholder: 'Contoh: Naskah Pidato' },
  { key: 'aiFitur', label: 'Isi Text', type: 'textarea', required: true, placeholder: 'Tulis isi naskah di sini...', rows: 10 },
];

function generateId(brand, model) {
  return brand.toLowerCase().replace(/\s+/g, '-') + '-' + model.toLowerCase().replace(/\s+/g, '-');
}

const INITIAL_FORM = {
  brand: '',
  model: '',
  type: '',
  harga: '',
  rearCamera: '',
  selfieCamera: '',
  layar: '',
  speaker: '',
  baterai: '',
  ramRom: '',
  sertifikasi: '',
  chipset: '',
  os: '',
  aiFitur: '',
  fiturKamera: '',
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [oppoPhones, setOppoPhones] = useState([]);
  const [compPhones, setCompPhones] = useState([]);
  const [naskahPhones, setNaskahPhones] = useState([]);
  const [activeTab, setActiveTab] = useState('oppo');
  const [showForm, setShowForm] = useState(false);
  const [editingPhone, setEditingPhone] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [showNewBrandInput, setShowNewBrandInput] = useState(false);

  // Fetch data on session change
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  const fetchData = useCallback(async () => {
    if (!session) return;
    try {
      const phonesRes = await fetch('/api/admin/phones');
      if (phonesRes.ok) {
        const data = await phonesRes.json();
        setOppoPhones(data.oppo || []);
        setCompPhones(data.competitors || []);
        setNaskahPhones(data.naskah || []);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  }, [session]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const resetForm = () => {
    if (activeTab === 'naskah') {
      setFormData({
        ...INITIAL_FORM,
        brand: 'Umum',
        type: 'Naskah',
        model: '',
        aiFitur: '',
      });
    } else {
      setFormData({
        ...INITIAL_FORM,
        brand: activeTab === 'oppo' ? 'OPPO' : '',
        os: activeTab === 'oppo' ? 'ColorOS' : '',
      });
    }
    setEditingPhone(null);
    setShowNewBrandInput(false);
    setShowForm(true);
  };

  const handleBrandChange = (e) => {
    const value = e.target.value;
    if (value === '__new__') {
      setShowNewBrandInput(true);
      setFormData({ ...formData, brand: '' });
    } else {
      setShowNewBrandInput(false);
      setFormData({ ...formData, brand: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fields = activeTab === 'naskah' ? NASKAH_FIELDS : SPEC_FIELDS;
    const missing = fields.filter(f => f.required && !formData[f.key]?.trim());
    if (missing.length) {
      showToast(`Field wajib: ${missing.map(f => f.label).join(', ')}`, 'error');
      return;
    }

    setSaving(true);
    const id = editingPhone?.id || generateId(formData.brand, formData.model);
    const phone = { ...formData, id };

    try {
      const res = await fetch('/api/admin/phones', {
        method: editingPhone ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...phone, category: activeTab }),
      });
      if (res.ok) {
        const updated = await res.json();
        if (activeTab === 'oppo') setOppoPhones(updated);
        else if (activeTab === 'competitors') setCompPhones(updated);
        else setNaskahPhones(updated);
        setShowForm(false);
        showToast(editingPhone ? 'Model diperbarui' : 'Model ditambahkan');
      } else {
        const err = await res.json();
        throw new Error(err.error || 'Gagal menyimpan');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus model ini? Tindakan tidak bisa dibatalkan.')) return;
    try {
      const res = await fetch('/api/admin/phones', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, category: activeTab }),
      });
      if (res.ok) {
        const updated = await res.json();
        if (activeTab === 'oppo') setOppoPhones(updated);
        else if (activeTab === 'competitors') setCompPhones(updated);
        else setNaskahPhones(updated);
        showToast('Model dihapus');
      }
    } catch (err) {
      showToast('Gagal hapus: ' + err.message, 'error');
    }
  };

  const handleEdit = (phone) => {
    setEditingPhone(phone);
    setFormData(phone);
    setShowForm(true);
  };

  const phones = activeTab === 'oppo' ? oppoPhones : activeTab === 'competitors' ? compPhones : naskahPhones;
  const brands = [...new Set(compPhones.map(p => p.brand))].sort();
  const naskahBrands = [...new Set(naskahPhones.map(p => p.brand))].sort();
  const oppoTypes = [...new Set(oppoPhones.map(p => p.type))].sort();
  const compTypesByBrand = (brand) => [...new Set(compPhones.filter(p => p.brand === brand).map(p => p.type))].sort();
  const naskahTypesByBrand = (brand) => [...new Set(naskahPhones.filter(p => p.brand === brand).map(p => p.type))].sort();

  const filteredPhones = phones.filter(p =>
    p.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (status === 'loading') {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="sky-gradient" aria-hidden="true" />
        <div className="water-layer" aria-hidden="true" />
        <div className="floating-orbs" aria-hidden="true" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const tabConfig = {
    oppo: { label: 'OPPO', icon: Smartphone, color: 'primary', bg: 'bg-primary/10 text-primary border-primary/30', hover: 'hover:bg-primary/20' },
    competitors: { label: 'Kompetitor', icon: Layers, color: 'secondary', bg: 'bg-secondary/10 text-secondary border-secondary/30', hover: 'hover:bg-secondary/20' },
    naskah: { label: 'Naskah', icon: FileText, color: 'accent', bg: 'bg-accent/10 text-accent border-accent/30', hover: 'hover:bg-accent/20' },
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background */}
      <div className="sky-gradient" aria-hidden="true" />
      <div className="water-layer" aria-hidden="true" />
      <div className="floating-orbs" aria-hidden="true" />

      {/* Header */}
      <header className="relative z-10 px-4 sm:px-6 lg:px-8 py-4 glass border-b border-border/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20">
              <Smartphone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">Kelola database smartphone</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="p-2 glass rounded-xl border border-border hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all"
              title="Kembali ke Halaman Utama"
            >
              <Home className="w-4 h-4" />
            </Link>
            <span className="hidden sm:block text-sm text-muted-foreground">Admin</span>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="px-3 py-2 glass rounded-xl border border-border hover:border-destructive/30 hover:text-destructive transition-all text-sm flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 glass rounded-xl p-1 border border-border/50" role="tablist">
          {Object.entries(tabConfig).map(([key, cfg]) => (
            <motion.button
              key={key}
              role="tab"
              aria-selected={activeTab === key}
              onClick={() => { setActiveTab(key); setShowForm(false); setSearchQuery(''); }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeTab === key ? cfg.bg + ' shadow-lg' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <cfg.icon className="w-4 h-4" aria-hidden="true" />
              {cfg.label}
              <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-white/10 backdrop-blur">
                {key === 'oppo' ? oppoPhones.length : compPhones.length}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Form Modal/Slide */}
        <AnimatePresence mode="wait">
          {showForm && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
              className="glass-strong rounded-2xl p-6 border border-border/50 mb-6 relative overflow-hidden"
            >
              {/* Form Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      {editingPhone ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                    {(editingPhone ? 'Edit' : 'Tambah') + ' ' + (activeTab === 'oppo' ? 'Model OPPO' : activeTab === 'competitors' ? 'Model Kompetitor' : 'Naskah')}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Isi form di bawah. Field bintang (*) wajib diisi.
                  </p>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 glass rounded-xl hover:bg-muted transition-all"
                  aria-label="Tutup form"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Phone Form */}
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeTab === 'naskah' ? (
                    // Naskah form: hanya Judul + Isi Text
                    <>
                      <motion.div
                        key="model"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: 0.05 }}
                        className="sm:col-span-2 lg:col-span-3"
                      >
                        <label className="block text-sm font-medium text-foreground mb-1.5 flex items-center gap-1">
                          Judul <span className="text-destructive" aria-hidden="true">*</span>
                        </label>
                        <input
                          type="text"
                          name="model"
                          value={formData.model || ''}
                          onChange={e => setFormData({ ...formData, model: e.target.value })}
                          required
                          placeholder="Masukkan judul naskah"
                          className="w-full px-4 py-3 glass-strong rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-muted-foreground/50"
                        />
                      </motion.div>
                      <motion.div
                        key="isi"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: 0.05 }}
                        className="sm:col-span-2 lg:col-span-3"
                      >
                        <label className="block text-sm font-medium text-foreground mb-1.5 flex items-center gap-1">
                          Isi Text <span className="text-destructive" aria-hidden="true">*</span>
                        </label>
                        <textarea
                          name="aiFitur"
                          value={formData.aiFitur || ''}
                          onChange={e => setFormData({ ...formData, aiFitur: e.target.value })}
                          required
                          rows={8}
                          placeholder="Tulis isi naskah di sini..."
                          className="w-full px-4 py-3 glass-strong rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all resize-none placeholder:text-muted-foreground/50 font-mono text-sm"
                        />
                      </motion.div>
                      {/* Hidden fields for naskah - set defaults */}
                      <input type="hidden" name="brand" value={formData.brand || 'Umum'} />
                      <input type="hidden" name="type" value={formData.type || 'Naskah'} />
                      <input type="hidden" name="harga" value="" />
                      <input type="hidden" name="rearCamera" value="" />
                      <input type="hidden" name="selfieCamera" value="" />
                      <input type="hidden" name="layar" value="" />
                      <input type="hidden" name="speaker" value="" />
                      <input type="hidden" name="baterai" value="" />
                      <input type="hidden" name="ramRom" value="" />
                      <input type="hidden" name="sertifikasi" value="" />
                      <input type="hidden" name="chipset" value="" />
                      <input type="hidden" name="os" value="" />
                      <input type="hidden" name="fiturKamera" value="" />
                    </>
                  ) : (
                    // Original phone form for OPPO & Kompetitor
                    SPEC_FIELDS.map(field => (
                      <motion.div
                        key={field.key}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: 0.05 }}
                        className={field.type === 'textarea' ? 'sm:col-span-2 lg:col-span-3' : ''}
                      >
                        <label className="block text-sm font-medium text-foreground mb-1.5 flex items-center gap-1">
                          {field.label}
                          {field.required && <span className="text-destructive" aria-hidden="true">*</span>}
                        </label>
                        {field.type === 'textarea' ? (
                          <textarea
                            name={field.key}
                            value={formData[field.key] || ''}
                            onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                            required={field.required}
                            rows={3}
                            placeholder={field.placeholder}
                            className="w-full px-4 py-3 glass-strong rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all resize-none placeholder:text-muted-foreground/50"
                          />
                        ) : field.key === 'brand' && (activeTab === 'competitors' || activeTab === 'naskah') ? (
                        // Brand dropdown for competitors
                        <div>
                          {!showNewBrandInput ? (
                            <select
                              name={field.key}
                              value={formData[field.key] || ''}
                              onChange={handleBrandChange}
                              required={field.required}
                              className="w-full px-4 py-3 glass-strong rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all cursor-pointer"
                              style={{
                                appearance: 'none',
                                WebkitAppearance: 'none',
                                MozAppearance: 'none',
                                backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 12px center',
                                backgroundColor: 'transparent',
                                paddingRight: '40px',
                              }}
                            >
                              <option value="" disabled>Pilih Kategori</option>
                              {(activeTab === 'competitors' ? brands : naskahBrands).map(b => <option key={b} value={b}>{b}</option>)}
                              <option value="__new__">+ Kategori Baru...</option>
                            </select>
                          ) : (
                            <div className="flex gap-2">
                              <input
                                type="text"
                                name={field.key}
                                value={formData[field.key] || ''}
                                onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                                required={field.required}
                                placeholder="Nama brand baru"
                                className="flex-1 px-4 py-3 glass-strong rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-muted-foreground/50"
                                autoFocus
                              />
                              <button
                                type="button"
                                onClick={() => { setShowNewBrandInput(false); setFormData({ ...formData, brand: '' }); }}
                                className="px-3 py-3 glass rounded-xl border border-border hover:bg-muted transition-all text-muted-foreground"
                                aria-label="Batal"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      ) : field.key === 'brand' && activeTab === 'oppo' ? (
                        // OPPO brand - readonly
                        <div className="relative">
                          <input
                            type="text"
                            name={field.key}
                            value="OPPO"
                            readOnly
                            className="w-full px-4 py-3 glass-strong rounded-xl border border-border bg-muted/50 text-foreground cursor-not-allowed"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">Fixed</span>
                        </div>
                      ) : (
                        <div className="relative">
                          <input
                            type="text"
                            name={field.key}
                            value={formData[field.key] || ''}
                            onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                            required={field.required}
                            placeholder={field.placeholder}
                            className="w-full px-4 py-3 glass-strong rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-muted-foreground/50"
                            list={
                              field.key === 'type' && activeTab === 'competitors' && formData.brand && formData.brand !== 'OPPO'
                                ? `${formData.brand}-types`
                                : field.key === 'type' && activeTab === 'oppo'
                                  ? 'oppo-types'
                                  : field.key === 'type' && activeTab === 'naskah' && formData.brand
                                    ? `${formData.brand}-naskah-types`
                                    : undefined
                            }
                          />
                          {field.key === 'type' && activeTab === 'competitors' && formData.brand && formData.brand !== 'OPPO' && (
                            <datalist id={`${formData.brand}-types`}>
                              {compTypesByBrand(formData.brand).map(t => <option key={t} value={t} />)}
                            </datalist>
                          )}
                          {field.key === 'type' && activeTab === 'oppo' && (
                            <datalist id="oppo-types">
                              {oppoTypes.map(t => <option key={t} value={t} />)}
                            </datalist>
                          )}
                          {field.key === 'type' && activeTab === 'naskah' && formData.brand && (
                            <datalist id={`${formData.brand}-naskah-types`}>
                              {naskahTypesByBrand(formData.brand).map(t => <option key={t} value={t} />)}
                            </datalist>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 justify-end pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-2.5 glass rounded-xl border border-border hover:bg-muted transition-all font-medium"
                  >
                    Batal
                  </button>
                  <motion.button
                    type="submit"
                    disabled={saving}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="px-6 py-2.5 glass-strong rounded-xl border border-primary/30 bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    <Loader2 className={`w-4 h-4 ${saving ? 'animate-spin' : 'hidden'}`} />
                    <Save className={`w-4 h-4 ${saving ? 'hidden' : ''}`} />
                    {saving ? 'Menyimpan...' : (editingPhone ? 'Update' : 'Simpan')}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Table Section */}
        <div className="glass-strong rounded-2xl border border-border/50 overflow-hidden flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="p-4 sm:p-6 border-b border-border/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                <input
                  type="search"
                  placeholder="Cari model, tipe, brand..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 glass-strong rounded-xl border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all text-sm placeholder:text-muted-foreground/50"
                  aria-label="Cari smartphone"
                />
              </div>
            </div>
            <motion.button
              onClick={resetForm}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2.5 glass-strong rounded-xl border border-primary/30 bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-all flex items-center gap-2 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">
                Tambah {activeTab === 'oppo' ? 'OPPO' : activeTab === 'competitors' ? 'Kompetitor' : 'Naskah'}
              </span>
            </motion.button>
          </div>

          {/* Table - Phones */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full" role="grid">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-8"></th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Model</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Tipe</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Brand</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Chipset</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden xl:table-cell">RAM/ROM</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden xl:table-cell">Baterai</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-32">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredPhones.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-4 text-muted-foreground">
                        <div className="w-16 h-16 rounded-full glass border border-border/50 flex items-center justify-center">
                          {activeTab === 'oppo' ? (
                            <Smartphone className="w-8 h-8 text-primary" />
                          ) : activeTab === 'competitors' ? (
                            <Layers className="w-8 h-8 text-secondary" />
                          ) : (
                            <FileText className="w-8 h-8 text-accent" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Belum ada data</p>
                          <p className="text-sm mt-1">Klik tombol <span className="text-primary font-semibold">Tambah</span> untuk memulai</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : activeTab === 'naskah' ? (
                  // Naskah table: Judul + Isi Text preview
                  filteredPhones.map((phone, index) => (
                    <motion.tr
                      key={phone.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.03 }}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="w-8 h-8 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                          <FileText className="w-4 h-4" />
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground max-w-xs truncate">{phone.model}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell max-w-md truncate">
                        {phone.aiFitur ? phone.aiFitur.substring(0, 100) + (phone.aiFitur.length > 100 ? '...' : '') : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell">{phone.brand || 'Umum'}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell">{phone.type || 'Naskah'}</td>
                      <td className="px-4 py-3 text-sm hidden xl:table-cell">-</td>
                      <td className="px-4 py-3 text-sm hidden xl:table-cell">-</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEdit(phone)}
                            className="p-2 glass rounded-lg hover:bg-primary/10 text-primary transition-all"
                            aria-label={`Edit ${phone.model}`}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(phone.id)}
                            className="p-2 glass rounded-lg hover:bg-destructive/10 text-destructive transition-all"
                            aria-label={`Hapus ${phone.model}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  // Phone table: OPPO & Kompetitor
                  filteredPhones.map((phone, index) => (
                    <motion.tr
                      key={phone.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.03 }}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                          {activeTab === 'oppo' ? (
                            <Smartphone className="w-4 h-4" />
                          ) : activeTab === 'competitors' ? (
                            <Layers className="w-4 h-4" />
                          ) : (
                            <FileText className="w-4 h-4" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">{phone.model}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{phone.type}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell">
                        {phone.brand && (
                          <span className="px-2 py-0.5 glass rounded-full text-xs font-medium border border-border/50">
                            {phone.brand}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell">{phone.chipset}</td>
                      <td className="px-4 py-3 text-sm hidden xl:table-cell">{phone.ramRom}</td>
                      <td className="px-4 py-3 text-sm hidden xl:table-cell">{phone.baterai}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEdit(phone)}
                            className="p-2 glass rounded-lg hover:bg-primary/10 text-primary transition-all"
                            aria-label={`Edit ${phone.model}`}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(phone.id)}
                            className="p-2 glass rounded-lg hover:bg-destructive/10 text-destructive transition-all"
                            aria-label={`Hapus ${phone.model}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Stats */}
          <div className="p-4 sm:p-6 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span className="text-sm text-muted-foreground">
              Menampilkan <span className="font-semibold text-foreground">{filteredPhones.length}</span> dari <span className="font-semibold text-foreground">{phones.length}</span> model
            </span>
            {filteredPhones.length !== phones.length && searchQuery && (
              <span className="text-xs text-accent bg-accent/10 px-2 py-1 rounded-full">
                Difilter: "{searchQuery}"
              </span>
            )}
          </div>
        </div>
      </main>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 mb-8 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Kelola database smartphone OPPO vs Kompetitor & Naskah
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Create By Muhammad Ravi Maulana
          </p>
        </motion.footer>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 glass-strong rounded-xl border p-4 shadow-2xl"
            style={{ borderColor: toast.type === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)' }}
            role="alert"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${toast.type === 'error' ? 'bg-destructive/10 text-destructive' : 'bg-green-500/10 text-green-500'}`}>
              {toast.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            </div>
            <span className="text-sm font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}