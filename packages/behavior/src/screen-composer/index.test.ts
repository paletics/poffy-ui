import { describe, expect, it } from 'vitest';
import { coreScreenExtension, createScreenRegistry, validateScreenDocument } from './index';

describe('screen composer registry', () => {
  it('composes explicit addon definitions and validates registered nodes', () => {
    const result = createScreenRegistry([
      coreScreenExtension,
      { id: 'example-addon', namespace: 'addon', nodes: [{ type: 'addon.chart', version: 1 }] },
    ]);
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error('Expected registry');
    expect(
      validateScreenDocument(
        {
          version: 1,
          root: {
            id: 'root',
            type: 'core.stack',
            version: 1,
            children: [{ id: 'chart', type: 'addon.chart', version: 1 }],
          },
        },
        result.registry,
      ),
    ).toEqual([]);
  });

  it('fails closed for duplicate definitions and unregistered nodes', () => {
    const result = createScreenRegistry([
      coreScreenExtension,
      { id: 'example-addon', namespace: 'addon', nodes: [{ type: 'core.text', version: 1 }] },
    ]);
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error('Expected invalid registry');
    expect(result.issues[0]?.code).toBe('invalid-extension');
  });

  it('rejects malformed extensions, Core namespace impersonation, and oversized props', () => {
    const malformed = createScreenRegistry({} as never);
    expect(malformed.ok).toBe(false);

    const impersonated = createScreenRegistry([
      { id: 'app-extension', namespace: 'core', nodes: [] },
    ]);
    expect(impersonated.ok).toBe(false);

    const duplicateNamespace = createScreenRegistry([
      { id: 'first-addon', namespace: 'addon', nodes: [] },
      { id: 'second-addon', namespace: 'addon', nodes: [] },
    ]);
    expect(duplicateNamespace.ok).toBe(false);

    const registry = createScreenRegistry([coreScreenExtension]);
    if (!registry.ok) throw new Error('Expected registry');
    const props = {
      payload: Array.from({ length: 50 }, () => Array.from({ length: 50 }, (_, index) => index)),
    };
    expect(
      validateScreenDocument(
        { version: 1, root: { id: 'root', type: 'core.stack', version: 1, props } },
        registry.registry,
      ).some((issue) => issue.code === 'resource-limit'),
    ).toBe(true);
  });

  it('fails closed when a trusted validator throws or returns an invalid result', () => {
    const registry = createScreenRegistry([
      {
        id: 'app-extension',
        namespace: 'app',
        nodes: [
          {
            type: 'app.throwing',
            version: 1,
            validateProps: () => {
              throw new Error('no');
            },
          },
          { type: 'app.invalid-result', version: 1, validateProps: () => 'invalid' as never },
        ],
      },
    ]);
    if (!registry.ok) throw new Error('Expected registry');
    for (const type of ['app.throwing', 'app.invalid-result']) {
      expect(
        validateScreenDocument(
          { version: 1, root: { id: type, type, version: 1 } },
          registry.registry,
        ),
      ).not.toEqual([]);
    }
  });

  it('rejects children for leaf nodes', () => {
    const registry = createScreenRegistry([coreScreenExtension]);
    if (!registry.ok) throw new Error('Expected registry');
    expect(
      validateScreenDocument(
        {
          version: 1,
          root: {
            id: 'text',
            type: 'core.text',
            version: 1,
            props: { text: 'Parent' },
            children: [{ id: 'nested', type: 'core.text', version: 1, props: { text: 'Child' } }],
          },
        },
        registry.registry,
      ).some((issue) => issue.message === 'This node does not allow children.'),
    ).toBe(true);
  });

  it('rejects unsupported fields on root and nested nodes', () => {
    const registry = createScreenRegistry([coreScreenExtension]);
    if (!registry.ok) throw new Error('Expected registry');
    for (const root of [
      { id: 'root', type: 'core.text', version: 1, props: { text: 'Root' }, render: () => null },
      {
        id: 'root',
        type: 'core.stack',
        version: 1,
        children: [
          { id: 'child', type: 'core.text', version: 1, props: { text: 'Child' }, element: {} },
        ],
      },
    ]) {
      expect(validateScreenDocument({ version: 1, root }, registry.registry)).toContainEqual({
        path: root.type === 'core.stack' ? '$.root.children[0]' : '$.root',
        code: 'invalid-node',
        message: 'Node contains unsupported fields.',
      });
    }
    const nodeWithSymbolField = {
      id: 'symbol',
      type: 'core.text',
      version: 1,
      props: { text: 'Symbol' },
      [Symbol('untrusted')]: () => null,
    };
    expect(
      validateScreenDocument({ version: 1, root: nodeWithSymbolField }, registry.registry),
    ).toContainEqual({
      path: '$.root',
      code: 'invalid-node',
      message: 'Node contains unsupported fields.',
    });
    expect(
      validateScreenDocument(
        {
          version: 1,
          root: { id: 'root', type: 'core.text', version: 1, props: { text: 'Root' } },
          payload: () => null,
        },
        registry.registry,
      ),
    ).toContainEqual({
      path: '$',
      code: 'invalid-document',
      message: 'Screen document contains unsupported fields.',
    });
  });

  it('accepts responsive grids by default and requires bounded columns for fixed grids', () => {
    const registry = createScreenRegistry([coreScreenExtension]);
    if (!registry.ok) throw new Error('Expected registry');
    expect(
      validateScreenDocument(
        {
          version: 1,
          root: {
            id: 'grid',
            type: 'core.grid',
            version: 1,
            props: { gap: 'lg', minChildWidth: 'md' },
            children: [{ id: 'text', type: 'core.text', version: 1, props: { text: 'Card' } }],
          },
        },
        registry.registry,
      ),
    ).toEqual([]);
    expect(
      validateScreenDocument(
        {
          version: 1,
          root: {
            id: 'grid',
            type: 'core.grid',
            version: 1,
            props: { mode: 'fixed', columns: 3 },
          },
        },
        registry.registry,
      ),
    ).toEqual([]);
    expect(
      validateScreenDocument(
        {
          version: 1,
          root: {
            id: 'stack',
            type: 'core.stack',
            version: 1,
            props: { className: 'unsafe', direction: 'diagonal' },
          },
        },
        registry.registry,
      ).filter((issue) => issue.code === 'invalid-props'),
    ).toHaveLength(2);
    expect(
      validateScreenDocument(
        {
          version: 1,
          root: { id: 'grid', type: 'core.grid', version: 1, props: { columns: 13 } },
        },
        registry.registry,
      ).some((issue) => issue.code === 'invalid-props'),
    ).toBe(true);
    for (const props of [
      { mode: 'fixed' },
      { mode: 'fluid' },
      { minChildWidth: 'arbitrary-css' },
      { mode: 'responsive', columns: 3 },
      { mode: 'fixed', columns: 3, minChildWidth: 'md' },
    ]) {
      expect(
        validateScreenDocument(
          { version: 1, root: { id: 'grid', type: 'core.grid', version: 1, props } },
          registry.registry,
        ).some((issue) => issue.code === 'invalid-props'),
      ).toBe(true);
    }
    expect(
      validateScreenDocument(
        {
          version: 1,
          root: {
            id: 'legacy-grid',
            type: 'core.grid',
            version: 1,
            props: { columns: 3 },
          },
        },
        registry.registry,
      ),
    ).toEqual([]);
    for (const props of [[], false, null]) {
      expect(
        validateScreenDocument(
          { version: 1, root: { id: 'section', type: 'core.section', version: 1, props } },
          registry.registry,
        ).some((issue) => issue.code === 'invalid-props'),
      ).toBe(true);
    }
  });

  it('accepts only safe, labelled navigation links', () => {
    const registry = createScreenRegistry([coreScreenExtension]);
    if (!registry.ok) throw new Error('Expected registry');
    expect(
      validateScreenDocument(
        {
          version: 1,
          root: {
            id: 'docs',
            type: 'core.link',
            version: 1,
            props: { href: '/docs', label: 'Documentation', external: true },
          },
        },
        registry.registry,
      ),
    ).toEqual([]);
    for (const href of [
      'javascript:alert(1)',
      'data:text/html,test',
      '//example.com',
      'https://user:password@example.com',
      'https:\\evil.example',
      'https:/\\evil.example',
      '/\\evil.example',
      ' mailto:x@y',
    ]) {
      expect(
        validateScreenDocument(
          {
            version: 1,
            root: { id: href, type: 'core.link', version: 1, props: { href, label: 'Unsafe' } },
          },
          registry.registry,
        ).some((issue) => issue.code === 'invalid-props'),
      ).toBe(true);
    }
  });
});
