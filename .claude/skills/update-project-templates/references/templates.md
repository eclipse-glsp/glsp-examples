# Project-Template Manifest

Per-template static data for `update-project-templates`. Paths are relative to the repo
root. **Verify each entry against the actual files before editing** and flag drift —
this manifest can go stale if the repo is restructured.

All GLSP deps and each project's own `version` are currently pinned in lockstep
(`2.6.0` at time of writing). Bump both to the target version.

---

## `node-json-theia` — `project-templates/node-json-theia`

-   **Build:** `yarn install && yarn build` (root `package.json`; also a `prepare`).
-   **Toolchain:** node (`>=20`), yarn.
-   **Components / changelogs:** `client`, `server-node`, `theia-integration`.
-   **GLSP deps (npm, exact-pinned):**
    -   root `package.json`: `@eclipse-glsp/config` (devDep)
    -   `tasklist-glsp-client/package.json`: `@eclipse-glsp/client`
    -   `tasklist-glsp-server/package.json`: `@eclipse-glsp/server` (devDep)
    -   `tasklist-theia/package.json`: `@eclipse-glsp/*` (theia-integration etc.)
-   **Own version:** root + `lerna.json` + every workspace `package.json`
  (`tasklist-glsp-client`, `tasklist-glsp-server`, `tasklist-theia`,
  `tasklist-browser-app`).
-   **Env:** `engines.node` (root). README prerequisite: `Node.js >=20`.

## `node-json-vscode` — `project-templates/node-json-vscode`

-   **Build:** `yarn install && yarn build` (root `package.json`).
-   **Toolchain:** node (`>=20`), yarn.
-   **Components / changelogs:** `client`, `server-node`, `vscode-integration`.
-   **GLSP deps (npm):**
    -   root `package.json`: `@eclipse-glsp/config` (devDep)
    -   `tasklist-glsp-client/package.json`: `@eclipse-glsp/client`
    -   `tasklist-glsp-server/package.json`: `@eclipse-glsp/server`
    -   `tasklist-vscode/webview/package.json`, `tasklist-vscode/extension/package.json`:
    `@eclipse-glsp/*` (vscode-integration etc.)
-   **Own version:** root + `lerna.json` + workspaces (`tasklist-glsp-server`,
  `tasklist-glsp-client`, `tasklist-vscode/webview`, `tasklist-vscode/extension`).
-   **Env:** `engines.node` (root). README prerequisite: `Node.js >=20`.

## `java-emf-eclipse` — `project-templates/java-emf-eclipse`

-   **Build:** `yarn install && yarn build` (root → `build:client` = yarn install of
  `glsp-client`; `build:server` = `cd glsp-server && mvn --batch-mode clean verify`).
  The client `prepare`/`copyClient` regenerates the committed
  `glsp-server/org.eclipse.glsp.example.javaemf.editor/diagram/bundle.js` etc. — that
  is expected output of a passing build.
-   **Toolchain:** node, yarn, **`mvn` + Java 17**, network to `download.eclipse.org`
  (Tycho resolves a p2 target platform).
-   **Components / changelogs:** `client`, `eclipse-integration` (ide), java/emf server
  (delivered via p2, not Maven coords).
-   **GLSP version locations:**
    -   TS client: `glsp-client/package.json` (+ `tasklist-glsp/`, `tasklist-eclipse/`,
    and `@eclipse-glsp/config`).
    -   **p2 target (GLSP-only edit):** `glsp-server/org.eclipse.glsp.example.javaemf.target/r2025-12.target`
    **and** `.../r2025-12.tpd` — update **only** the two GLSP p2 release URLs:
    `download.eclipse.org/glsp/server/p2/releases/<version>` and
    `download.eclipse.org/glsp/ide/p2/releases/<version>/`.
    -   **Do NOT** touch Eclipse-platform / EMF / Jetty / ELK / Jakarta unit versions or
    rename the `r20XX-YY` target — Eclipse release train, separate concern. Flag any
    required baseline bump.
-   **Own version:** TS client `package.json`s + all poms `<version>`
  (parent + `org.eclipse.glsp.example.javaemf.{server,editor,target}` poms).
-   **Env:** `java.source`/`java.target` in poms (currently 17). README prerequisites:
  `Node.js >=20`, `Java >=21` (note: README says 21 but poms compile 17 — pre-existing
  mismatch; flag, do not silently "fix" as part of a GLSP update).

## `java-emf-theia` — `project-templates/java-emf-theia`

-   **Build:** `yarn install && yarn build` (root → `build:server` =
  `cd glsp-server && mvn --batch-mode clean verify`; `build:client` = yarn install of
  `glsp-client`).
-   **Toolchain:** node, yarn, **`mvn` + Java 17** (Maven shade build, no p2/Tycho).
-   **Components / changelogs:** `client`, `theia-integration`, java/emf server.
-   **GLSP version locations:**
    -   Maven: `glsp-server/pom.xml` → `<glsp.version>` property (drives the
    `org.eclipse.glsp.*` artifacts).
    -   TS client: `glsp-client/package.json` (+ `tasklist-glsp/`, `tasklist-theia/`,
    `tasklist-browser-app/`, and `@eclipse-glsp/config`).
-   **Own version:** TS client `package.json`s + `glsp-server/pom.xml` `<version>`.
-   **Hardcoded server-jar filename** (`org.eclipse.glsp.example.javaemf-<version>-glsp.jar`,
  not build-validated — bump in lockstep with the pom):
    -   `glsp-client/tasklist-theia/src/node/glsp-server-contribution.ts` (`JAR_FILE`)
    -   `glsp-server/.vscode/tasks.json` (`java -jar` task)
-   **Env:** `java.source`/`java.target` (pom). README prerequisites: `Node.js >=20`,
  `Java >=21` (same pre-existing 21-vs-17 mismatch; flag only).
