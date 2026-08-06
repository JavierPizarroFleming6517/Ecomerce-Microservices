# @retail/payments-service

Servicio Nest HTTP para pagos con Transbank Webpay Plus (modo integración por defecto).

## Configuración

- `PORT` (default `3004`)
- `TRANSBANK_ENVIRONMENT` (`integration` | `production`)
- `WEBPAY_RETURN_URL` URL a la que Transbank redirige tras el pago
- Opcional producción: `TRANSBANK_COMMERCE_CODE`, `TRANSBANK_API_KEY`

## Endpoints internos

- `GET /ping`
- `GET /health/live`
- `GET /health/ready`
- `POST /payments/transactions` — crea transacción Webpay (`amount`, `buyOrder?`, `sessionId?`, `returnUrl?`)
- `POST /payments/transactions/commit` — confirma con `token` / `token_ws`
- `GET /payments/transactions/:token` — estado local de la transacción

## Comandos

```bash
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm test
```
