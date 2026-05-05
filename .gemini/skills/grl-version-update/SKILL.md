---
name: grl-version-update
description: Synchronize the GRL fork with the latest upstream release by cherry-picking GRL-specific commits onto a new version branch.
---

# GRL Version Update Workflow

This skill automates the process of creating a new version branch for the GRL fork based on the latest upstream (origin) release, ensuring custom branding and logic are preserved.

## Prerequisites

- Git remotes `origin` (upstream: tariknz/irdashies) and `blyn` (fork: brandonlyn/irdashies) must be configured.
- A valid `GITHUB_TOKEN` must be present in a `.env` file in the project root.

## Automated Workflow

### 1. Fetch & Identify Target

1. Run `git fetch --all --tags`.
2. Identify the latest version tag from `origin` (upstream).
3. Identify the specific GRL commits to be preserved:
   - "chore: Update repository to GRL fork"
   - "feat: Add GRL badge to standings/relative"
   - "chore: Update readme with GRL Badge information"

### 2. Update Main branch

1. Checkout `main` branch from `origin`
2. Cherry-pick the "chore: Update readme with GRL Badge information"
3. Push `main` to `brandonlyn` fork

### 3. Prepare Version Branch

1. Create a new branch from the latest upstream tag, named `grl-badge-<versionTag>`:
   `git checkout -b grl-badge-[versionTag] [versionTag]`
   _Example: `git checkout -b grl-badge-v0.3.2 v0.3.2`_

### 4. Cherry-pick GRL Commits

1. Cherry-pick the identified GRL commits onto the new branch.
2. **Conflict Resolution Strategy**:
   - Resolve conflicts automatically where possible.
   - **Branding Priority**: Preserved GRL changes for UI components, `package.json` repository fields, and `forge.config.ts` publisher settings.
   - **Logic Priority**: Favor upstream changes for core application logic.
   - If conflicts are hit, attempt to resolve them and provide a summary of affected files. If a conflict is too complex for automatic resolution, call out the issue to the user.

### 5. Validation & Publish

1. Run `npm run lint` to ensure structural integrity and adherence to project standards.
2. If linting passes, run `npm run publish` to build and upload the release to the `brandonlyn` fork.
3. Once published and verified, the user may choose to merge this branch or push it to the fork's repository.

## Troubleshooting

- **Missing GITHUB_TOKEN**: Ensure `.env` is present in the root directory.
- **Upstream Tag Not Found**: Verify that the `origin` remote is correctly configured and the fetch was successful.
- **Cherry-pick Failures**: If automatic resolution fails significantly, stop and ask the user for manual intervention.
