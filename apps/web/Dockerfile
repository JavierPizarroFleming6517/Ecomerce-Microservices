# syntax=docker/dockerfile:1
# Prunes the monorepo down to only what @retail/web needs, so the
# subsequent install/build steps don't require every workspace app to be
# present on disk (see https://turborepo.com/docs/guides/tools/docker).
FROM node:24-alpine AS pruner
RUN npm install --global turbo
WORKDIR /workspace
COPY . .
RUN turbo prune @retail/web --docker

FROM node:24-alpine AS build
RUN corepack enable
WORKDIR /workspace
ARG VITE_API_BASE_URL=http://localhost:3000/api/v1
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
COPY --from=pruner /workspace/out/json/ .
RUN pnpm install --frozen-lockfile
COPY --from=pruner /workspace/out/full/ .
RUN pnpm turbo run build --filter=@retail/web

FROM nginxinc/nginx-unprivileged:alpine
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /workspace/apps/web/dist /usr/share/nginx/html
EXPOSE 8080
