# @retail/catalog-service

Servicio Nest HTTP para catálogo, categorías e inventario. Expone endpoints
REST internos y persiste el catálogo en MongoDB. El acceso público pasa por el
API Gateway.

## Configuración

Copia `.env.example` y configura:

- `PORT` (default `3002`)
- `MONGODB_URI` y `MONGODB_DB`

## Endpoints internos

- `GET /ping`
- `GET /categories`
- `GET /products?limit=&category=`
- `GET /inventory/:sku?location=`
- `GET /health/live`
- `GET /health/ready`

## Comandos

```bash
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
```
