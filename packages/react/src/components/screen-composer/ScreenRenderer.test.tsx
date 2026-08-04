import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import { coreScreenExtension, createScreenRegistry } from '@poffy-ui/behavior/screen-composer';
import { coreScreenRendererExtension, ScreenRenderer } from './ScreenRenderer';
import { createScreenRendererRegistry } from './createScreenRendererRegistry';

describe('ScreenRenderer', () => {
  it('renders a validated declarative screen and dispatches host-owned actions', async () => {
    const schema = createScreenRegistry([coreScreenExtension]);
    if (!schema.ok) throw new Error('Expected schema registry');
    const renderers = createScreenRendererRegistry(schema.registry, [coreScreenRendererExtension]);
    if (!renderers.ok) throw new Error('Expected renderer registry');
    const onAction = vi.fn();
    const { container } = render(
      <ScreenRenderer
        document={{
          version: 1,
          root: {
            id: 'root',
            type: 'core.section',
            version: 1,
            props: { title: 'Settings' },
            children: [
              {
                id: 'text',
                type: 'core.text',
                version: 1,
                props: { text: 'Manage your project.' },
              },
              {
                id: 'save',
                type: 'core.action',
                version: 1,
                props: { actionId: 'save', label: 'Save' },
              },
            ],
          },
        }}
        schemaRegistry={schema.registry}
        rendererRegistry={renderers.registry}
        onAction={onAction}
      />,
    );
    screen.getByRole('button', { name: 'Save' }).click();
    expect(onAction).toHaveBeenCalledWith('save', expect.objectContaining({ id: 'save' }));
    expect(await axe(container)).toHaveNoViolations();
  });

  it('supports an addon renderer without inserting invalid wrapper elements', () => {
    const schema = createScreenRegistry([
      coreScreenExtension,
      { id: 'example-addon', namespace: 'addon', nodes: [{ type: 'addon.chart', version: 1 }] },
    ]);
    if (!schema.ok) throw new Error('Expected schema registry');
    const renderers = createScreenRendererRegistry(schema.registry, [
      coreScreenRendererExtension,
      {
        id: 'example-addon',
        namespace: 'addon',
        renderers: [{ type: 'addon.chart', version: 1, render: () => <figure>Chart</figure> }],
      },
    ]);
    if (!renderers.ok) throw new Error('Expected renderer registry');
    const { container } = render(
      <ScreenRenderer
        document={{
          version: 1,
          root: {
            id: 'root',
            type: 'core.stack',
            version: 1,
            children: [{ id: 'chart', type: 'addon.chart', version: 1 }],
          },
        }}
        schemaRegistry={schema.registry}
        rendererRegistry={renderers.registry}
      />,
    );
    expect(screen.getByText('Chart').tagName).toBe('FIGURE');
    expect(container.querySelector('span')).toBeNull();
  });

  it('fails closed when a renderer version does not match its schema definition', () => {
    const schema = createScreenRegistry([coreScreenExtension]);
    if (!schema.ok) throw new Error('Expected schema registry');
    const renderers = createScreenRendererRegistry(schema.registry, [
      {
        id: '@poffy-ui/core',
        namespace: 'core',
        renderers: coreScreenRendererExtension.renderers.map((renderer) => ({
          ...renderer,
          version: 2,
        })),
      },
    ]);
    expect(renderers.ok).toBe(false);
  });

  it('rejects a renderer extension that impersonates a schema namespace owner', () => {
    const schema = createScreenRegistry([coreScreenExtension]);
    if (!schema.ok) throw new Error('Expected schema registry');
    const renderers = createScreenRendererRegistry(schema.registry, [
      { ...coreScreenRendererExtension, id: 'app-extension' },
    ]);
    expect(renderers.ok).toBe(false);
  });

  it('rejects an addon renderer that does not own its schema namespace', () => {
    const schema = createScreenRegistry([
      { id: 'example-addon', namespace: 'addon', nodes: [{ type: 'addon.chart', version: 1 }] },
    ]);
    if (!schema.ok) throw new Error('Expected schema registry');
    const renderers = createScreenRendererRegistry(schema.registry, [
      {
        id: 'other-addon',
        namespace: 'addon',
        renderers: [{ type: 'addon.chart', version: 1, render: () => <figure>Chart</figure> }],
      },
    ]);
    expect(renderers.ok).toBe(false);
  });

  it('does not render an action with an empty accessible label', () => {
    const schema = createScreenRegistry([coreScreenExtension]);
    if (!schema.ok) throw new Error('Expected schema registry');
    const renderers = createScreenRendererRegistry(schema.registry, [coreScreenRendererExtension]);
    if (!renderers.ok) throw new Error('Expected renderer registry');
    render(
      <ScreenRenderer
        document={{
          version: 1,
          root: {
            id: 'save',
            type: 'core.action',
            version: 1,
            props: { actionId: 'save', label: '' },
          },
        }}
        schemaRegistry={schema.registry}
        rendererRegistry={renderers.registry}
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('non-empty strings');
  });

  it('renders a responsive grid by default with a bounded minimum width', async () => {
    const schema = createScreenRegistry([coreScreenExtension]);
    if (!schema.ok) throw new Error('Expected schema registry');
    const renderers = createScreenRendererRegistry(schema.registry, [coreScreenRendererExtension]);
    if (!renderers.ok) throw new Error('Expected renderer registry');
    const { container } = render(
      <ScreenRenderer
        document={{
          version: 1,
          root: {
            id: 'grid',
            type: 'core.grid',
            version: 1,
            props: { gap: 'sm' },
            children: [
              { id: 'first', type: 'core.text', version: 1, props: { text: 'First' } },
              { id: 'second', type: 'core.text', version: 1, props: { text: 'Second' } },
            ],
          },
        }}
        schemaRegistry={schema.registry}
        rendererRegistry={renderers.registry}
      />,
    );
    expect(screen.getByText('First')).toBeVisible();
    expect(screen.getByText('Second')).toBeVisible();
    expect(container.firstElementChild).toHaveStyle('--min-child-width: 14rem');
    expect(container.firstElementChild).not.toHaveStyle(
      '--grid-columns: repeat(2, minmax(0, 1fr))',
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('keeps fixed grid columns as an explicit opt-in', () => {
    const schema = createScreenRegistry([coreScreenExtension]);
    if (!schema.ok) throw new Error('Expected schema registry');
    const renderers = createScreenRendererRegistry(schema.registry, [coreScreenRendererExtension]);
    if (!renderers.ok) throw new Error('Expected renderer registry');
    const { container } = render(
      <ScreenRenderer
        document={{
          version: 1,
          root: {
            id: 'grid',
            type: 'core.grid',
            version: 1,
            props: { mode: 'fixed', columns: 2 },
          },
        }}
        schemaRegistry={schema.registry}
        rendererRegistry={renderers.registry}
      />,
    );
    expect(container.firstElementChild).toHaveStyle('--grid-columns: repeat(2, minmax(0, 1fr))');
    expect(container.firstElementChild).not.toHaveStyle('--min-child-width: 14rem');
  });

  it('preserves the fixed meaning of persisted version-1 grids with columns', () => {
    const schema = createScreenRegistry([coreScreenExtension]);
    if (!schema.ok) throw new Error('Expected schema registry');
    const renderers = createScreenRendererRegistry(schema.registry, [coreScreenRendererExtension]);
    if (!renderers.ok) throw new Error('Expected renderer registry');
    const { container } = render(
      <ScreenRenderer
        document={{
          version: 1,
          root: {
            id: 'legacy-grid',
            type: 'core.grid',
            version: 1,
            props: { columns: 3 },
          },
        }}
        schemaRegistry={schema.registry}
        rendererRegistry={renderers.registry}
      />,
    );

    expect(container.firstElementChild).toHaveStyle('--grid-columns: repeat(3, minmax(0, 1fr))');
  });

  it('renders a safe external link with the required new-tab relationship', async () => {
    const schema = createScreenRegistry([coreScreenExtension]);
    if (!schema.ok) throw new Error('Expected schema registry');
    const renderers = createScreenRendererRegistry(schema.registry, [coreScreenRendererExtension]);
    if (!renderers.ok) throw new Error('Expected renderer registry');
    const { container } = render(
      <ScreenRenderer
        document={{
          version: 1,
          root: {
            id: 'docs',
            type: 'core.link',
            version: 1,
            props: { href: 'https://example.com/docs', label: 'Documentation', external: true },
          },
        }}
        schemaRegistry={schema.registry}
        rendererRegistry={renderers.registry}
      />,
    );
    const link = screen.getByRole('link', { name: 'Documentation' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
    expect(link).toHaveAttribute('rel', expect.stringContaining('noreferrer'));
    expect(await axe(container)).toHaveNoViolations();
  });
});
