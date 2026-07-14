# @retail/catalog-service

Servicio Nest híbrido para catálogo, categorías e inventario. Expone health
checks por HTTP y consume mensajes por RabbitMQ; persiste el catálogo en
MongoDB.

## Configuración

Copia `.env.example` y configura:

- `PORT`
- `RABBITMQ_URL`, `RABBITMQ_QUEUE` y `RABBITMQ_PREFETCH`
- `MONGODB_URI` y `MONGODB_DB`

## Comandos

```bash
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
```

## Health checks

- `GET /health/live`: proceso HTTP activo.
- `GET /health/ready`: conexión de MongoDB lista.
