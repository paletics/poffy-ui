import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { DiffViewer } from './DiffViewer';

const hunks = [
  {
    header: '@@ -1,2 +1,2 @@',
    lines: [
      { kind: 'removed' as const, oldLineNumber: 1, content: 'enabled: false' },
      { kind: 'added' as const, newLineNumber: 1, content: 'enabled: true' },
      { kind: 'unchanged' as const, oldLineNumber: 2, newLineNumber: 2, content: 'name: app' },
    ],
  },
];

/**
 * ### Test Strategy: DiffViewer
 * - **Focus**: Unified and split diff semantics, line content rendering, row change markers,
 *   and automated accessibility checks.
 * - **DON'T**: Do not assert generated Panda class names or exact visual styling.
 */
describe('DiffViewer', () => {
  it('renders unified diff rows with caption and line content', () => {
    render(<DiffViewer caption="Config diff" hunks={hunks} />);

    expect(screen.getByText('Config diff')).toBeInTheDocument();
    expect(screen.getByText('@@ -1,2 +1,2 @@')).toBeInTheDocument();
    expect(screen.getByText('enabled: false')).toBeInTheDocument();
    expect(screen.getByText('enabled: true')).toBeInTheDocument();
  });

  it('marks changed rows for visual styling', () => {
    const { container } = render(<DiffViewer caption="Config diff" hunks={hunks} />);

    const addedRow = container.querySelector('[data-change="added"]');

    expect(addedRow).toBeInTheDocument();
    expect(addedRow?.querySelector('[aria-hidden="true"]')).toHaveTextContent('+');
  });

  it('renders split mode with old and new line cells', () => {
    render(<DiffViewer caption="Split diff" mode="split" hunks={hunks} />);

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByLabelText('Old line 1')).toBeInTheDocument();
    expect(screen.getByLabelText('New line 1')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<DiffViewer caption="Accessible diff" hunks={hunks} />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
