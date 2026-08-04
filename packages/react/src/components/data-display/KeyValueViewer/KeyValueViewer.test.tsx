import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { KeyValueViewer } from './KeyValueViewer';

/**
 * ### Test Strategy: KeyValueViewer
 * - **Focus**: Description-list semantics, caption rendering, empty value fallback,
 *   and automated accessibility checks.
 * - **DON'T**: Do not assert generated Panda class names or visual grid layout.
 */
describe('KeyValueViewer', () => {
  it('renders items as a description list', () => {
    render(
      <KeyValueViewer
        caption="Deployment"
        items={[
          { id: 'owner', label: 'Owner', value: 'Platform' },
          { id: 'status', label: 'Status', value: 'Active' },
        ]}
      />,
    );

    expect(screen.getByText('Deployment')).toBeInTheDocument();
    expect(screen.getByText('Owner')).toBeInTheDocument();
    expect(screen.getByText('Platform')).toBeInTheDocument();
  });

  it('uses the empty value fallback for blank values', () => {
    render(<KeyValueViewer items={[{ id: 'owner', label: 'Owner', value: '' }]} />);

    expect(screen.getByText('Not set')).toBeInTheDocument();
  });

  it('uses the fallback only for nullish and empty-string values', () => {
    render(
      <KeyValueViewer
        items={[
          { id: 'null', label: 'Null', value: null },
          { id: 'undefined', label: 'Undefined' },
          { id: 'zero', label: 'Zero', value: 0 },
          { id: 'boolean', label: 'Boolean', value: false },
          { id: 'node', label: 'Node', value: <strong>Present node</strong> },
        ]}
      />,
    );

    expect(screen.getAllByText('Not set')).toHaveLength(2);
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('false')).toBeInTheDocument();
    expect(screen.getByText('Present node')).toBeInTheDocument();
  });

  it('warns when item ids are duplicated', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(
      <KeyValueViewer
        items={[
          { id: 'status', label: 'First', value: 'a' },
          { id: 'status', label: 'Second', value: 'b' },
        ]}
      />,
    );

    expect(warning).toHaveBeenCalledWith(expect.stringContaining('ids must be unique'));
    warning.mockRestore();
  });

  it('updates rendered rows and duplicate-id warnings when items change', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { rerender } = render(
      <KeyValueViewer items={[{ id: 'owner', label: 'Owner', value: 'Platform' }]} />,
    );
    rerender(
      <KeyValueViewer
        items={[
          { id: 'owner', label: 'Owner', value: 'Platform' },
          { id: 'owner', label: 'Duplicate owner', value: 'Runtime' },
        ]}
      />,
    );
    expect(screen.getByText('Duplicate owner')).toBeInTheDocument();
    expect(warning).toHaveBeenCalledTimes(1);

    rerender(<KeyValueViewer items={[{ id: 'region', label: 'Region', value: 'Tokyo' }]} />);
    expect(screen.queryByText('Duplicate owner')).not.toBeInTheDocument();
    expect(screen.getByText('Tokyo')).toBeInTheDocument();
    expect(warning).toHaveBeenCalledTimes(1);
    warning.mockRestore();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <KeyValueViewer items={[{ id: 'owner', label: 'Owner', value: 'Platform' }]} />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
