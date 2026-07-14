# Retail E-commerce Platform

Monorepo para una plataforma de retail por departamentos. Turborepo coordina un frontend
React y cuatro aplicaciones NestJS; RabbitMQ separa el gateway de los servicios y cada
dominio conserva la propiedad exclusiva de su almacenamiento.

## Arquitectura

| Aplicación | Puerto | Responsabilidad | Persistencia |
| --- | ---: | --- | --- |
| `@retail/web` | 5173 | SPA React/Vite/Tailwind | — |
| `@retail/api-gateway` | 3000 | API REST pública `/api/v1` | — |
| `@retail/users-service` | 3001 | Identidad, autenticación y perfiles | PostgreSQL |
| `@retail/catalog-service` | 3002 | Productos, categorías e inventario | MongoDB |
| `@retail/recommendations-service` | 3003 | Grafo y cross-selling | Neo4j |

RabbitMQ escucha en `5672`; su panel local está en
[http://localhost:15672](http://localhost:15672). Neo4j Browser está en
[http://localhost:7474](http://localhost:7474).

## Requisitos

- Node.js 24 o superior
- pnpm 11.13.0 (se recomienda Corepack)
- Docker Desktop con Compose para la infraestructura local
- Git

En Windows sin permisos administrativos para habilitar los shims de Corepack, sustituye
`pnpm` por `corepack pnpm` en los comandos.

## Primer inicio

```powershell
corepack pnpm install
corepack pnpm env:init
corepack pnpm docker:infra
corepack pnpm db:generate
corepack pnpm dev
```

Los valores de `.env.example` son únicamente credenciales locales. Cambia todos los
secretos fuera del entorno de desarrollo y no versiones archivos `.env`.

## Comandos

- `pnpm dev`: ejecuta todas las aplicaciones en paralelo.
- `pnpm build`: compila aplicaciones y paquetes respetando el grafo de dependencias.
- `pnpm lint`, `pnpm typecheck`, `pnpm test`: controles de calidad.
- `pnpm test:e2e`: pruebas end-to-end una vez disponible la infraestructura.
- `pnpm db:generate`: genera el cliente Prisma de Usuarios.
- `pnpm db:migrate --filter @retail/users-service`: crea/aplica una migración local.
- `pnpm docker:infra`: inicia PostgreSQL, MongoDB, Neo4j y RabbitMQ.
- `pnpm docker:full`: construye y ejecuta toda la plataforma en contenedores.
- `pnpm docker:down`: detiene ambos perfiles de Compose.

## Variables de entorno

Cada aplicación incluye su propio `.env.example`. Las variables principales son:

- Gateway: `API_GATEWAY_PORT`, `CORS_ORIGINS`, `RABBITMQ_URL`.
- Usuarios: `DATABASE_URL`, `DIRECT_URL`, `JWT_ACCESS_SECRET`,
  `JWT_REFRESH_SECRET`.
- Catálogo: `MONGODB_URI`, `MONGODB_DB`.
- Recomendaciones: `NEO4J_URI`, `NEO4J_USERNAME`, `NEO4J_PASSWORD`,
  `NEO4J_DATABASE`.
- Web: `VITE_API_BASE_URL`. No debe contener secretos porque Vite la incorpora al bundle.

La configuración se valida al iniciar cada proceso. Los endpoints `health/live` no
dependen de infraestructura; `health/ready` comprueba el almacenamiento correspondiente.

## PostgreSQL y Supabase

El servicio de Usuarios usa Prisma. Para Supabase, define `DATABASE_URL` con la URL pooled
recomendada para el runtime y `DIRECT_URL` con la conexión directa requerida por
migraciones. La implementación inicial administra JWT propios; el acceso a identidad está
encapsulado para poder sustituirlo por Supabase Auth más adelante.

No ejecutes migraciones automáticamente durante el arranque de producción. Aplícalas como
un paso explícito de despliegue.

## Límites del monorepo

- Las aplicaciones solo comparten contratos, utilidades de mensajería, logging,
  configuración y UI.
- Ningún servicio importa modelos, repositorios o clientes de base de otro servicio.
- Los mensajes tienen versión y `correlationId`; los consumidores deben ser idempotentes,
  ya que RabbitMQ ofrece entrega al menos una vez.
- El gateway es la única API de negocio pública. Los puertos `3001-3003` son de operación
  local y healthchecks.

## Mensajería resiliente

- Cada servicio declara su cola con `durable: true` y una cola de dead-letter
  (`<queue>.dlq`) asociada mediante `x-dead-letter-exchange`/`x-dead-letter-routing-key`,
  configurada por `@retail/messaging#createRmqOptions`.
- Los mensajes se confirman manualmente (`noAck: false`); si un handler lanza una
  excepción, `RmqRetryFilter` reintenta hasta `DEFAULT_MAX_RMQ_RETRIES` veces usando el
  contador `x-death` del broker y luego enruta el mensaje a su dead-letter queue.
- El gateway aplica un timeout (`RPC_TIMEOUT_MS`) a cada llamada RPC y traduce errores del
  broker a respuestas HTTP (`502`/`504`).
- `@retail/messaging#createIdempotencyStore` ofrece una guarda de idempotencia en memoria
  para futuros handlers de comandos/eventos; en producción debe respaldarse con una
  restricción única en la base de datos de cada servicio.

## Imágenes Docker

Cada `Dockerfile` usa `turbo prune --docker` para copiar solo el subconjunto de
paquetes/apps que necesita esa imagen antes de instalar dependencias, evitando que
`pnpm install --frozen-lockfile` falle por referenciar apps ausentes del contexto de
build. Construye una imagen individual con, por ejemplo:

```powershell
docker build -f apps/users-service/Dockerfile -t retail/users-service .
```

## Verificación

```powershell
corepack pnpm install --frozen-lockfile
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm build
```

El workflow `.github/workflows/ci.yml` ejecuta la misma secuencia en cada pull request.
