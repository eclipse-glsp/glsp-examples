# Workflow Example → Upstream Dev-Example Mapping

The `workflow/` example is a **condensed fork** of the upstream dev examples. This
skill ports the **release delta** (`git diff <v_prev>..<v_new>`) from each upstream
example into the corresponding local package, filtered by the per-target rule below.

**Verify upstream paths against the cloned repos before diffing** — upstream example
locations can move between releases. If a path has changed, find the workflow example
subtree and note the drift.

**Dependency / processing order:** `workflow-glsp` → `workflow-server` →
`workflow-theia` → `workflow-browser-app` (`theia` and `browser-app` depend on the
first two).

All local packages live under `project-root/workflow/`. Local GLSP deps and each
package's own `version` are pinned in lockstep (e.g. `2.6.0`).

---

## `workflow-glsp` (client diagram)

-   **Upstream:** `eclipse-glsp/glsp-client`, dev example `examples/workflow-glsp`.
-   **Local:** `workflow/workflow-glsp` (deps: `@eclipse-glsp/client`).
-   **Filter rule:** apply the delta **~wholesale** — the local client is a near-faithful
  subset. Port all hunks; only adapt paths/imports if the local file layout differs.

## `workflow-server` (node server)

-   **Upstream:** `eclipse-glsp/glsp-server-node`, dev example `examples/workflow-server`.
  Upstream is a **combined server with both browser AND node entry points**.
-   **Local:** `workflow/workflow-server` (deps: `@eclipse-glsp/server`,
  `@eclipse-glsp/layout-elk`). Carries only the **node/common** subset (e.g.
  `index.ts`, `app.ts`, diagram module/config, handlers, graph extension).
-   **Filter rule:** PORT hunks in **shared/common modules + the node entry point**;
  EXCLUDE hunks scoped to the **browser entry point** and browser-only wiring.
  The split is largely **by file** — port deltas to files that exist locally, plus any
  **new node/common files**; exclude browser entry-point files. If a shared file
  intermixes browser+node concerns, fall to per-hunk judgment (→ `UNCERTAIN`).

## `workflow-theia` (Theia integration)

-   **Upstream:** `eclipse-glsp/glsp-theia-integration`, dev example
  `examples/workflow-theia`. Upstream configures **multiple connection variants**
  (node-process + socket, websocket, direct websocket, integrated, …).
-   **Local:** `workflow/workflow-theia` (deps: `@eclipse-glsp/theia-integration`,
  local `workflow-glsp` + `workflow-server`). Has **exactly one** connection type:
  node-process + socket (`WorkflowGLSPSocketServerContribution` extending
  `GLSPSocketServerContribution`, bound in `src/node/workflow-backend-module.ts`).
-   **Filter rule:** PORT hunks affecting **shared code + the socket / node-process
  variant**; EXCLUDE hunks scoped **only** to the other variants (websocket, direct
  websocket, integrated). Excluded-but-nontrivial variant changes are **surfaced**
  to the human, not silently dropped.

## `workflow-browser-app` (Theia browser app)

-   **Upstream:** `eclipse-glsp/glsp-theia-integration`, the example browser-app
  (e.g. `examples/browser-app`).
-   **Local:** `workflow/workflow-browser-app` (deps: local `workflow-theia`;
  webpack / gen-webpack configs, Theia app bootstrap).
-   **Filter rule:** mostly **mechanical** (webpack/gen-webpack, Theia app config). PORT
  the delta; apply the same **socket/node-process-only** filtering wherever it wires
  connection variants.

---

## Cross-cutting

-   The **mechanical** version/dep/env/README bump (run **after** the source-merge, so
  new deps/files are covered) is spelled out in Phase 3 of `SKILL.md`: lockstep-bump
  all `@eclipse-glsp/*` deps **and** every package's own `version`
  (root + `lerna.json` +   the four workspaces + inter-package refs) to the target; include new GLSP deps the
  merge introduced; leave unrelated third-party deps alone unless the changelog
  mandates; sync changelog-driven `engines.node` + README prerequisites.
-   **Changelogs** (umbrella release body links) are a **secondary** reference: interpret
  ambiguous hunks, drive env bumps, and final cross-check that no breaking change was
  missed. The source delta is the primary engine.
