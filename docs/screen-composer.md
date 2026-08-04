# Screen Composer Contract

`@poffy-ui/behavior/screen-composer` validates a serializable screen document.
`@poffy-ui/react/screen-composer` renders only a document accepted by that
validator. The host explicitly composes Core, Tier, and application extensions.

## Trust boundary

A persisted document is data, not a program. It may contain bounded JSON values
only. It must not contain data-fetching URLs, credentials, SQL, GraphQL,
JavaScript, an expression language, import/implementation names, raw CSS, or an
assertion that a caller is authorized. Core node definitions must never interpret
props as those values. A future validated link node may still carry a display
destination as ordinary data.

| Layer | Owns                                                                      | Does not own                                  |
| ----- | ------------------------------------------------------------------------- | --------------------------------------------- |
| Core  | schema limits, node/renderer compatibility, action callback contract      | data access, authorization, side effects      |
| Tier  | tier node props, validators, trusted renderers                            | host credentials or authorization integration |
| Host  | authorization, data loading/normalization, action allowlist and execution | executing a document-provided program         |

`actionId` is an opaque declaration. Before acting, the host must authorize the
current user and current target again. Hosts must project only already-authorized
data into screen props.

## Explicit extension composition

Passing an extension array replaces the default Core-only registry. Hosts include
the Core extensions themselves, then only installed Tier/application extensions.
Each namespace has one owner; only `core` is reserved for Core. Other namespaces
are owned by the trusted extension explicitly composed by the host. A node renderer
must have the same owner, type, and version as its definition.

## Deferred capabilities

Data binding, form state, and arbitrary responsive/CSS values are intentionally
not part of the first contract. Core provides only these bounded node types:

- `core.stack`: optional `direction` (`column` or `row`), `gap` (a documented
  spacing token), and `align` (`flex-start`, `center`, `flex-end`, or `stretch`).
- `core.grid`: responsive by default, using an optional bounded
  `minChildWidth` token (`sm`, `md`, or `lg`; default `md`) and optional
  bounded `gap`. Set `mode` to `fixed` together with an integer `columns` from
  1 through 12 only when the column count must remain fixed. Version 1
  documents that predate `mode` remain compatible: a document containing
  `columns` without `mode` retains its original fixed-grid meaning.
- `core.section`: an optional string `title` and child nodes. Its renderer uses
  a supplied title as an `h2`.
- `core.text`: a required string `text` value.
- `core.action`: required non-empty `actionId` and `label` strings. The
  `actionId` is opaque and is authorized and handled by the host.
- `core.link`: required non-empty `label` and a validated navigation `href`.
  An optional `external` boolean is the only new-tab control and forces safe
  `noopener noreferrer` behavior.

All Core node props must be plain JSON objects and reject unknown keys. Layout
nodes never accept `className`, `style`, arbitrary Panda props, CSS lengths,
templates, or breakpoint objects.

`core.link` permits same-origin relative paths and fragments plus `http:` and
`https:` destinations. It rejects script/data/protocol-relative URLs and raw
`target`, `rel`, `download`, `ping`, or router props. Navigation safety does not
authorize a tenant route or external domain; the host applies that policy before
publishing a user-authored template. Host allowlists must parse a validated URL,
not prefix-match its string. Images remain deferred: their persisted form must
be a host-authorized asset reference rather than a raw fetching URL.

- A future binding feature must use a small, host-resolved reference AST rather
  than expressions. Resolution, type checks, loading/error behavior, and secret
  access remain host-owned. Resolution creates a fresh document from
  host-authorized data without mutating the persisted source; that document is
  then validated normally.
- A future form feature must use a host controller for values, dirty/touched
  state, validation, submission, retries, and focus management. Core/Tier
  packages must not require a form-library runtime.
- Future layout nodes must expose only validated enums and bounded scalar values;
  they must not accept arbitrary Panda props, CSS objects, or breakpoints.

## Persistence and migration

The current document envelope is version 1 and is intentionally fail-closed:
only the current document and node versions render. Introduce migrations in the
same release that first changes a persisted schema, not speculatively.

When needed, Core will own document-envelope orchestration; each extension will
own synchronous, side-effect-free migrations for its node types. Migrations must
be adjacent-version steps, preserve an id unless an explicit replacement is
declared, revalidate bounded JSON before and after every step, and fail closed on
an unknown type, missing path, or exception. The host composes Core, Tier, and
application migrations in the same explicit order as extensions.

## Templates and diagnostics

Template lifecycle is host-owned. Keep `ScreenDocument` as the portable render
body; the host persistence envelope owns a template id, revision, draft/published/
archived status, audit metadata, and the required extension versions. A draft may
be incomplete. On publish, the host validates the revision server-side with its
explicitly composed registry and records the result. A migration creates a new,
auditable revision; it never silently rewrites a published revision.

Diagnostics are also host-owned. Hosts may record sanitized issue codes, counts,
document/extension versions, and action outcomes from registry results,
`ScreenSchemaIssue`, and `renderFallback`. They must not automatically log a raw
document or props because those can contain user or business data. Core remains
side-effect-free and emits no telemetry by default.

Template editing and publishing are authorization operations, not schema
operations. The host authenticates the editor/publisher, scopes the template and
registry to its tenant/license, and audits each revision transition. Schema
validation proves only structure. It does not authorize editing, publishing, or
an action. At runtime, the host maps an opaque action id to a fixed handler,
derives targets from trusted current context rather than node props, and
reauthorizes on the server immediately before execution.

For checked-in templates, application/Tier CI composes its exact schema and
renderer extensions, requires both registries to succeed, and calls
`validateScreenDocument` for every template. Report the returned path, code, and
message in controlled CI/development output without logging raw props. Production
diagnostics store sanitized codes and counts because a trusted extension validator
could include a prop value in its message. `defineScreen` and TypeScript
`satisfies` improve authoring ergonomics only; they do not replace runtime
validation.

Editor metadata is not part of a node definition or renderer extension. A future
editor needs a separate, optional `ScreenEditorExtension` contract so headless
display consumers do not import authoring concerns. That host must apply palette
and permission policy itself and revalidate after every edit.

## Localization and accessibility

The host owns locale selection, catalogs, plural/date/number formatting, and RTL
direction. It passes localized, authorized display strings to the document;
Composer does not introduce a message-id runtime or ICU dependency. Generic Core
nodes do not accept arbitrary `aria-*`, `role`, `id`, `lang`, or `dir` props.

Every Core and Tier node definition/renderer must document and test its
accessible-name source, semantic structure, keyboard behavior, and focus-visible
behavior with `vitest-axe`. `core.section` uses its optional title as an `h2`;
the surrounding host owns page title, a single `h1`, landmarks, and focus after a
host action. Any future language, direction, focus, or ARIA override needs an
explicit validator-backed node prop and renderer behavior.

## Versioning and releases

The composer is a public Core package contract. Before 1.0, a Core minor release
is the compatibility boundary for its schema/renderer API. Publish Core first;
then Tier packages that expose composer extensions must declare the released Core
minimum version directly, run a packed-consumer integration test, and publish.

Runtime theme overrides may change existing `--poffy-*` values. They do not
register Panda tokens. Applications own `--poffy-app-*`; Tier packages should use
Core semantic tokens by default and add a Tier system package only when a shared
Tier token is genuinely needed.
