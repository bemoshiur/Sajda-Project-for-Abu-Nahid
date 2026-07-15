# Contributing

Thanks for working on **Sajda Travel & Tours**. This guide covers the branching
model, commit style, and the local workflow.

## Branching model

| Branch | Purpose | Deploys to |
|---|---|---|
| `main` | Production. Protected — no direct pushes; PR + green CI required. | Vercel production |
| `develop` | Integration branch for the next release. | Vercel preview |
| `feat/*`, `fix/*`, `chore/*`, `docs/*` | Short-lived working branches. | Vercel preview per PR |

Flow: branch from `develop` → open a PR into `develop` → once a release is ready,
open a PR from `develop` into `main` and tag it.

```bash
git switch develop && git pull
git switch -c feat/package-filters
# …work…
git push -u origin feat/package-filters
# open a PR into develop
```

## Commit messages — Conventional Commits

```
<type>(optional scope): <short summary>
```

Types: `feat`, `fix`, `refactor`, `perf`, `style`, `docs`, `test`, `chore`, `build`, `ci`.

Examples:
- `feat(admin): add revenue export to Reports`
- `fix(booking): validate departure belongs to package`
- `chore(deps): bump next to 16.3`

## Local setup

```bash
pnpm install
cp .env.example .env      # fill in the values (see DEPLOYMENT.md)
pnpm dev                  # http://localhost:3000
```

Useful scripts:

| Script | What it does |
|---|---|
| `pnpm dev` | Run the app locally |
| `pnpm build` / `pnpm start` | Production build / serve |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | ESLint |
| `pnpm generate:types` | Regenerate Payload types after collection changes |
| `pnpm generate:importmap` | Regenerate the Payload admin import map |
| `pnpm seed` | Seed baseline content |

## Before opening a PR

Run the same checks CI runs:

```bash
pnpm typecheck && pnpm lint && pnpm build
```

- After changing any Payload collection, run `pnpm generate:types && pnpm generate:importmap` and commit the results.
- Never commit secrets. `.env` is gitignored — keep it that way.
- Fill in the PR template and link any related issue.

## Definition of done

- CI is green (typecheck, lint, build).
- The change is verified in the browser for the affected flow.
- Docs / `CHANGELOG.md` updated when behavior changes.
