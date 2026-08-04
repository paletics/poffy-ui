# Poffy UI Animations (`src/components/animations`)

**Tier:** Infrastructure / Core Architecture

The `animations` directory contains the foundational kinetic engine for the Poffy UI design system. To maintain strict visual cadence and protect DOM performance, Framer Motion's `motion.*` tags should not be used directly in surface, layout, or component implementation files. Use the polymorphic wrappers in this directory instead.

## Core Philosophy

Motion timing, scale, and offsets should come from the shared animation presets and system tokens. Do not hardcode pixel distances or one-off timing curves inside individual components when an existing preset covers the interaction.

## Motion Policy

- `MotionProvider` maps `AnimationProvider` state into Motion's native `MotionConfig reducedMotion` policy.
- `isAnimating=true` uses `reducedMotion="user"` so Motion respects the OS `prefers-reduced-motion` setting.
- `isAnimating=false` uses `reducedMotion="always"` so app-level animation settings force reduced motion.

## Global motion styles

`AnimationProvider` also supplies a resolved motion style: `subtle`, `standard`,
`pop`, or `none`. Motion primitives with variants or transitions must read
`useOptionalAnimation()` and pass them through `applyMotionStyle`. Dedicated
loading paths follow the documented loading profile timings. The `none` style
must omit motion props entirely rather than relying on MotionConfig, because
opacity transitions are otherwise still permitted by Motion. Continuous
decorative effects are static under `subtle`; loading indicators may render a
static indicator when motion is disabled.
- Components that must completely stop work beyond Motion's reduced-motion behavior, such as drag gestures, infinite loops, manual counters, text splitting, SVG path drawing, and keyed indicator swaps, also read optional animation state directly.

## Controlled wrapper props

Poffy transition wrappers own Motion drivers such as `animate`, `variants`,
`transition`, gesture states, layout, and drag. These props are intentionally
not forwarded from wrapper callers, so an application-wide `none` or reduced
motion preference cannot be bypassed. Use a direct `motion.*` element only when
an independent child animation is deliberately outside the wrapper's preset
contract; `asChild` does not suppress motion authored by that child itself.

## Visual Testing

Visual regression tests should cover stable rendered states. Do not use screenshots as proof that motion occurred. Verify animation enabling, disabling, and state transitions in unit or browser interaction tests.
