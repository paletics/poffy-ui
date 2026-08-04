/**
 * Poffy UI's complete React public API.
 *
 * This root entry is convenient for application code and re-exports every component, hook, and
 * provider. Use the matching subpath (`@poffy-ui/react/inputs`, `/overlay`, `/providers`, and so
 * on) when a narrower dependency boundary is useful. Server-safe document attributes live only at
 * `@poffy-ui/react/ssr`; stylesheet assets are exported as `@poffy-ui/react/styles.css`.
 *
 * Component contracts, default hosts, controlled/uncontrolled behavior, and accessibility effects
 * are documented on their exported component and props types rather than duplicated in this barrel.
 */

// Components
export * from './components/layout';
export * from './components/typography';
export * from './components/inputs';
export * from './components/data-display';
export * from './components/feedback';
export * from './components/navigation';
export * from './components/overlay';
export * from './components/surfaces';
export * from './components/media';
export * from './components/tree-view';
export * from './components/screen-composer';
export * from './components/a11y';

// Animations - all Core primitives
export * from './components/animations';

// Hooks
export * from './hooks';

// Providers
export * from './providers';
