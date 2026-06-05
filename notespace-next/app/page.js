'use client';

import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'notespace_next_notes';
const categories = ['Semua', 'Project', 'Belajar', 'Ide Konten', 'Pribadi', 'Database', 'Frontend'];
const formCategories = ['Project', 'Belajar', 'Ide Konten', 'Pribadi', 'Database', 'Frontend'];

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

function emptyForm() {
  return {
    title: '',
    content: '',
    category: 'Belajar',
    tags: '',
    pinned: false,
  };
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

  return tones[category] || {
    card: 'border-white/10 bg-white/10 text-white backdrop-blur-xl',
    badge: 'bg-white text-slate-950',
    muted: 'text-slate-300',
    button: 'border-white/10 bg-white/10 text-white hover:bg-white/20',
    footer: 'text-slate-400',
  };
}

function sortNotes(noteList) {
  return [...noteList].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
}

function parseTags(value) {
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [detailNote, setDetailNote] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const savedNotes = localStorage.getItem(STORAGE_KEY);

    if (!savedNotes) {
      const seededNotes = createSchoolSeedNotes();
      setNotes(seededNotes);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seededNotes));
      return;
    }

    try {
      setNotes(JSON.parse(savedNotes));
    } catch {
      const seededNotes = createSchoolSeedNotes();
      setNotes(seededNotes);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seededNotes));
    }
  }, []);

  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    }
  }, [notes]);

  const visibleNotes = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return sortNotes(notes).filter((note) => {
      const matchesCategory = activeCategory === 'Semua' || note.category === activeCategory;
      const matchesSearch =
        !query ||
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, notes, searchQuery]);

  const focusNote = sortNotes(notes)[0];
  const stats = [
    { label: 'Total Catatan', value: notes.length },
    { label: 'Prioritas', value: notes.filter((note) => note.pinned).length },
    { label: 'Kategori', value: new Set(notes.map((note) => note.category)).size },
    {
      label: 'Minggu Ini',
      value: notes.filter((note) => {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        return new Date(note.createdAt) >= startOfWeek;
      }).length,
    },
  ];

  function openCreateModal() {
    setEditingId(null);
    setForm(emptyForm());
    setIsNoteModalOpen(true);
  }

  function openEditModal(note) {
    setEditingId(note.id);
    setForm({
      title: note.title,
      content: note.content,
      category: note.category,
      tags: note.tags.join(', '),
      pinned: note.pinned,
    });
    setIsNoteModalOpen(true);
  }

  function closeNoteModal() {
    setEditingId(null);
    setForm(emptyForm());
    setIsNoteModalOpen(false);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const title = form.title.trim();
    const content = form.content.trim();

    if (!title || !content) {
      alert('Judul dan isi catatan wajib diisi dulu.');
      return;
    }

    const now = new Date().toISOString();
    const noteData = {
      title,
      content,
      category: form.category,
      tags: parseTags(form.tags),
      pinned: form.pinned,
    };

    if (editingId) {
      setNotes((currentNotes) =>
        currentNotes.map((note) =>
          note.id === editingId ? { ...note, ...noteData, updatedAt: now } : note,
        ),
      );
    } else {
      setNotes((currentNotes) => [
        {
          id: crypto.randomUUID(),
          ...noteData,
          createdAt: now,
          updatedAt: now,
        },
        ...currentNotes,
      ]);
    }

    closeNoteModal();
  }

  function deleteNote(note) {
    if (confirm(`Hapus catatan "${note.title}"?`)) {
      setNotes((currentNotes) => currentNotes.filter((item) => item.id !== note.id));
      if (detailNote?.id === note.id) setDetailNote(null);
    }
  }

  function togglePin(noteId) {
    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === noteId
          ? { ...note, pinned: !note.pinned, updatedAt: new Date().toISOString() }
          : note,
      ),
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-5 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute left-[-8rem] top-[-10rem] h-80 w-80 rounded-full bg-violet-600/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-[-9rem] h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-12rem] left-1/3 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

      <section className="relative mx-auto max-w-[1200px]">
        <header className="mb-10 flex items-center justify-between gap-4 rounded-[2rem] border border-white/10 bg-slate-950/40 p-3 backdrop-blur-xl">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-3xl bg-gradient-to-br from-violet-500 to-cyan-300 text-2xl font-black text-white shadow-cyan">
              N
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-xl font-black text-white sm:text-2xl">NoteSpace</h1>
              <p className="text-sm font-medium text-slate-400">Ruang rapi untuk tugas dan ide sekolah</p>
            </div>
          </div>
          <button
            className="rounded-full bg-gradient-to-r from-violet-500 to-cyan-300 px-5 py-3 text-sm font-black text-white shadow-cyan transition hover:-translate-y-0.5"
            onClick={openCreateModal}
          >
            Buat Catatan
          </button>
        </header>

        <section className="mb-6 py-2 sm:py-6">
          <p className="mb-4 text-sm font-bold uppercase text-cyan-200/90">
            Halo, siap lanjut hari ini?
          </p>
          <h2 className="max-w-6xl text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
            Atur tugas, rangkuman, dan ide dengan cara yang{' '}
            <span className="bg-gradient-to-r from-violet-300 to-cyan-200 bg-clip-text text-transparent">
              lebih tenang.
            </span>
            {' '}Simpan catatan sekolah, rencana project, dan pengingat penting dalam satu dashboard yang mudah dipantau.
          </h2>
        </section>

        <section className="glass-panel mb-8 rounded-[2rem] p-4 sm:p-5">
          <div className="grid gap-4 xl:grid-cols-[minmax(280px,1fr)_1.2fr] xl:items-start">
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="relative min-w-0 flex-1">
                <span className="sr-only">Cari catatan</span>
                <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate-500">
                  Search
                </span>
                <input
                  className="field pl-20"
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Cari tugas, materi, atau isi catatan..."
                />
              </label>
              <button
                className="rounded-3xl bg-gradient-to-r from-violet-500 to-cyan-300 px-7 py-4 text-sm font-black text-white shadow-cyan transition hover:-translate-y-0.5 sm:min-w-40"
                onClick={openCreateModal}
              >
                Buat Catatan
              </button>
            </div>

            <div className="min-w-0">
              <p className="mb-3 text-xs font-black uppercase text-cyan-200/80">Pilih fokus catatan</p>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <button
                    className={`filter-pill ${activeCategory === category ? 'filter-pill-active' : ''}`}
                    key={category}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8 grid gap-6 lg:grid-cols-2">
          <FocusCard note={focusNote} />
          <div className="glass-panel rounded-[2rem] p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase text-violet-200/80">Ringkasan</p>
                <h2 className="mt-1 text-2xl font-black text-white">Statistik Catatan</h2>
              </div>
              <span className="rounded-full border border-cyan-200/20 bg-cyan-300/10 px-4 py-2 text-xs font-bold text-cyan-100">
                Tersimpan otomatis
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat) => (
                <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-4" key={stat.label}>
                  <p className="text-sm font-semibold text-slate-400">{stat.label}</p>
                  <p className="mt-3 text-3xl font-black text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-14">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase text-slate-400">Catatan tersimpan</p>
              <h2 className="mt-1 text-3xl font-black text-white">
                {activeCategory === 'Semua' ? 'Semua Catatan' : activeCategory}
              </h2>
            </div>
            <p className="text-sm font-semibold text-slate-400">{visibleNotes.length} catatan ditemukan</p>
          </div>

          {visibleNotes.length === 0 ? (
            <EmptyState onCreate={openCreateModal} />
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {visibleNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onDetail={setDetailNote}
                  onEdit={openEditModal}
                  onDelete={deleteNote}
                  onTogglePin={togglePin}
                />
              ))}
            </div>
          )}
        </section>
      </section>

      {isNoteModalOpen && (
        <NoteModal
          form={form}
          setForm={setForm}
          editingId={editingId}
          onClose={closeNoteModal}
          onSubmit={handleSubmit}
        />
      )}

      {detailNote && (
        <DetailModal
          note={detailNote}
          onClose={() => setDetailNote(null)}
        />
      )}
    </main>
  );
}

function FocusCard({ note }) {
  const tags = note?.tags?.length ? note.tags.slice(0, 3) : ['sekolah', 'fokus', 'hari-ini'];

  return (
    <aside className="glass-panel rounded-[2rem] p-6 sm:p-8">
      <div className="mb-10 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase text-cyan-200/80">Fokus hari ini</p>
          <p className="mt-2 text-sm font-semibold text-slate-400">
            Catatan yang paling perlu dilihat dulu
          </p>
        </div>
        <span className="grid h-12 w-12 place-items-center rounded-3xl bg-white/10 text-sm font-black">
          {note?.pinned ? 'PIN' : 'TOP'}
        </span>
      </div>
      <h3 className="mb-6 text-3xl font-black leading-tight text-white sm:text-4xl">
        {note?.title || 'Belum ada fokus hari ini'}
      </h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold text-slate-200" key={tag}>
            #{tag}
          </span>
        ))}
      </div>
    </aside>
  );
}

function NoteCard({ note, onDetail, onEdit, onDelete, onTogglePin }) {
  const tone = getCategoryTone(note.category);
  const preview = note.content.length > 120 ? `${note.content.slice(0, 120)}...` : note.content;

  return (
    <article className={`note-card ${tone.card}`} onClick={() => onDetail(note)}>
      <div className="mb-8 flex items-start justify-between gap-3">
        <span className={`rounded-full px-4 py-2 text-xs font-black ${tone.badge}`}>
          {note.category}
        </span>
        <div className="flex shrink-0 gap-2">
          <button
            className={`grid h-10 min-w-10 place-items-center rounded-2xl border px-3 text-xs font-black transition ${tone.button}`}
            onClick={(event) => {
              event.stopPropagation();
              onTogglePin(note.id);
            }}
          >
            {note.pinned ? 'Pinned' : 'Pin'}
          </button>
          <button
            className={`grid h-10 min-w-10 place-items-center rounded-2xl border px-3 text-xs font-black transition ${tone.button}`}
            onClick={(event) => {
              event.stopPropagation();
              onEdit(note);
            }}
          >
            Edit
          </button>
          <button
            className={`grid h-10 min-w-10 place-items-center rounded-2xl border px-3 text-xs font-black transition ${tone.button}`}
            onClick={(event) => {
              event.stopPropagation();
              onDelete(note);
            }}
          >
            Hapus
          </button>
        </div>
      </div>
      <h3 className="mb-4 text-2xl font-black leading-tight">{note.title}</h3>
      <p className={`line-clamp-note min-h-24 text-sm leading-7 ${tone.muted}`}>{preview}</p>
      <footer className={`mt-8 flex items-center justify-between gap-4 text-xs font-bold ${tone.footer}`}>
        <span>{formatDate(note.createdAt)}</span>
        <span>{getReadTime(note.content)}</span>
      </footer>
    </article>
  );
}

function EmptyState({ onCreate }) {
  return (
    <div className="glass-panel rounded-[2rem] p-8 text-center">
      <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-violet-500 to-cyan-300 text-3xl font-black">
        N
      </div>
      <h3 className="text-2xl font-black text-white">Belum ada catatan yang cocok</h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
        Coba ubah kata kunci, pilih kategori lain, atau buat catatan baru untuk tugas sekolahmu.
      </p>
      <button
        className="mt-6 rounded-3xl bg-gradient-to-r from-violet-500 to-cyan-300 px-7 py-3 text-sm font-black text-white shadow-cyan"
        onClick={onCreate}
      >
        Buat Catatan
      </button>
    </div>
  );
}

function NoteModal({ form, setForm, editingId, onClose, onSubmit }) {
  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-8 backdrop-blur-xl">
      <div className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-slate-950/95 p-5 shadow-glow sm:p-7">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase text-cyan-200/80">NoteSpace</p>
            <h2 className="mt-1 text-3xl font-black text-white">
              {editingId ? 'Edit Catatan' : 'Tambah Catatan'}
            </h2>
          </div>
          <button className="icon-button" onClick={onClose} type="button">
            Tutup
          </button>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <input
            className="field"
            type="text"
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            placeholder="Contoh: Tugas Biologi Bab Ekosistem"
          />
          <textarea
            className="field min-h-40 resize-y"
            value={form.content}
            onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
            placeholder="Tulis isi catatan, langkah pengerjaan, atau poin penting di sini."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <select
              className="field"
              value={form.category}
              onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
            >
              {formCategories.map((category) => (
                <option value={category} key={category}>
                  {category}
                </option>
              ))}
            </select>
            <input
              className="field"
              type="text"
              value={form.tags}
              onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))}
              placeholder="Tags: ipa, tugas, minggu-ini"
            />
          </div>
          <label className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-bold text-slate-200">
            <input
              className="h-5 w-5 accent-violet-500"
              checked={form.pinned}
              onChange={(event) => setForm((current) => ({ ...current, pinned: event.target.checked }))}
              type="checkbox"
            />
            Jadikan prioritas
          </label>
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              className="rounded-3xl border border-white/10 bg-white/10 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/20"
              onClick={onClose}
              type="button"
            >
              Batal
            </button>
            <button
              className="rounded-3xl bg-gradient-to-r from-violet-500 to-cyan-300 px-7 py-3 text-sm font-black text-white shadow-cyan transition hover:-translate-y-0.5"
              type="submit"
            >
              Simpan Catatan
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function DetailModal({ note, onClose }) {
  const tone = getCategoryTone(note.category);

  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-8 backdrop-blur-xl">
      <div className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-slate-950/95 p-5 shadow-glow sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <span className={`inline-flex rounded-full px-4 py-2 text-xs font-black ${tone.badge}`}>
              {note.category}
            </span>
            <h2 className="mt-5 text-3xl font-black leading-tight text-white sm:text-4xl">
              {note.title}
            </h2>
          </div>
          <button className="icon-button" onClick={onClose} type="button">
            Tutup
          </button>
        </div>
        <div className="mb-6 flex flex-wrap gap-3 text-xs font-bold text-slate-300">
          <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2">
            {formatDate(note.createdAt)}
          </span>
          <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2">
            {note.pinned ? 'Catatan prioritas' : 'Catatan biasa'}
          </span>
          <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2">
            {getReadTime(note.content)}
          </span>
        </div>
        <p className="whitespace-pre-wrap rounded-[2rem] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-slate-200">
          {note.content}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {(note.tags.length ? note.tags : ['tanpa-tag']).map((tag) => (
            <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold text-slate-200" key={tag}>
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
