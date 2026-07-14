# @retail/web

Frontend operativo de Retail construido con React, Vite, React Router y
Tailwind CSS.

## Configuración

Copia `.env.example` a `.env.local` y ajusta la URL del API Gateway:

```dotenv
VITE_API_BASE_URL=http://localhost:3000
```

## Scripts

- `pnpm dev`: servidor de desarrollo.
- `pnpm build`: comprobación de tipos y build de producción.
- `pnpm lint`: análisis estático con ESLint.
- `pnpm typecheck`: comprobación de TypeScript.
- `pnpm test`: pruebas unitarias con Vitest.
- `pnpm clean`: elimina artefactos locales.
