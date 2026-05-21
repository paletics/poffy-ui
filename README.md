# Poffy UI

Poffy UI is an AI-first React UI library built with Panda CSS and Motion.

## Monorepo Structure

This repository is a pnpm workspace.

- `packages/react`: React component library (`@poffy-ui/react`)
- `packages/system`: design tokens, theme exports, Panda preset (`@poffy-ui/system`)
- `packages/behavior`: non-visual behavior (`@poffy-ui/behavior`)
- `packages/types`: shared TS types (`@poffy-ui/types`)
- `tooling/*`: shared lint and TypeScript configs
- `tooling/configs/*`: repo-level tool configs (eslint/vitest/playwright/tsup/panda)

## Install

Install from npm:

```bash
npm install @poffy-ui/react
```

## Usage

```tsx
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from '@poffy-ui/react';
import '@poffy-ui/react/styles.css';

export function App() {
  return (
    <div>
      <Input aria-label="Project name" placeholder="Poffy UI" />
      <Button>Open</Button>
      <Modal open={false} onOpenChange={() => {}}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Project settings</ModalTitle>
            <ModalClose />
          </ModalHeader>
          <ModalBody>Content</ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
```

Note: `@poffy-ui/react/styles.css` includes the base token CSS from `@poffy-ui/system` plus component styles.

## Development

Requirements:

- Node.js 20+
- pnpm 10+

Install and run:

```bash
pnpm install
pnpm build
pnpm test
pnpm storybook
```

More details:

- docs index: `docs/README.md`
- setup: `docs/setup.md`
- architecture: `docs/architecture.md`
- contribution: `CONTRIBUTING.md`
- security: `SECURITY.md`

## License

Poffy UI is licensed under Apache-2.0. See `LICENSE`.

Third-party dependency notices are summarized in `THIRD_PARTY_NOTICES.md`.
