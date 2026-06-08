---
name: update-project-templates
description: Updates the GLSP project-templates in this repo to a new GLSP release. User-invoked only.
disable-model-invocation: true
---

# Update Project Templates

Updates this repo's 4 `project-templates/` to a target GLSP release. (The
`workflow/` example has its own dedicated `update-workflow` skill — it is not a
target here.)

**Scope:** the 4 `project-templates/` — `node-json-theia`, `node-json-vscode`,
`java-emf-eclipse`, `java-emf-theia`. See [references/templates.md](references/templates.md).

**Optional argument:** an explicit target version (e.g. `2.7.0`). If omitted, the
latest release is resolved automatically.

## Phase 1 — Discovery (do this once, yourself)

1. **Resolve the target version.** If the user passed an explicit version, use it
   verbatim. Otherwise call the GitHub Releases API for the latest release of the
   umbrella repo and strip any leading `v`:
   `WebFetch https://api.github.com/repos/eclipse-glsp/glsp/releases/latest` → `tag_name`.
   No npm cross-check.
2. **Get the changelog links.** Fetch the umbrella **release body** (same API
   response, `body` field). It contains links to the individual component repos'
   changelogs. Extract them.
3. **Assemble the release context**: `targetVersion`, the changelog URLs, and the
   per-template component→repo map from [references/templates.md](references/templates.md).

Only the **target release's** changelog matters — examples are updated every release,
so the gap is always exactly one release. Do not compute a "from" version.

## Phase 2 — Fan-out (4 parallel subagents)

Spawn **4 `glsp-template-updater` subagents in parallel — one per template**, in a
single message. Hand each the release context plus its `templateId`, `templatePath`,
relevant `components`, and `changelogUrls`. Add any per-template note as extra
instructions. The subagents edit + verify only; **they run no git commands**.

Cross-cutting rules the subagents enforce (already in the agent definition, restated
here so you can sanity-check their reports):
- **Success = the template's own build passes.** A failed build triggers an
  iterative diagnose→fix→rebuild loop in the subagent; `FAIL` is reported only after
  reasonable fix attempts are exhausted, never after a single failed build.
- **Stop a template entirely if its required toolchain is missing** (`mvn`/`java 17`
  for java templates, `yarn`/`node` for all) — reported as `STOPPED`, no edits.
- GLSP deps **and** the project's own version bump in lockstep to `targetVersion`;
  unrelated third-party deps are left alone unless a changelog mandates a change.

## Phase 3 — Synthesis (you)

**Do no git operations.** Leave all changes in the working tree for the user to
review and commit. Collect the per-template reports into one consolidated summary:

- Top line: **N/4 built successfully**.
- Per template: `from → to`, GLSP deps bumped, own-version bumped (y/n), mechanical
  migrations applied, **needs-review** items (with changelog refs), env/README
  changes, **build status** (`PASS` / `FAIL` + excerpt / `STOPPED` + missing tool).
- A consolidated **flags** section: manifest drift, required Eclipse/EMF baseline
  bumps, and pre-existing inconsistencies the subagents noticed.

Make non-`PASS` builds and needs-review items impossible to miss.
