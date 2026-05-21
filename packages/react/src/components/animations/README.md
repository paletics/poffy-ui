# Poffy UI Animations (`src/components/animations`)

**Tier:** Infrastructure / Core Architecture

The `animations` directory contains the foundational kinetic engine for the Poffy UI design system. To maintain strict visual cadence and protect DOM performance, Framer Motion's `motion.*` tags should not be used directly in surface, layout, or component implementation files. Use the polymorphic wrappers in this directory instead.

## Core Philosophy

Motion timing, scale, and offsets should come from the shared animation presets and system tokens. Do not hardcode pixel distances or one-off timing curves inside individual components when an existing preset covers the interaction.

## Motion Policy

- `MotionProvider` maps `AnimationProvider` state into Motion's native `MotionConfig reducedMotion` policy.
- `isAnimating=true` uses `reducedMotion="user"` so Motion respects the OS `prefers-reduced-motion` setting.
- `isAnimating=false` uses `reducedMotion="always"` so app-level animation settings force reduced motion.
- Components that must completely stop work beyond Motion's reduced-motion behavior, such as drag gestures, infinite loops, manual counters, text splitting, SVG path drawing, and keyed indicator swaps, also read optional animation state directly.

## Visual Testing

Visual regression tests should cover stable rendered states. Do not use screenshots as proof that motion occurred. Verify animation enabling, disabling, and state transitions in unit or browser interaction tests.
