# NoteSpace

NoteSpace berisi dua versi frontend:

- Versi Vite + Vanilla JavaScript ada di root repository.
- Versi Next.js ada di folder `notespace-next`.

## Menjalankan Versi Vite

```bash
npm install
npm run dev
```

## Menjalankan Versi Next.js

```bash
cd notespace-next
npm install
npm run dev
```

## Deploy ke Vercel

Jika ingin deploy versi **Next.js**, pastikan setting project Vercel seperti ini:

- Framework Preset: `Next.js`
- Root Directory: `notespace-next`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: kosongkan, biarkan default Next.js

Error seperti `No Next.js version detected` biasanya muncul ketika Vercel membaca `package.json` di root repo. Root repo ini adalah project Vite, jadi tidak memiliki dependency `next`. Karena itu, Root Directory harus diarahkan ke `notespace-next`.

Jika ingin deploy versi **Vite**, gunakan setting ini:

- Framework Preset: `Vite`
- Root Directory: kosongkan atau gunakan root repository
- Build Command: `npm run build`
- Output Directory: `dist`
