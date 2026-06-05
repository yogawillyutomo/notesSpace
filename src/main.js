import './style.css';

const STORAGE_KEY = 'notespace_notes';
const SEED_VERSION_KEY = 'notespace_seed_version';
const SEED_VERSION = 'school-v1';

const categories = ['Semua', 'Project', 'Belajar', 'Ide Konten', 'Pribadi', 'Database', 'Frontend'];
const formCategories = ['Project', 'Belajar', 'Ide Konten', 'Pribadi', 'Database', 'Frontend'];
const oldSeedTitles = [
  'Struktur awal aplikasi Notes',
  'Catatan Express.js',
  'Fitur antimainstream',
  'Target Mingguan',
  'Relasi kategori dan notes',
  'Komponen halaman',
];

let notes = [];
let activeCategory = 'Semua';
let searchQuery = '';
let editingNoteId = null;

function createSeedNote({ title, category, content, tags, pinned = false, hoursAgo }) {
  const date = new Date(Date.now() - 1000 * 60 * 60 * hoursAgo).toISOString();

  return {
    id: crypto.randomUUID(),
    title,
    category,
    content,
    tags,
    pinned,
    createdAt: date,
    updatedAt: date,
  };
}

function createSchoolSeedNotes() {
  return [
    createSeedNote({
      title: 'Prioritas minggu ini',
      category: 'Pribadi',
      content:
        'Selesaikan tugas Matematika, baca ulang materi IPA tentang ekosistem, dan siapkan bahan presentasi Sejarah sebelum Jumat.',
      tags: ['jadwal', 'mingguan', 'prioritas'],
      pinned: true,
      hoursAgo: 5,
    }),
    createSeedNote({
      title: 'Tugas Matematika: statistika',
      category: 'Belajar',
      content:
        'Kerjakan latihan mean, median, modus, dan jangkauan. Cek kembali langkah perhitungan sebelum dikumpulkan.',
      tags: ['matematika', 'statistika'],
      pinned: true,
      hoursAgo: 12,
    }),
    createSeedNote({
      title: 'Presentasi Sejarah Indonesia',
      category: 'Project',
      content:
        'Buat slide tentang peristiwa proklamasi, tokoh penting, latar belakang, dan dampaknya bagi kehidupan masyarakat Indonesia.',
      tags: ['sejarah', 'presentasi'],
      hoursAgo: 22,
    }),
    createSeedNote({
      title: 'Rangkuman IPA: ekosistem',
      category: 'Belajar',
      content:
        'Catat pengertian ekosistem, komponen biotik dan abiotik, rantai makanan, jaring-jaring makanan, serta contoh di lingkungan sekolah.',
      tags: ['ipa', 'rangkuman'],
      hoursAgo: 36,
    }),
    createSeedNote({
      title: 'Ide poster literasi kelas',
      category: 'Ide Konten',
      content:
        'Poster bertema membaca 15 menit sebelum pelajaran. Pakai warna cerah, satu kalimat ajakan, dan ilustrasi buku yang sederhana.',
      tags: ['poster', 'literasi', 'desain'],
      hoursAgo: 48,
    }),
    createSeedNote({
      title: 'Data nilai dan kategori tugas',
      category: 'Database',
      content:
        'Buat contoh tabel sederhana: siswa, mata_pelajaran, tugas, dan nilai. Setiap nilai terhubung ke satu siswa dan satu tugas.',
      tags: ['database', 'nilai'],
      hoursAgo: 62,
    }),
    createSeedNote({
      title: 'Landing page profil kelas',
      category: 'Frontend',
      content:
        'Buat halaman sederhana berisi nama kelas, wali kelas, daftar piket, jadwal pelajaran, dan galeri kegiatan sekolah.',
      tags: ['html', 'tailwind', 'kelas'],
      hoursAgo: 76,
    }),
  ];
}

const app = document.querySelector('#app');

app.innerHTML = `
  <main class="relative min-h-screen overflow-hidden px-4 py-5 sm:px-6 lg:px-8">
    <div class="pointer-events-none absolute left-[-8rem] top-[-10rem] h-80 w-80 rounded-full bg-violet-600/30 blur-3xl"></div>
    <div class="pointer-events-none absolute bottom-10 right-[-9rem] h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl"></div>
    <div class="pointer-events-none absolute bottom-[-12rem] left-1/3 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl"></div>

    <section class="relative mx-auto max-w-[1200px]">
      <header class="mb-10 flex items-center justify-between gap-4 rounded-[2rem] border border-white/10 bg-slate-950/40 p-3 backdrop-blur-xl">
        <div class="flex min-w-0 items-center gap-3">
          <div class="grid h-14 w-14 shrink-0 place-items-center rounded-3xl bg-gradient-to-br from-violet-500 to-cyan-300 text-2xl font-black text-white shadow-cyan">N</div>
          <div class="min-w-0">
            <h1 class="truncate text-xl font-black text-white sm:text-2xl">NoteSpace</h1>
            <p class="text-sm font-medium text-slate-400">Ruang rapi untuk tugas dan ide sekolah</p>
          </div>
        </div>
        <button id="mobileMenuButton" class="icon-button md:hidden" aria-label="Buka menu">Menu</button>
        <nav class="hidden items-center gap-2 md:flex">
          <button class="rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/20" data-action="scroll-notes">Lihat Catatan</button>
          <button class="rounded-full bg-gradient-to-r from-violet-500 to-cyan-300 px-5 py-3 text-sm font-black text-white shadow-cyan transition hover:-translate-y-0.5" data-action="new-note">Buat Catatan</button>
        </nav>
      </header>

      <div id="mobileMenu" class="mb-6 hidden rounded-[2rem] border border-white/10 bg-slate-950/70 p-4 backdrop-blur-xl md:hidden">
        <div class="flex flex-col gap-3">
          <button class="rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm font-bold text-white" data-action="scroll-notes">Lihat Catatan</button>
          <button class="rounded-full bg-gradient-to-r from-violet-500 to-cyan-300 px-5 py-3 text-sm font-black text-white" data-action="new-note">Buat Catatan</button>
        </div>
      </div>

      <section class="mb-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div class="py-2 sm:py-6">
          <p class="mb-4 text-sm font-bold uppercase text-cyan-200/90">Halo, siap lanjut hari ini?</p>
          <h2 class="max-w-3xl text-4xl font-black leading-tight text-white sm:text-6xl lg:text-7xl">
            Atur tugas, rangkuman, dan ide dengan cara yang
            <span class="bg-gradient-to-r from-violet-300 to-cyan-200 bg-clip-text text-transparent">lebih tenang</span>
          </h2>
          <p class="mt-5 max-w-2xl text-base leading-7 text-slate-400">
            Simpan catatan sekolah, rencana project, dan pengingat penting dalam satu dashboard yang mudah dipantau.
          </p>
          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <label class="relative min-w-0 flex-1">
              <span class="sr-only">Cari catatan</span>
              <span class="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate-500">Search</span>
              <input id="searchInput" class="field pl-20" type="search" placeholder="Cari tugas, materi, atau isi catatan..." autocomplete="off" />
            </label>
            <button class="rounded-3xl bg-gradient-to-r from-violet-500 to-cyan-300 px-7 py-4 text-sm font-black text-white shadow-cyan transition hover:-translate-y-0.5 sm:min-w-40" data-action="new-note">Buat Catatan</button>
          </div>
        </div>

        <aside id="focusCard" class="glass-panel rounded-[2rem] p-6 sm:p-8"></aside>
      </section>

      <section class="mb-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div class="glass-panel rounded-[2rem] p-6">
          <div class="mb-6 flex items-center justify-between gap-4">
            <div>
              <p class="text-xs font-black uppercase text-violet-200/80">Ringkasan</p>
              <h2 class="mt-1 text-2xl font-black text-white">Statistik Catatan</h2>
            </div>
            <span class="rounded-full border border-cyan-200/20 bg-cyan-300/10 px-4 py-2 text-xs font-bold text-cyan-100">Tersimpan otomatis</span>
          </div>
          <div id="statsGrid" class="grid grid-cols-2 gap-3"></div>
        </div>

        <div class="glass-panel rounded-[2rem] p-6">
          <div class="mb-5 flex items-center justify-between gap-3">
            <div>
              <p class="text-xs font-black uppercase text-cyan-200/80">Kategori</p>
              <h2 class="mt-1 text-2xl font-black text-white">Pilih fokus catatan</h2>
            </div>
          </div>
          <div id="categoryFilters" class="flex gap-3 overflow-x-auto pb-2"></div>
        </div>
      </section>

      <section id="notesArea" class="pb-14">
        <div class="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p class="text-sm font-bold uppercase text-slate-400">Catatan tersimpan</p>
            <h2 id="notesHeading" class="mt-1 text-3xl font-black text-white">Semua Catatan</h2>
          </div>
          <p id="resultInfo" class="text-sm font-semibold text-slate-400"></p>
        </div>
        <div id="notesGrid" class="grid gap-5 md:grid-cols-2"></div>
      </section>
    </section>
  </main>

  <section id="noteModal" class="modal-shell" aria-hidden="true">
    <div class="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-slate-950/95 p-5 shadow-glow sm:p-7">
      <div class="mb-6 flex items-center justify-between gap-4">
        <div>
          <p class="text-xs font-black uppercase text-cyan-200/80">NoteSpace</p>
          <h2 id="modalTitle" class="mt-1 text-3xl font-black text-white">Tambah Catatan</h2>
        </div>
        <button class="icon-button" data-action="close-note-modal" type="button" aria-label="Tutup modal">Tutup</button>
      </div>
      <form id="noteForm" class="space-y-4">
        <input id="titleInput" class="field" type="text" placeholder="Contoh: Tugas Biologi Bab Ekosistem" />
        <textarea id="contentInput" class="field min-h-40 resize-y" placeholder="Tulis isi catatan, langkah pengerjaan, atau poin penting di sini."></textarea>
        <div class="grid gap-4 sm:grid-cols-2">
          <select id="categoryInput" class="field"></select>
          <input id="tagsInput" class="field" type="text" placeholder="Tags: ipa, tugas, minggu-ini" />
        </div>
        <label class="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-bold text-slate-200">
          <input id="pinnedInput" class="h-5 w-5 accent-violet-500" type="checkbox" />
          Jadikan prioritas
        </label>
        <div class="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <button class="rounded-3xl border border-white/10 bg-white/10 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/20" data-action="close-note-modal" type="button">Batal</button>
          <button class="rounded-3xl bg-gradient-to-r from-violet-500 to-cyan-300 px-7 py-3 text-sm font-black text-white shadow-cyan transition hover:-translate-y-0.5" type="submit">Simpan Catatan</button>
        </div>
      </form>
    </div>
  </section>

  <section id="detailModal" class="modal-shell" aria-hidden="true">
    <div id="detailContent" class="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-slate-950/95 p-5 shadow-glow sm:p-8"></div>
  </section>
`;

const elements = {
  mobileMenuButton: document.querySelector('#mobileMenuButton'),
  mobileMenu: document.querySelector('#mobileMenu'),
  focusCard: document.querySelector('#focusCard'),
  statsGrid: document.querySelector('#statsGrid'),
  categoryFilters: document.querySelector('#categoryFilters'),
  searchInput: document.querySelector('#searchInput'),
  notesGrid: document.querySelector('#notesGrid'),
  notesHeading: document.querySelector('#notesHeading'),
  resultInfo: document.querySelector('#resultInfo'),
  noteModal: document.querySelector('#noteModal'),
  detailModal: document.querySelector('#detailModal'),
  detailContent: document.querySelector('#detailContent'),
  noteForm: document.querySelector('#noteForm'),
  modalTitle: document.querySelector('#modalTitle'),
  titleInput: document.querySelector('#titleInput'),
  contentInput: document.querySelector('#contentInput'),
  categoryInput: document.querySelector('#categoryInput'),
  tagsInput: document.querySelector('#tagsInput'),
  pinnedInput: document.querySelector('#pinnedInput'),
};

function loadNotes() {
  const savedNotes = localStorage.getItem(STORAGE_KEY);
  const seedVersion = localStorage.getItem(SEED_VERSION_KEY);

  if (!savedNotes) {
    notes = createSchoolSeedNotes();
    saveNotes();
    localStorage.setItem(SEED_VERSION_KEY, SEED_VERSION);
    return;
  }

  try {
    const parsedNotes = JSON.parse(savedNotes);

    if (seedVersion !== SEED_VERSION) {
      notes = migrateToSchoolSeed(parsedNotes);
      saveNotes();
      localStorage.setItem(SEED_VERSION_KEY, SEED_VERSION);
      return;
    }

    notes = parsedNotes;
  } catch {
    notes = createSchoolSeedNotes();
    saveNotes();
    localStorage.setItem(SEED_VERSION_KEY, SEED_VERSION);
  }
}

function migrateToSchoolSeed(savedNotes) {
  const hasCustomNotes = savedNotes.some((note) => !oldSeedTitles.includes(note.title));

  if (!hasCustomNotes) {
    return createSchoolSeedNotes();
  }

  const existingTitles = new Set(savedNotes.map((note) => note.title));
  const missingSchoolNotes = createSchoolSeedNotes().filter((note) => !existingTitles.has(note.title));
  return [...missingSchoolNotes, ...savedNotes];
}

function saveNotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString));
}

function getReadTime(content) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 180))} menit baca`;
}

function getSortedNotes(noteList) {
  return [...noteList].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
}

function getFilteredNotes() {
  return getSortedNotes(notes).filter((note) => {
    const matchesCategory = activeCategory === 'Semua' || note.category === activeCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });
}

function getUniqueCategoryCount() {
  return new Set(notes.map((note) => note.category)).size;
}

function getThisWeekCount() {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  return notes.filter((note) => new Date(note.createdAt) >= startOfWeek).length;
}

function getCategoryTone(category) {
  const tones = {
    Project: {
      card: 'border-yellow-200/80 bg-yellow-300 text-slate-950',
      badge: 'bg-slate-950 text-yellow-100',
      muted: 'text-slate-800',
      button: 'border-slate-950/10 bg-slate-950/10 text-slate-950 hover:bg-slate-950/20',
      footer: 'text-slate-800',
    },
    Database: {
      card: 'border-cyan-100/80 bg-cyan-300 text-slate-950',
      badge: 'bg-slate-950 text-cyan-100',
      muted: 'text-slate-800',
      button: 'border-slate-950/10 bg-slate-950/10 text-slate-950 hover:bg-slate-950/20',
      footer: 'text-slate-800',
    },
    'Ide Konten': {
      card: 'border-violet-300/30 bg-violet-950/80 text-white',
      badge: 'bg-violet-300 text-violet-950',
      muted: 'text-violet-100/75',
      button: 'border-white/10 bg-white/10 text-white hover:bg-white/20',
      footer: 'text-violet-100/70',
    },
    Belajar: {
      card: 'border-cyan-200/20 bg-slate-950/85 text-white backdrop-blur-xl',
      badge: 'bg-cyan-300 text-slate-950',
      muted: 'text-slate-300',
      button: 'border-white/10 bg-white/10 text-white hover:bg-white/20',
      footer: 'text-slate-400',
    },
    Pribadi: {
      card: 'border-emerald-200/20 bg-[#071827]/90 text-white backdrop-blur-xl',
      badge: 'bg-emerald-300 text-emerald-950',
      muted: 'text-slate-300',
      button: 'border-white/10 bg-white/10 text-white hover:bg-white/20',
      footer: 'text-slate-400',
    },
    Frontend: {
      card: 'border-blue-200/20 bg-[#07111f]/90 text-white backdrop-blur-xl',
      badge: 'bg-blue-300 text-blue-950',
      muted: 'text-slate-300',
      button: 'border-white/10 bg-white/10 text-white hover:bg-white/20',
      footer: 'text-slate-400',
    },
  };

  return (
    tones[category] || {
      card: 'border-white/10 bg-white/10 text-white backdrop-blur-xl',
      badge: 'bg-white text-slate-950',
      muted: 'text-slate-300',
      button: 'border-white/10 bg-white/10 text-white hover:bg-white/20',
      footer: 'text-slate-400',
    }
  );
}

function renderFocusCard() {
  const focusNote = getSortedNotes(notes)[0];
  const tags = focusNote?.tags?.length ? focusNote.tags.slice(0, 3) : ['sekolah', 'fokus', 'hari-ini'];

  elements.focusCard.innerHTML = `
    <div class="mb-10 flex items-center justify-between gap-4">
      <div>
        <p class="text-xs font-black uppercase text-cyan-200/80">Fokus hari ini</p>
        <p class="mt-2 text-sm font-semibold text-slate-400">Catatan yang paling perlu dilihat dulu</p>
      </div>
      <span class="grid h-12 w-12 place-items-center rounded-3xl bg-white/10 text-sm font-black">${focusNote?.pinned ? 'PIN' : 'TOP'}</span>
    </div>
    <h3 class="mb-6 text-3xl font-black leading-tight text-white sm:text-4xl">
      ${escapeHtml(focusNote?.title || 'Belum ada fokus hari ini')}
    </h3>
    <div class="flex flex-wrap gap-2">
      ${tags.map((tag) => `<span class="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold text-slate-200">#${escapeHtml(tag)}</span>`).join('')}
    </div>
  `;
}

function renderStats() {
  const stats = [
    { label: 'Total Catatan', value: notes.length },
    { label: 'Prioritas', value: notes.filter((note) => note.pinned).length },
    { label: 'Kategori', value: getUniqueCategoryCount() },
    { label: 'Minggu Ini', value: getThisWeekCount() },
  ];

  elements.statsGrid.innerHTML = stats
    .map(
      (stat) => `
        <div class="rounded-3xl border border-white/10 bg-slate-950/60 p-4">
          <p class="text-sm font-semibold text-slate-400">${stat.label}</p>
          <p class="mt-3 text-3xl font-black text-white">${stat.value}</p>
        </div>
      `,
    )
    .join('');
}

function renderFilters() {
  elements.categoryFilters.innerHTML = categories
    .map(
      (category) => `
        <button class="filter-pill ${activeCategory === category ? 'is-active' : ''}" data-category="${escapeHtml(category)}">
          ${escapeHtml(category)}
        </button>
      `,
    )
    .join('');
}

function renderNotes() {
  const visibleNotes = getFilteredNotes();
  elements.notesHeading.textContent = activeCategory === 'Semua' ? 'Semua Catatan' : activeCategory;
  elements.resultInfo.textContent = `${visibleNotes.length} catatan ditemukan`;

  if (!visibleNotes.length) {
    elements.notesGrid.innerHTML = `
      <div class="glass-panel rounded-[2rem] p-8 text-center md:col-span-2">
        <div class="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-violet-500 to-cyan-300 text-3xl font-black">N</div>
        <h3 class="text-2xl font-black text-white">Belum ada catatan yang cocok</h3>
        <p class="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">Coba ubah kata kunci, pilih kategori lain, atau buat catatan baru untuk tugas sekolahmu.</p>
        <button class="mt-6 rounded-3xl bg-gradient-to-r from-violet-500 to-cyan-300 px-7 py-3 text-sm font-black text-white shadow-cyan" data-action="new-note">Buat Catatan</button>
      </div>
    `;
    return;
  }

  elements.notesGrid.innerHTML = visibleNotes.map(renderNoteCard).join('');
}

function renderNoteCard(note) {
  const tone = getCategoryTone(note.category);
  const preview = note.content.length > 120 ? `${note.content.slice(0, 120)}...` : note.content;

  return `
    <article class="note-card ${tone.card}" data-note-id="${note.id}" data-action="open-detail">
      <div class="mb-8 flex items-start justify-between gap-3">
        <span class="rounded-full px-4 py-2 text-xs font-black ${tone.badge}">${escapeHtml(note.category)}</span>
        <div class="flex shrink-0 gap-2">
          <button class="grid h-10 min-w-10 place-items-center rounded-2xl border px-3 text-xs font-black transition ${tone.button}" data-action="toggle-pin" data-note-id="${note.id}" aria-label="Ubah prioritas">${note.pinned ? 'Pinned' : 'Pin'}</button>
          <button class="grid h-10 min-w-10 place-items-center rounded-2xl border px-3 text-xs font-black transition ${tone.button}" data-action="edit-note" data-note-id="${note.id}" aria-label="Edit catatan">Edit</button>
          <button class="grid h-10 min-w-10 place-items-center rounded-2xl border px-3 text-xs font-black transition ${tone.button}" data-action="delete-note" data-note-id="${note.id}" aria-label="Hapus catatan">Hapus</button>
        </div>
      </div>
      <h3 class="mb-4 text-2xl font-black leading-tight">${escapeHtml(note.title)}</h3>
      <p class="line-clamp-note min-h-24 text-sm leading-7 ${tone.muted}">${escapeHtml(preview)}</p>
      <footer class="mt-8 flex items-center justify-between gap-4 text-xs font-bold ${tone.footer}">
        <span>${formatDate(note.createdAt)}</span>
        <span>${getReadTime(note.content)}</span>
      </footer>
    </article>
  `;
}

function renderAll() {
  renderFocusCard();
  renderStats();
  renderFilters();
  renderNotes();
}

function addNote(noteData) {
  const now = new Date().toISOString();
  notes = [
    {
      id: crypto.randomUUID(),
      ...noteData,
      createdAt: now,
      updatedAt: now,
    },
    ...notes,
  ];
  saveNotes();
  renderAll();
}

function updateNote(id, noteData) {
  notes = notes.map((note) =>
    note.id === id
      ? {
          ...note,
          ...noteData,
          updatedAt: new Date().toISOString(),
        }
      : note,
  );
  saveNotes();
  renderAll();
}

function deleteNote(id) {
  const selectedNote = notes.find((note) => note.id === id);
  if (!selectedNote) return;

  if (confirm(`Hapus catatan "${selectedNote.title}"?`)) {
    notes = notes.filter((note) => note.id !== id);
    saveNotes();
    renderAll();
  }
}

function togglePin(id) {
  notes = notes.map((note) =>
    note.id === id
      ? {
          ...note,
          pinned: !note.pinned,
          updatedAt: new Date().toISOString(),
        }
      : note,
  );
  saveNotes();
  renderAll();
}

function filterNotes(category) {
  activeCategory = category;
  renderAll();
}

function searchNotes(query) {
  searchQuery = query;
  renderNotes();
}

function parseTags(value) {
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function openNoteModal(noteId = null) {
  editingNoteId = noteId;
  const note = notes.find((item) => item.id === noteId);

  elements.modalTitle.textContent = note ? 'Edit Catatan' : 'Tambah Catatan';
  elements.titleInput.value = note?.title || '';
  elements.contentInput.value = note?.content || '';
  elements.categoryInput.value = note?.category || 'Belajar';
  elements.tagsInput.value = note?.tags?.join(', ') || '';
  elements.pinnedInput.checked = Boolean(note?.pinned);
  elements.noteModal.classList.add('is-open');
  elements.noteModal.setAttribute('aria-hidden', 'false');
  elements.titleInput.focus();
}

function closeNoteModal() {
  editingNoteId = null;
  elements.noteForm.reset();
  elements.categoryInput.value = 'Belajar';
  elements.noteModal.classList.remove('is-open');
  elements.noteModal.setAttribute('aria-hidden', 'true');
}

function openDetailModal(id) {
  const note = notes.find((item) => item.id === id);
  if (!note) return;

  const tone = getCategoryTone(note.category);
  elements.detailContent.innerHTML = `
    <div class="mb-6 flex items-start justify-between gap-4">
      <div>
        <span class="inline-flex rounded-full px-4 py-2 text-xs font-black ${tone.badge}">${escapeHtml(note.category)}</span>
        <h2 class="mt-5 text-3xl font-black leading-tight text-white sm:text-4xl">${escapeHtml(note.title)}</h2>
      </div>
      <button class="icon-button" data-action="close-detail-modal" type="button" aria-label="Tutup detail">Tutup</button>
    </div>
    <div class="mb-6 flex flex-wrap gap-3 text-xs font-bold text-slate-300">
      <span class="rounded-full border border-white/10 bg-white/10 px-4 py-2">${formatDate(note.createdAt)}</span>
      <span class="rounded-full border border-white/10 bg-white/10 px-4 py-2">${note.pinned ? 'Catatan prioritas' : 'Catatan biasa'}</span>
      <span class="rounded-full border border-white/10 bg-white/10 px-4 py-2">${getReadTime(note.content)}</span>
    </div>
    <p class="whitespace-pre-wrap rounded-[2rem] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-slate-200">${escapeHtml(note.content)}</p>
    <div class="mt-6 flex flex-wrap gap-2">
      ${(note.tags.length ? note.tags : ['tanpa-tag']).map((tag) => `<span class="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold text-slate-200">#${escapeHtml(tag)}</span>`).join('')}
    </div>
  `;
  elements.detailModal.classList.add('is-open');
  elements.detailModal.setAttribute('aria-hidden', 'false');
}

function closeDetailModal() {
  elements.detailModal.classList.remove('is-open');
  elements.detailModal.setAttribute('aria-hidden', 'true');
}

function handleSubmit(event) {
  event.preventDefault();

  const title = elements.titleInput.value.trim();
  const content = elements.contentInput.value.trim();

  if (!title || !content) {
    alert('Judul dan isi catatan wajib diisi dulu.');
    return;
  }

  const noteData = {
    title,
    content,
    category: elements.categoryInput.value,
    tags: parseTags(elements.tagsInput.value),
    pinned: elements.pinnedInput.checked,
  };

  if (editingNoteId) {
    updateNote(editingNoteId, noteData);
  } else {
    addNote(noteData);
  }

  closeNoteModal();
}

function setupCategoryOptions() {
  elements.categoryInput.innerHTML = formCategories
    .map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`)
    .join('');
}

function setupEvents() {
  document.addEventListener('click', (event) => {
    const actionTarget = event.target.closest('[data-action]');
    if (!actionTarget) return;

    const { action, noteId } = actionTarget.dataset;

    if (['toggle-pin', 'edit-note', 'delete-note'].includes(action)) {
      event.stopPropagation();
    }

    if (action === 'new-note') openNoteModal();
    if (action === 'scroll-notes') document.querySelector('#notesArea').scrollIntoView({ behavior: 'smooth' });
    if (action === 'toggle-pin') togglePin(noteId);
    if (action === 'edit-note') openNoteModal(noteId);
    if (action === 'delete-note') deleteNote(noteId);
    if (action === 'open-detail') openDetailModal(noteId);
    if (action === 'close-note-modal') closeNoteModal();
    if (action === 'close-detail-modal') closeDetailModal();
  });

  elements.mobileMenuButton.addEventListener('click', () => {
    elements.mobileMenu.classList.toggle('hidden');
  });

  elements.categoryFilters.addEventListener('click', (event) => {
    const button = event.target.closest('[data-category]');
    if (button) filterNotes(button.dataset.category);
  });

  elements.searchInput.addEventListener('input', (event) => {
    searchNotes(event.target.value);
  });

  elements.noteForm.addEventListener('submit', handleSubmit);

  elements.noteModal.addEventListener('click', (event) => {
    if (event.target === elements.noteModal) closeNoteModal();
  });

  elements.detailModal.addEventListener('click', (event) => {
    if (event.target === elements.detailModal) closeDetailModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeNoteModal();
      closeDetailModal();
    }
  });
}

setupCategoryOptions();
loadNotes();
setupEvents();
renderAll();
