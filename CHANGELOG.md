# Changelog

All notable changes to `@uekichinos/counter` are documented here.

## [0.1.15] - 2026-04-12
### Changed
- Moved all test files from `src/` to `src/__tests__/` — tests no longer co-located with source

### Added
- Expanded test suite from 44 to 62 tests
- `easing`: easeOut midpoint > 0.5, easeInOut midpoint symmetry, easeInOut slow-start, monotonic increase
- `format`: zero as integer/decimal, large comma-grouped value, decimal+commas mid-animation
- `parse`: number at string start/end, raw value preservation, multi-decimal count
- `animate-counter`: simultaneous multi-number animation, partial mid-animation values, easeInOut coverage
- `init-counters`: `data-counter-repeat="false"` override, mixed text content

## [0.1.14] - 2026-04-11
### Added
- `bugs` field pointing to GitHub issues
- `engines` field declaring Node.js >= 18 compatibility

## [0.1.13] - 2026-04-11
### Changed
- Updated socket.dev badge URL to use badge.socket.dev and always reflect latest version

## [0.1.12] - 2026-04-11
### Fixed
- `data-counter-duration` with non-numeric value no longer sets `NaN` duration
- Script tag example in README now uses correct IIFE bundle (`dist/index.global.js`)

### Added
- IIFE build (`dist/index.global.js`) — exposes `Counter` global for `<script>` tag usage
- Tests for `initCounters` — 8 new tests covering all data attribute overrides (44 total, up from 36)

### Improved
- Easing type narrowed from `Record<string, EasingFn>` to explicit union keys

## [0.1.11] - 2026-04-11
### Added
- `SECURITY.md` — vulnerability reporting policy
- `funding` field in `package.json` — GitHub Sponsors link

## [0.1.10] - 2026-04-08
### Changed
- Upgraded vitest 2.1.9 → 3.2.4 (vitest 4 skipped — requires Vite 6+)
- Added CI and Publish workflow with pinned action SHAs
- Added CHANGELOG.md

## [0.1.8] - 2026-04-08
### Added
- Socket.dev security badge in README

## [0.1.7] - 2026-04-08
### Fixed
- npm Automation token required for CI publishing (bypasses 2FA)

## [0.1.6] - 2026-04-08
### Fixed
- Made `tsconfig.json` self-contained, removed dependency on monorepo `../../tsconfig.base.json`

## [0.1.5] - 2026-04-08
### Fixed
- Removed `--frozen-lockfile` from CI (no standalone `pnpm-lock.yaml` in this repo)
- Removed `cache: pnpm` from `setup-node` action (caused lock file check failure)

## [0.1.4] - 2026-04-08
### Fixed
- Opted into Node.js 24 for GitHub Actions to suppress deprecation warnings

## [0.1.3] - 2026-04-08
### Added
- GitHub Actions publish workflow with npm provenance
- `repository` field linked to `github.com/uekichinos/counter`

## [0.1.2] - 2026-04-08
### Added
- `author` and `homepage` fields in `package.json`
- Normalized `repository.url` format

## [0.1.1] - 2026-04-08
### Improved
- Source maps excluded from published package (size: 36.6 KB → 16 KB)
- `prepublishOnly` script — auto build + test before every publish
- `prefers-reduced-motion` support — skips animation for users with motion sensitivity
- `onComplete` callback option
- `startValue` option — animate from a custom starting value instead of 0

## [0.1.0] - 2026-04-08
### Added
- Initial public release
- `animateCounter(el, options)` — animate a single element
- `initCounters(selector, options)` — declarative HTML setup via `data-counter`
- Per-element data attribute overrides: `data-counter-duration`, `data-counter-trigger`, `data-counter-repeat`
- Scroll-triggered animation via Intersection Observer (`trigger: 'scroll'`)
- Immediate animation (`trigger: 'immediate'`)
- Repeat on viewport re-entry (`repeat: true`)
- Preserves surrounding text and number formatting (commas, decimals) during animation
- Easing options: `linear`, `easeOut`, `easeInOut`
- ESM + CJS + TypeScript types
- 36 tests
