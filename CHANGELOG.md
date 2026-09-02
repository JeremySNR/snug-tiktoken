# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2026-09-02

### Added

- `freeEncoders()` to release cached tiktoken encoders and their WASM memory.
- `CHANGELOG.md` and a GitHub Actions CI workflow (test and build on Node 20).
- `homepage`, `bugs`, `sideEffects: false` and `engines.node >= 18` in `package.json`.

### Changed

- Encoders are now cached in a module-level map keyed by model or encoding instead of being created and freed on every `fit()` call.
- Accepts `@jeremysnr/snug` 0.1.x or 0.2.x (`>=0.1.0 <0.3.0`). Nothing here needs the 0.2.0 additions yet.
- Documentation no longer claims the default encoding is accurate for Anthropic models, or that `gpt-4o` uses `cl100k_base`. The default with no `model` is `cl100k_base`; pass `model` for the exact OpenAI encoding (`gpt-4o` uses `o200k_base`); counts for Anthropic models are approximate because Claude has its own tokenizer.

## [0.1.1] - 2026-04-06

Initial release, published to npm as `@jeremysnr/snug-tiktoken`. The repository history begins at this version.

### Added

- `fit(items, options)` wrapping `@jeremysnr/snug` with a tiktoken tokenizer, with an optional `model` to select the encoding.

[Unreleased]: https://github.com/JeremySNR/snug-tiktoken/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/JeremySNR/snug-tiktoken/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/JeremySNR/snug-tiktoken/releases/tag/v0.1.1
