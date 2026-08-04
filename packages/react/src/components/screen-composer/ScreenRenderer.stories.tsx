'use client';

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { coreScreenExtension, createScreenRegistry } from '@poffy-ui/behavior/screen-composer';
import type {
  ScreenDocument,
  ScreenExtension,
  ScreenNode,
} from '@poffy-ui/behavior/screen-composer';
import { css } from '@/styled-system/css';
import { coreScreenRendererExtension, ScreenRenderer } from './ScreenRenderer';
import type { ScreenRendererExtension } from './ScreenRenderer.types';
import { createScreenRendererRegistry } from './createScreenRendererRegistry';

const previewClass = css({ display: 'grid', gap: 'lg', maxWidth: '[720px]', padding: 'lg' });
const noticeClass = css({ borderLeftWidth: '4px', borderColor: 'border.brand', padding: 'md' });

const createRegistries = (
  schemaExtensions: readonly ScreenExtension[],
  rendererExtensions: readonly ScreenRendererExtension[],
) => {
  const schema = createScreenRegistry(schemaExtensions);
  if (!schema.ok) throw new Error(schema.issues[0]?.message ?? 'Unable to create schema registry.');
  const renderers = createScreenRendererRegistry(schema.registry, rendererExtensions);
  if (!renderers.ok)
    throw new Error(renderers.issues[0]?.message ?? 'Unable to create renderer registry.');
  return { schemaRegistry: schema.registry, rendererRegistry: renderers.registry };
};

const coreRegistries = createRegistries([coreScreenExtension], [coreScreenRendererExtension]);

const applicationSchemaExtension: ScreenExtension = {
  id: 'example-host',
  namespace: 'app',
  nodes: [
    {
      type: 'app.notice',
      version: 1,
      validateProps: (props) =>
        typeof props?.['message'] === 'string' &&
        Object.keys(props).every((key) => key === 'message')
          ? []
          : ['message must be the only string prop.'],
    },
  ],
};

const applicationRendererExtension: ScreenRendererExtension = {
  id: 'example-host',
  namespace: 'app',
  renderers: [
    {
      type: 'app.notice',
      version: 1,
      render: (node: ScreenNode) => (
        <aside className={noticeClass}>{node.props?.['message']}</aside>
      ),
    },
  ],
};

const applicationRegistries = createRegistries(
  [coreScreenExtension, applicationSchemaExtension],
  [coreScreenRendererExtension, applicationRendererExtension],
);

const defaultDocument: ScreenDocument = {
  version: 1,
  root: {
    id: 'account-settings',
    type: 'core.section',
    version: 1,
    props: { title: 'Notification settings' },
    children: [
      {
        id: 'content',
        type: 'core.stack',
        version: 1,
        props: { gap: 'md' },
        children: [
          {
            id: 'summary',
            type: 'core.text',
            version: 1,
            props: { text: 'Choose how the workspace sends important updates.' },
          },
          {
            id: 'actions',
            type: 'core.grid',
            version: 1,
            props: { columns: 2, gap: 'sm' },
            children: [
              {
                id: 'documentation',
                type: 'core.link',
                version: 1,
                props: {
                  href: 'https://example.com/docs/notifications',
                  label: 'Read notification documentation',
                  external: true,
                },
              },
              {
                id: 'save',
                type: 'core.action',
                version: 1,
                props: { actionId: 'save-notifications', label: 'Save changes' },
              },
            ],
          },
        ],
      },
    ],
  },
};

const Preview = ({
  document,
  schemaRegistry,
  rendererRegistry,
  onAction,
}: {
  document: ScreenDocument;
  schemaRegistry: typeof coreRegistries.schemaRegistry;
  rendererRegistry: typeof coreRegistries.rendererRegistry;
  onAction?: (actionId: string) => void;
}) => (
  <main className={previewClass}>
    <h1>Workspace settings</h1>
    <ScreenRenderer
      document={document}
      schemaRegistry={schemaRegistry}
      rendererRegistry={rendererRegistry}
      onAction={(actionId) => onAction?.(actionId)}
    />
  </main>
);

const HostActionPreview = () => {
  const [lastAction, setLastAction] = useState<string>();
  return (
    <>
      <Preview document={defaultDocument} {...coreRegistries} onAction={setLastAction} />
      <p role="status">{lastAction ? `Host received: ${lastAction}` : 'No action dispatched.'}</p>
    </>
  );
};


const meta: Meta<typeof ScreenRenderer> = {
  title: 'Display/ScreenRenderer',
  component: ScreenRenderer,
  tags: ['autodocs'],
  parameters: { controls: { disable: true } },
};

export default meta;
type Story = StoryObj<typeof ScreenRenderer>;

export const Default: Story = {
  render: () => <Preview document={defaultDocument} {...coreRegistries} />,
};

export const HostAction: Story = {
  render: () => <HostActionPreview />,
  parameters: {
    docs: {
      description: {
        story: 'Actions are opaque signals; the host owns their meaning and side effects.',
      },
    },
  },
};

export const ApplicationExtensionComposition: Story = {
  render: () => (
    <Preview
      {...applicationRegistries}
      document={{
        version: 1,
        root: {
          id: 'root',
          type: 'core.stack',
          version: 1,
          props: { gap: 'md' },
          children: [
            {
              id: 'notice',
              type: 'app.notice',
              version: 1,
              props: { message: 'Billing is managed by your organization.' },
            },
            {
              id: 'details',
              type: 'core.text',
              version: 1,
              props: { text: 'Contact an administrator to change the plan.' },
            },
          ],
        },
      }}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A host explicitly composes its app namespace; Core does not import or discover it implicitly.',
      },
    },
  },
};

export const ValidationFallback: Story = {
  render: () => (
    <Preview
      {...coreRegistries}
      document={{
        version: 1,
        root: {
          id: 'invalid-text',
          type: 'core.text',
          version: 1,
          props: { text: 'This node has an unsupported prop.', color: 'danger' },
        },
      }}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Invalid persisted data fails closed before it reaches a node renderer.',
      },
    },
  },
};
