# 🤝 Contributing to AWS Self-Healing Platform

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Code Style & Linting](#code-style--linting)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Bug Reports](#bug-reports)
- [Feature Requests](#feature-requests)
- [Testing](#testing)
- [Documentation](#documentation)

---

## Code of Conduct

This project adheres to the [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

---

## How Can I Contribute?

### Reporting Bugs

See [Bug Reports](#bug-reports) below.

### Suggesting Features

See [Feature Requests](#feature-requests) below.

### Contributing Code

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting
5. Commit with a descriptive message
6. Push to your fork
7. Open a Pull Request

---

## Development Setup

### Prerequisites

- Node.js v20+
- npm v10+

### Setup

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/aws-self-healing-platform.git
cd aws-self-healing-platform

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## Code Style & Linting

This project uses **TypeScript** with **ESLint** (flat config) for code quality.

### Key Rules

- **Immutability**: Never mutate objects/arrays in place — always return new copies
- **Types**: Explicit types on public APIs; `interface` for object shapes, `type` for unions
- **No `any`**: Use `unknown` for untrusted input, then narrow safely
- **No `console.log`**: Use proper logging in production code
- **File size**: Keep files under 800 lines; extract utilities from large modules
- **Functions**: Keep functions small and focused (<50 lines)
- **Nesting**: Avoid deep nesting beyond 4 levels

### Running the Linter

```bash
npm run lint
```

---

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>: <description>

<optional body>
```

### Types

| Type | Use When |
|------|----------|
| `feat` | Adding a new feature |
| `fix` | Fixing a bug |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `docs` | Documentation-only changes |
| `test` | Adding or updating tests |
| `chore` | Build process or auxiliary tool changes |
| `perf` | Performance improvement |
| `ci` | CI/CD configuration changes |
| `revert` | Reverting a previous commit |

### Examples

```
feat: add RDS read replica monitoring page

fix: correct CPU threshold comparison in alarm evaluator

docs: update deployment steps for us-west-2 region

refactor: extract metric history trimming into utility function
```

---

## Pull Request Process

1. **Update documentation** — If your change affects the UI, API, or architecture, update the relevant docs
2. **Add tests** — New features should include appropriate tests
3. **Run linting** — Ensure `npm run lint` passes with no errors
4. **Build successfully** — Ensure `npm run build` completes without errors
5. **Reference issues** — Link any related issues in your PR description (e.g., `Fixes #42`)
6. **Fill out the PR template** — Use the provided pull request template
7. **Request review** — At least one maintainer review is required

### PR Title Format

Follow the same convention as commit messages: `type: description`

---

## Bug Reports

Before creating a bug report, please:

1. **Search existing issues** to avoid duplicates
2. **Use the bug report template** when creating a new issue

A good bug report includes:

- **Summary**: Clear, concise description of the problem
- **Steps to Reproduce**: Numbered list of exact steps
- **Expected Behavior**: What you expected to happen
- **Actual Behavior**: What actually happened
- **Environment**: OS, browser, Node.js version, relevant config
- **Logs**: Relevant error messages or console output
- **Screenshots**: If applicable
- **Severity**: How critical is this bug?

---

## Feature Requests

Feature requests are welcome! Please use the feature request template and include:

- **Problem Statement**: What problem are you trying to solve?
- **Proposed Solution**: Your idea for addressing it
- **Alternatives Considered**: Other approaches you've thought about
- **Scope**: What's in scope and out of scope
- **Risks**: Any potential downsides or complications

---

## Testing

While this project currently focuses on simulation, we encourage adding tests for:

- **Utility functions** (e.g., metric calculations, data transformations)
- **Type guards and validation**
- **Simulation engine logic** (alarm evaluation, recovery workflows)

When adding tests:

1. Write tests first (TDD approach)
2. Place test files alongside source files as `*.test.ts`
3. Aim for 80%+ coverage on new code

---

## Documentation

When making changes, please update:

- **README.md** — If you add new features, dependencies, or change setup steps
- **infrastructure/README.md** — If you modify CloudFormation templates
- **steps.md** — If you change the AWS deployment process
- **Code comments** — For non-obvious logic (why, not what)
