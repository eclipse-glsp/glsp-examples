---
name: update-workflow
description: Updates the GLSP workflow example in this repo to a new GLSP release by porting the release delta from the upstream dev examples. Interactive, human-in-the-loop. User-invoked only.
disable-model-invocation: true
---

# Update Workflow Example

Updates the `workflow/` example to a target GLSP release. This is **not** a trivial
bump-and-fix: the `workflow/` example is a **condensed fork** of the upstream dev
examples that live across the GLSP source repos. The job is to **port the release's
delta** from those upstream dev examples into this condensed fork, then do the
mechanical version bump.

This skill runs **in the main agent, no subagent — interactively, with a checkpoint
per target.** It involves real judgment; keep the human in the loop.

**Optional argument:** an explicit target version (e.g. `2.7.0`). If omitted, the
latest release is resolved automatically.

See [references/workflow-mapping.md](references/workflow-mapping.md) for the
target→upstream mapping, per-target filtering rules, and dependency order.

## Phase 1 — Resolve version & acquire upstream sources

1. **Resolve the target version:** explicit
   arg wins, else GitHub Releases API on `eclipse-glsp/glsp`
   (`https://api.github.com/repos/eclipse-glsp/glsp/releases/latest` → `tag_name`,
   strip leading `v`). Also note the umbrella **release body** changelog links —
   used as a secondary reference (below).
2. **Shallow-clone the 3 upstream repos** at the release tag into a temp dir
   (`/tmp/glsp-update-<version>/`): `glsp-client`, `glsp-server-node`,
   `glsp-theia-integration`. Also fetch the **previous** release tag in each (needed
   for the delta). Tag convention is `v<version>`; list tags and fall back to bare
   `<version>` if needed. Clean up the temp dir on success; leave it on failure.

## Phase 2 — Per-target porting (dependency order, checkpoint each)

Process targets **in dependency order**: `workflow-glsp` → `workflow-server` →
`workflow-theia` → `workflow-browser-app`. For **each** target:

1. **Compute the release delta** in the upstream example:
   `git diff <v_prev>..<v_new> -- <upstream example path>` (see mapping file). This
   delta is the work-list — pre-existing condensation differences are not in it.
2. **Classify each hunk** using the target's filtering rule (mapping file):
   `PORT` (applies to shared code or the variant this fork keeps) /
   `EXCLUDE` (scoped to a browser entry point or a connection variant this fork does
   not have — record the reason) / `UNCERTAIN` (needs human judgment). Read the full
   current upstream source only to adapt a hunk that doesn't map cleanly onto the
   local structure, and consult the changelog to interpret ambiguous hunks.
3. **Checkpoint — present the plan and pause for approval:** list what will be ported,
   what is excluded and why, and every `UNCERTAIN` item with a recommendation. Wait
   for the user to approve / adjust before editing.
4. **Apply** the approved changes to the local target. Run a **scoped compile**
   (e.g. `tsc -b` for that package) as an early signal. Then move to the next target.

## Phase 3 — Mechanical bump (after the source-merge)

After the source-merge, bump versions deterministically. The `workflow/` example is a
yarn + lerna workspace (node only — no Maven/Java/p2 here). Apply all of:

- **GLSP dependencies → target version, lockstep, exact-pinned** everywhere they
  appear: every `@eclipse-glsp/*` dep and devDep across the root `package.json`
  (`@eclipse-glsp/config`) and the four workspace `package.json`s — currently
  `@eclipse-glsp/client` (`workflow-glsp`), `@eclipse-glsp/server` +
  `@eclipse-glsp/layout-elk` (`workflow-server`), `@eclipse-glsp/theia-integration`
  (`workflow-theia`). **Include any NEW `@eclipse-glsp/*` deps** the source-merge
  introduced — set them to the target version too.
- **Each package's own `version` → target version, lockstep:** root `package.json`,
  `lerna.json`, and all four workspace `package.json`s (`@eclipse-glsp-examples/*`).
  Note the workspaces also reference each other by version (e.g. `workflow-theia`
  depends on `workflow-glsp`/`workflow-server`) — bump those inter-package refs too.
- **Leave unrelated third-party deps alone** (theia, webpack, lerna, typescript,
  `@types/node`, …) unless a changelog explicitly mandates a change.
- **Env / README:** if the changelog raises the minimum **Node**, update both
  `engines.node` (root `package.json`) and the matching README prerequisite line,
  keeping them consistent. Flag other README staleness rather than editing it.

## Phase 4 — Final build & report

1. **Authoritative gate:** full root `yarn install && yarn build` (the `prepare` step
   also runs `check:theia-version`). Use the **iterative diagnose→fix→rebuild loop**;
   a failed build is the start of a fix loop, not a stop. Because this is
   human-in-the-loop, **escalate genuinely ambiguous failures to the user** instead of
   looping blindly. `STOPPED` only if the toolchain (node/yarn) is unavailable.
   **Success = the full build passes.**
2. **No git operations** — leave everything in the working tree for the user to review
   and commit. Produce a report: per target — hunks ported, hunks excluded (+reason),
   `UNCERTAIN` items and how they were resolved; version/env/README bumps; final build
   status; and the temp-clone path (note if it was left behind on failure).
