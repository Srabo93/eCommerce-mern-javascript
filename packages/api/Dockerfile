FROM node:22-alpine

RUN corepack enable && corepack prepare pnpm@10.25.0 --activate

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/api/package.json ./packages/api/package.json
COPY packages/ability/package.json ./packages/ability/package.json

RUN pnpm install --frozen-lockfile --filter @proshop/api...

WORKDIR /app/packages/api

EXPOSE 3000

CMD ["pnpm", "dev"]
