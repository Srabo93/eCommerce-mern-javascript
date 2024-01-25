ARG NODE_VERSION=18.18.2
ARG PNPM_VERSION=8.14.0

FROM node:${NODE_VERSION}-alpine

RUN --mount=type=cache,target=/root/.npm \
    npm install -g pnpm@${PNPM_VERSION}

WORKDIR /frontend

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install  --frozen-lockfile
    
COPY . .

EXPOSE 3000

CMD pnpm start
