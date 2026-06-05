import './globals.css';

export const metadata = {
  title: 'NoteSpace - School Notes',
  description: 'Dashboard catatan sekolah dengan Next.js dan Tailwind CSS.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
