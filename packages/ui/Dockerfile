FROM node:22-alpine

RUN corepack enable && corepack prepare pnpm@10.25.0 --activate

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/ui/package.json ./packages/ui/package.json

RUN pnpm install --frozen-lockfile --filter @proshop/ui

WORKDIR /app/packages/ui

EXPOSE 3001

CMD ["pnpm", "dev"]
