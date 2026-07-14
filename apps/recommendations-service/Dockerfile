# syntax=docker/dockerfile:1
# Prunes the monorepo down to only what @retail/recommendations-service
# needs, so the subsequent install/build steps don't require every
# workspace app to be present on disk
# (see https://turborepo.com/docs/guides/tools/docker).
FROM node:24-alpine AS pruner
RUN npm install --global turbo
WORKDIR /workspace
COPY . .
RUN turbo prune @retail/recommendations-service --docker

FROM node:24-alpine AS build
RUN corepack enable
WORKDIR /workspace
COPY --from=pruner /workspace/out/json/ .
RUN pnpm install --frozen-lockfile
COPY --from=pruner /workspace/out/full/ .
RUN pnpm turbo run build --filter=@retail/recommendations-service

FROM node:24-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /workspace
COPY --from=build --chown=node:node /workspace /workspace
USER node
EXPOSE 3003
CMD ["node", "apps/recommendations-service/dist/main.js"]
