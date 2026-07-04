# pnpm — Reference for Agentic Coding

This project uses **pnpm 10.25.0** as the package manager with a monorepo workspace at `packages/*`.

## Official Documentation

Load these for comprehensive reference:

- **CLI overview**: <https://pnpm.io/10.x/pnpm-cli>
- **Workspace (monorepo)**: <https://pnpm.io/10.x/workspaces>
- **Filtering (`--filter` syntax)**: <https://pnpm.io/10.x/filtering>
- **CLI commands (add, install, etc.)**: <https://pnpm.io/10.x/cli/add>
- **Docker with pnpm**: <https://pnpm.io/10.x/docker>
- **Podman with pnpm**: <https://pnpm.io/10.x/podman>
- **`pnpm deploy` (monorepo Docker builds)**: <https://pnpm.io/10.x/cli/deploy>

## This Project's Setup

| Config | Value |
|---|---|
| **pnpm version** | 10.25.0 (corepack-enabled) |
| **Workspace file** | `pnpm-workspace.yaml` → `packages/*` |
| **Lockfile** | single `pnpm-lock.yaml` at root |
| **Root scripts** | `pnpm -r <script>` (recursive) / `pnpm -r -p <script>` (parallel) |
| **Docker image** | Node 22-alpine, corepack prepare, `--frozen-lockfile --filter @proshop/api` |
| **Legacy pnpm** | Legacy Dockerfiles use pnpm 8 via `npm i -g pnpm` |

## Essential CLI Commands

### Dependency Management

```bash
pnpm install                           # install all workspace deps
pnpm add <pkg>                         # add to root (fails without -w)
pnpm add <pkg> -w                      # add to root workspace package
pnpm add <pkg> --filter @proshop/api   # add dep to a specific package
pnpm add -D <pkg> --filter <name>      # add dev dependency
pnpm add -O <pkg> --filter <name>      # add optional dependency
pnpm add --save-exact <pkg>            # pin exact version (no ^/~)
pnpm remove <pkg> --filter <name>      # remove from package
pnpm update <pkg> --filter <name>      # update specific dep
pnpm up --latest -r                    # update all deps across workspace
pnpm dedupe                            # deduplicate after lockfile drift
pnpm why <pkg> -r                      # why is a dep installed
```

### Running Scripts

```bash
pnpm <script>                          # run in current package (or root)
pnpm --filter @proshop-api dev         # run dev in one package
pnpm --filter legacy-frontend test     # run tests in legacy frontend
pnpm -r build                          # run build in ALL packages (sequential)
pnpm -r -p dev                         # run dev in ALL packages (parallel)
pnpm exec <command>                    # execute any command in pnpm context
pnpm create hono@latest                # bootstrap a new Hono project
```

### Workspace Inspection

```bash
pnpm ls -r --depth=0                   # list all workspace packages + their deps
pnpm ls --depth=0 --filter <name>      # list deps of a specific package
pnpm why -r <pkg>                      # find which packages depend on <pkg>
pnpm list --pattern "@types/*"         # filter listed deps by pattern
```

## Filtering Reference

The `--filter` (or `-F`) flag targets commands to specific workspace packages:

```bash
# By name
pnpm --filter "@proshop/*" <cmd>           # all @proshop scoped packages
pnpm --filter @proshop-api <cmd>           # exact package name
pnpm --filter "*core" <cmd>                # glob pattern match

# Package + its dependencies (direct & transitive)
pnpm --filter @proshop-api... <cmd>

# Only dependencies of a package (not itself)
pnpm --filter "@proshop-api^..." <cmd>

# Package + its dependents (things that depend on it)
pnpm --filter ...@proshop-api <cmd>

# Only dependents
pnpm --filter "...^@proshop-api" <cmd>

# By glob path
pnpm --filter "./packages/**" <cmd>
pnpm --filter "{packages/**}" <cmd>

# Changed packages since a commit/branch
pnpm --filter "[origin/master]" <cmd>
pnpm --filter "...[origin/master]" <cmd>   # include dependents of changed

# Exclusion
pnpm --filter=!@proshop/ui <cmd>

# Multiple filters (union)
pnpm --filter ...foo --filter bar --filter baz... test
```

## Docker Patterns

### Current Dockerfile (`packages/api/Dockerfile`)

```
FROM node:22-alpine
RUN corepack enable && corepack prepare pnpm@10.25.0 --activate
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/api/package.json ./packages/api/package.json
RUN pnpm install --frozen-lockfile --filter @proshop/api
WORKDIR /app/packages/api
EXPOSE 3000
CMD ["pnpm", "dev"]
```

Key points:
- `corepack enable` activates the bundled pnpm manager
- `--frozen-lockfile` ensures reproducible installs
- `--filter @proshop/api` installs only what's needed for this package
- Copy `pnpm-lock.yaml` and `pnpm-workspace.yaml` first to cache the install layer

### compose.yaml volume pattern

```yaml
volumes:
  - .:/app
  - /app/node_modules          # exclude host node_modules
  - /app/packages/api/node_modules  # exclude host pkg node_modules
```

The anonymous volumes prevent the host's `node_modules` from overriding the container's installed deps.

### Recommended: BuildKit cache mounts

For faster Docker builds, use a BuildKit cache mount to persist the pnpm store:

```dockerfile
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter @proshop/api
```

### Recommended: Multi-stage monorepo build with `pnpm deploy`

```dockerfile
FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile
RUN pnpm -r build
RUN pnpm --filter=app1 --prod deploy /prod/app1

FROM base AS app1
COPY --from=build /prod/app1 /prod/app1
WORKDIR /prod/app1
EXPOSE 8000
CMD ["pnpm", "start"]
```

### Recommended: `pnpm fetch` for CI/CD

When BuildKit cache mounts are unavailable (ephemeral CI):

```dockerfile
FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS prod
COPY pnpm-lock.yaml /app
WORKDIR /app
RUN pnpm fetch --prod
COPY . /app
RUN pnpm run build

FROM base
COPY --from=prod /app/node_modules /app/node_modules
COPY --from=prod /app/dist /app/dist
EXPOSE 8000
CMD ["pnpm", "start"]
```

`pnpm fetch` only needs the lockfile, so Docker layer caching is maximized — rebuilds only when dependencies change.

## Podman Patterns

### Key difference from Docker

Podman supports **copy-on-write filesystems like Btrfs**. With Btrfs, container runtimes create Btrfs subvolumes for mounted volumes. pnpm can leverage this to **reflink files** between host and container — meaning near-instant, zero-copy file sharing.

For non-COW filesystems (Ext4), pnpm falls back to copying files.

### Building with host store mount

```dockerfile
FROM node:22-slim
RUN corepack enable
VOLUME [ "/pnpm-store", "/app/node_modules" ]
RUN pnpm config --global set store-dir /pnpm-store
COPY package.json /app/package.json
WORKDIR /app
RUN pnpm install
RUN pnpm run build
```

```bash
podman build . --tag my-image:latest \
  -v "$HOME/.local/share/pnpm/store:/pnpm-store" \
  -v "$(pwd)/node_modules:/app/node_modules"
```

### Podman compose (drop-in replacement)

```bash
# If you have podman-compose or docker-compose with podman socket:
alias docker=podman
docker compose up -d

# Or use podman's native compose:
podman compose up -d

# Rootless considerations:
# - Volume mounts work but may need :Z for SELinux labels
# - Ports below 1024 require root or sysctl tweaks
# - Use --userns=keep-id for file ownership
```

### Podman security

> Only mount a host pnpm store into containers you trust. A container with write access to the mounted store can affect later installs that reuse that store.

## Workspace Protocol (`workspace:`)

```json
{
  "dependencies": {
    "@proshop/api": "workspace:*",       // exact local version
    "common": "workspace:^1.0.0",        // semver range
    "foo": "workspace:../foo"            // relative path
  }
}
```

When publishing, `workspace:*` → `1.0.0`, `workspace:^` → `^1.0.0`, etc.

### Key workspace settings (`pnpm-workspace.yaml`)

```yaml
packages:
  - packages/*
```

Additional settings configurable in `pnpm-workspace.yaml`:

| Setting | Default | Purpose |
|---|---|---|
| `linkWorkspacePackages` | `false` | Symlink workspace packages matching declared ranges |
| `injectWorkspacePackages` | `false` | Hard-link workspace deps instead of symlink |
| `preferWorkspacePackages` | `false` | Prefer local packages over newer registry versions |
| `syncInjectedDepsAfterScripts` | `undefined` | Sync injected deps after build scripts |

## Troubleshooting

| Error | Cause | Fix |
|---|---|---|
| `ERR_PNPM_FROZEN_LOCKFILE` | Lockfile out of sync with `package.json` | `pnpm install --no-frozen-lockfile` then commit the updated lockfile |
| Module not found for workspace sibling | Missing workspace dependency declaration | Add `"@proshop/xyz": "workspace:*"` to `package.json` |
| Corepack not available | Node version too old | `npm install -g pnpm@10.25.0` |
| Podman permission denied on volume | SELinux or rootless ownership | Add `:Z` to volume mount or use `--userns=keep-id` |
| `pnpm deploy` fails without `inject-workspace-packages` | Setting required by default | Add `injectWorkspacePackages: true` or use `--legacy` flag |
