# Motion styles

Poffy UI separates whether animation may run from the visual character of that
animation. Configure the initial character at the application root.

```tsx
<ThemeProvider defaultMotionStyle="subtle">
  <App />
</ThemeProvider>
```

## Styles

| Style      | Intended character                                                                                   |
| ---------- | ---------------------------------------------------------------------------------------------------- |
| `subtle`   | Smaller transforms, shorter finite transitions, and more damping. Suitable for dense or professional interfaces. |
| `standard` | The compatible default motion character.                                                             |
| `pop`      | Larger transforms and a more responsive spring character. Suitable for playful product surfaces.     |
| `none`     | Disables application animation.                                                                      |

The operating-system `prefers-reduced-motion: reduce` setting always resolves to
`none`, even when the application requests another style. Applications may also
use `setAnimationEnabled(false)` for an accessibility preference.

`useAnimation()` exposes the selected `motionStyle`, the accessibility-resolved
`resolvedMotionStyle`, and `setMotionStyle(style)`. The selection persists for a
global provider. Use `global={false}` for embedded trees that must not write to
the document or browser storage.

Use one global provider at the application root. If global providers overlap
temporarily during migration, the most recently created active provider owns
the document motion attributes; this is creation order rather than DOM nesting
depth. Overlap remains unsupported as an application configuration because it
represents competing global preferences.

Global providers restore the document attributes they replaced when their last
owner unmounts. Treat those attributes as exclusively owned while a provider is
active: external writes to the same `<html>` attributes may be overwritten by
that restoration. Persisted preferences are deliberately restored after
hydration so server and first client markup match. For the global provider's
initial defaults, render matching `<html>` attributes from the server:

```tsx
import { getInitialMotionAttributes } from '@poffy-ui/react/ssr';

<html {...getInitialMotionAttributes({ defaultMotionStyle: 'subtle' })}>
```

The helper intentionally uses only provider defaults. Persisted preferences and
the OS preference are client-only and may update these attributes after hydration.

## Scoped trees and portals

`ThemeProvider global={false}` creates a local theme and motion boundary. Nested
boundaries are supported: the nearest boundary determines the CSS motion profile,
including when it is `standard`. Portalled Poffy overlays and feedback content
carry that local boundary into their portal destination, so a scoped widget does
not inherit a profile from the surrounding document.

`AnimationProvider global={false}` stays DOM-free. Pass `scope` only when a
low-level embedded tree also needs CSS recipe profiles; the opt-in adds a neutral
DOM boundary. Prefer `ThemeProvider global={false}` when the embedded tree needs
the complete brand, color mode, locale, direction, and motion scope.

Nested CSS profile resolution uses CSS `@scope`, available across the latest
major browsers since late 2025. Older browsers keep each recipe's standard
timing; when motion is disabled, Poffy UI applies a hydration-time safety
fallback that stops CSS animation and transitions for the scoped tree.
On those older browsers, a disabled outer scope remains disabled even when an
inner provider enables motion; this intentionally favors the accessibility
preference over a partial CSS re-enable.

For a global provider, a valid saved user selection takes precedence after
hydration; before then, `defaultMotionStyle` is used so server and client markup
remain deterministic. `defaultMotionStyle` changes after mount are not controlled
updates. Invalid saved values are ignored.

## Component behavior

An explicit component `animationType` continues to choose its semantic family:
a dialog remains a dialog transition, and a disclosure remains a disclosure
transition. Motion style changes only the magnitude, timing, and spring
character. This prevents an application-wide style from changing the meaning of
a component animation.

`none` and OS reduced-motion take precedence over every style. Components must
remain usable when transitions are omitted; animation cannot be required to
discover content, complete an action, or access a control.

Finite interactions become smaller and shorter in `subtle`. Continuous
decorative effects stop in `subtle`; loading and status loops instead run more
slowly in `subtle` and more quickly in `pop`. Loading indicators retain their
static status semantics when motion is disabled.
