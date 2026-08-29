# Contributing to Dr. Habibi

Welcome to the internal development guide for the Dr. Habibi platform. This document outlines the standards and processes for contributing to the codebase. As this is a proprietary project, these guidelines apply to internal team members and authorized developers.

## Local Development Environment

To set up your local development environment, please follow the instructions in the [README.md - Running Locally](./README.md#running-locally) section. This covers:
- Installing dependencies for both frontend and backend
- Setting up the PostgreSQL database and S3 storage
- Configuring the required environment variables (`.env.local` and `server/.env`)
- Running the frontend and backend servers locally

## Branch Naming Convention

We organize our work using standard prefixes based on the nature of the changes. Please name your branches using the following format:
`prefix/short-description`

Acceptable prefixes:
- `feat/`: For new features
- `fix/`: For bug fixes
- `chore/`: For maintenance, configuration, and structural changes
- `docs/`: For documentation updates

Examples:
- `feat/coach-portal-integration`
- `fix/patient-assignment-logic`
- `chore/setup-security-hygiene`

## Commit Message Convention

We strictly follow the [Conventional Commits](https://www.conventionalcommits.org/) standard. This helps us maintain a clean and readable history.

**Format:**
```
<type>: <subject>
```

**Common Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `chore`: Updating grunt tasks etc; no production code change
- `docs`: Changes to the documentation
- `test`: Adding missing tests, refactoring tests; no production code change

**Real Examples from our history:**
- `feat: integrate Patient Portal UI with backend APIs`
- `fix: scope root tsconfig to frontend src directory`
- `chore: add license, comprehensive readme, and gitignores`
- `docs: generate accurate README based on codebase`

## Pull Request Process

All code changes should be proposed via Pull Requests (PRs) targeting the `main` branch.

1. **Keep it focused:** Ensure your PR addresses a single concern (feature, fix, etc.).
2. **Use the PR Template:** When you open a PR, a template will automatically populate. Please fill it out entirely.
3. **Pass the Checklist:** Complete all items in the PR checklist before requesting a review:
   - Ensure local tests and linting pass.
   - Verify no secrets are hardcoded.
   - If adding environment variables, update `.env.example`.
   - Explicitly note any changes to patient data handling in your PR description.
4. **Code Review:** Assign a team member for review. Address any feedback promptly.
5. **Merge:** Once approved and all CI checks (if any) pass, you may merge your PR. Use "Squash and merge" if your commit history is messy, or "Rebase and merge" if your commits are atomic and follow the convention.
