# Naskah Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add "Naskah" as a 3rd category in admin panel and homepage, mirroring the Competitors pattern exactly — same UI, same form fields, same real-time sync via polling.

**Architecture:** Extend existing phone CRUD pattern to a 3rd category `naskah`. Add Supabase table `naskah`, extend data-server.js CRUD, extend API routes (`/api/admin/phones`, `/api/phones`), add 3rd tab in admin panel, add `naskahPhones` to `usePhones` hook for homepage polling.

**Tech Stack:** Next.js 14 App Router, Supabase (PostgreSQL), NextAuth.js, Framer Motion, Tailwind CSS, lucide-react

**Spec:** This plan implements the brainstorming decision: Approach 1 (Minimal Extension)

## Global Constraints

- Reuse existing SPEC_FIELDS array exactly (no new field definitions)
- Reuse existing form/table components logic (no new UI components)
- Follow existing category pattern: `oppo` | `competitors` | `naskah`
- Homepage polling interval: 5s (existing `usePhones` behavior)
- Admin panel: single page, tabbed interface, slide-over form
- DB table naming: `naskah` (snake_case, matches `oppo_phones`, `competitor_phones`)
- ID generation: `generateId(brand, model)` (existing function)
- Toast notifications: reuse existing `showToast` pattern

## Review Focus

| Input / Condition | Expected Behavior |
|-------------------|-------------------|
| Admin adds naskah with new "brand" (kategori) | Creates new category in dropdown for future entries |
| Admin edits naskah | Updates reflect on homepage within 5s polling |
| Admin deletes naskah | Removed from homepage within 5s polling |
| Homepage loads without Supabase | Falls back gracefully (empty array, no crash) |
| Concurrent admin + homepage | Both show same data (single source of truth: Supabase) |

---

### Task 1: Add Naskah CRUD to data-server.js

**Files:**
- Modify: `src/lib/data-server.js`

**Interfaces:**
- Consumes: `getSupabaseAdmin()` from `./supabase`
- Produces: `getNaskahSync()`, `saveNaskah()`, `deleteNaskah()` — same signatures as oppo/competitor functions

- [ ] **Step 1: Add table constant and mappers**

```javascript
const TABLE_NASAKAH = 'naskah';

function mapNaskahFromDb(row) { ... }  // same fields as mapCompetitorFromDb
function mapNaskahToDb(naskah) { ... }  // same fields as mapCompetitorToDb
```

- [ ] **Step 2: Add CRUD exports**

```javascript
export async function getNaskahSync() { ... }
export async function saveNaskah(naskahArray) { ... }
export async function deleteNaskah(id) { ... }
```

- [ ] **Step 3: Verify build passes**

Run: `rtk npm run build`
Expected: PASS

---

### Task 2: Extend Admin API (/api/admin/phones) for Naskah

**Files:**
- Modify: `src/app/api/admin/phones/route.js`

**Interfaces:**
- Consumes: `getNaskahSync`, `saveNaskah`, `deleteNaskah` from `../../../../lib/data-server`
- Produces: GET/POST/PUT/DELETE handling `category === 'naskah'`

- [ ] **Step 1: Import new functions**

Add to imports: `getNaskahSync, saveNaskah, deleteNaskah`

- [ ] **Step 2: Extend GET handler**

Add `naskah` to Promise.all, return `{ oppo, competitors, naskah }`

- [ ] **Step 3: Extend POST handler**

Add `else if (category === 'naskah')` branch mirroring competitors logic

- [ ] **Step 4: Extend PUT handler**

Add `else if (category === 'naskah')` branch mirroring competitors logic

- [ ] **Step 5: Extend DELETE handler**

Add `else if (category === 'naskah')` branch mirroring competitors logic

- [ ] **Step 6: Verify build passes**

Run: `rtk npm run build`
Expected: PASS

---

### Task 3: Extend Public API (/api/phones) for Naskah

**Files:**
- Modify: `src/app/api/phones/route.js`

**Interfaces:**
- Consumes: `getSupabaseAdmin()`, `TABLE_NASAKAH`, `mapNaskahFromDb` (or inline mapper)
- Produces: GET response for `category === 'naskah'`

- [ ] **Step 1: Add table constant and mapper** (or import from data-server)

```javascript
const TABLE_NASAKAH = 'naskah';
function mapNaskahFromDb(row) { ... }
```

- [ ] **Step 2: Extend GET handler**

Add `if (category === 'naskah')` branch mirroring competitors logic (with static fallback)

- [ ] **Step 3: Verify build passes**

Run: `rtk npm run build`
Expected: PASS

---

### Task 4: Add Naskah Tab to Admin Panel

**Files:**
- Modify: `src/app/admin/page.jsx`

**Interfaces:**
- Consumes: `naskah` from API response, `fetchData` callback
- Produces: 3rd tab in `tabConfig`, `naskahPhones` state, form/table rendering for naskah

- [ ] **Step 1: Add naskah state**

```javascript
const [naskahPhones, setNaskahPhones] = useState([]);
```

- [ ] **Step 2: Extend fetchData**

Update API call handling to receive `naskah` and call `setNaskahPhones(data.naskah || [])`

- [ ] **Step 3: Add naskah to tabConfig**

```javascript
naskah: { 
  label: 'Naskah', 
  icon: FileText,  // add import
  color: 'accent', 
  bg: 'bg-accent/10 text-accent border-accent/30', 
  hover: 'hover:bg-accent/20' 
}
```

- [ ] **Step 4: Handle naskah in form logic**

- `resetForm`: set default brand='' (no fixed brand like OPPO), os=''
- `handleBrandChange`: reuse competitors logic (dropdown + new input)
- `handleSubmit`/`handleDelete`/`handleEdit`: add `else if (activeTab === 'naskah')` branches

- [ ] **Step 5: Render naskah table**

Reuse filteredPhones logic, show `model` as judul, `type` as tipe, `brand` as kategori

- [ ] **Step 6: Add FileText import**

Add `FileText` to lucide-react imports

- [ ] **Step 7: Verify build passes**

Run: `rtk npm run build`
Expected: PASS

---

### Task 5: Add Naskah to Homepage Hook (usePhones)

**Files:**
- Modify: `src/hooks/usePhones.js`

**Interfaces:**
- Consumes: `/api/phones?category=naskah` endpoint
- Produces: `naskahPhones` in return object, `naskahTypes` derived array

- [ ] **Step 1: Add naskah state**

```javascript
const [naskahPhones, setNaskahPhones] = useState([]);
```

- [ ] **Step 2: Extend fetchPhones**

Add 3rd fetch to Promise.all for `category=naskah`, call `setNaskahPhones(naskahData)`

- [ ] **Step 3: Add derived naskahTypes**

```javascript
const naskahTypes = [...new Set(naskahPhones.map(p => p.type))].sort();
```

- [ ] **Step 4: Return naskahPhones and naskahTypes**

Update return object to include both

- [ ] **Step 5: Verify build passes**

Run: `rtk npm run build`
Expected: PASS

---

### Task 6: (Optional) Homepage UI for Naskah

**Files:**
- Modify: `src/app/page.jsx` or components

**Note:** Only if you want Naskah visible on homepage. If Naskah is admin-only, skip this task.

- [ ] **Step 1: Consume naskahPhones from usePhones**
- [ ] **Step 2: Add UI section** (e.g., SelectionPanel for Naskah, or separate display)
- [ ] **Step 3: Verify build passes**

Run: `rtk npm run build`
Expected: PASS

---

### Task 7: Supabase Migration (Manual)

**Action Required:** Run this SQL in Supabase SQL Editor

```sql
CREATE TABLE naskah (
  id TEXT PRIMARY KEY,
  brand TEXT,
  model TEXT NOT NULL,
  type TEXT,
  harga TEXT,
  rear_camera TEXT,
  selfie_camera TEXT,
  layar TEXT,
  speaker TEXT,
  baterai TEXT,
  ram_rom TEXT,
  sertifikasi TEXT,
  chipset TEXT,
  os TEXT,
  ai_fitur TEXT,
  fitur_kamera TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_naskah_brand ON naskah(brand);
CREATE INDEX idx_naskah_model ON naskah(model);
```

- [ ] **Step 1: Execute SQL in Supabase dashboard**
- [ ] **Step 2: Verify table appears in Table Editor**

---

## Execution Order

Tasks 1-3 (backend) → Task 4 (admin UI) → Task 5 (homepage hook) → Task 7 (DB) → Task 6 (optional homepage UI)

Each task is independently testable via `rtk npm run build` and manual browser testing.