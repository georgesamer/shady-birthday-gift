# Shady's Birthday

A mobile-first birthday surprise built with React, TypeScript, and Vite. It includes a celebratory dashboard, animated terminal message, particle effects, and a random birthday-wish generator.

## Requirements

- Node.js 22 or later
- npm
- Docker (optional, for the container image)

## Run locally

```bash
npm ci
npm run dev
```

Vite prints the local URL when the development server starts.

## Build

```bash
npm run build
npm run preview
```

The production files are written to `dist/`.

## Personalize

Edit `FROM`, the message, wishes, and terminal sequence in `src/App.tsx`. The terminal's sample year is also set there.

## Docker

Build and run the production image:

```bash
docker build -t shady-birthday .
docker run --rm -p 8080:8080 shady-birthday
```

Open [http://localhost:8080](http://localhost:8080). The image uses a multi-stage Node.js build and unprivileged Nginx server.

## GitHub Pages

The workflow at `.github/workflows/deploy.yml` builds and deploys on pushes to `main`; it also supports manual runs from the Actions tab. In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**.

## Project structure

```text
.
├── .github/workflows/deploy.yml
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   └── styles.css
├── Dockerfile
├── index.html
├── nginx.conf
├── package.json
├── package-lock.json
├── tsconfig.json
└── vite.config.ts
```
