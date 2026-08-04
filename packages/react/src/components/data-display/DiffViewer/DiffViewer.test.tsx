import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { DiffViewer } from './DiffViewer';
import { LocaleProvider } from '@/providers/LocaleProvider';

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

  it('keeps the existing caption structure when no disclosure is supplied', () => {
    const { container } = render(<DiffViewer caption="Config diff" hunks={hunks} />);

    const caption = container.querySelector('figcaption');
    expect(caption).toHaveTextContent('Config diff');
    expect(caption?.nextElementSibling).toHaveAttribute('role', 'table');
    expect(container.querySelector('details')).not.toBeInTheDocument();
  });

  it('reveals explicit supporting caption information without changing the table name', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <DiffViewer
        caption="Config diff"
        captionDisclosure={{
          summary: 'Show release context',
          content: 'This comparison excludes generated files.',
        }}
        hunks={hunks}
      />,
    );

    const table = screen.getByRole('table', { name: 'Config diff' });
    const disclosure = container.querySelector('details');
    const summary = screen.getByText('Show release context');

    expect(disclosure).not.toHaveAttribute('open');
    expect(screen.getByText('This comparison excludes generated files.')).not.toBeVisible();

    await user.click(summary);

    expect(disclosure).toHaveAttribute('open');
    expect(screen.getByText('This comparison excludes generated files.')).toBeVisible();
    expect(table).toHaveAccessibleName('Config diff');
  });

  it('supports an initially open caption disclosure and preserves an explicit table label', () => {
    const { container } = render(
      <DiffViewer
        aria-label="Reviewed configuration changes"
        caption="Config diff"
        captionDisclosure={{
          summary: 'Show release context',
          content: 'This comparison excludes generated files.',
          defaultOpen: true,
        }}
        hunks={hunks}
      />,
    );

    expect(container.querySelector('details')).toHaveAttribute('open');
    expect(screen.getByRole('table')).toHaveAccessibleName('Reviewed configuration changes');
  });

  it('keeps disclosure state across parent rerenders', async () => {
    const user = userEvent.setup();
    const disclosure = {
      summary: 'Show release context',
      content: 'This comparison excludes generated files.',
    };
    const { container, rerender } = render(
      <DiffViewer caption="Config diff" captionDisclosure={disclosure} hunks={hunks} />,
    );

    await user.click(screen.getByText('Show release context'));
    expect(container.querySelector('details')).toHaveAttribute('open');

    rerender(
      <DiffViewer caption="Config diff" captionDisclosure={disclosure} hunks={[...hunks]} />,
    );

    expect(container.querySelector('details')).toHaveAttribute('open');
    expect(screen.getByRole('table')).toHaveAccessibleName('Config diff');
  });

  it('omits disclosure content when the supplied caption has no accessible content', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const invalidProps = {
      caption: '',
      captionDisclosure: {
        summary: 'Show release context',
        content: 'This comparison excludes generated files.',
      },
      hunks,
    } as unknown as import('./DiffViewer.types').DiffViewerProps;

    const { container } = render(<DiffViewer {...invalidProps} />);

    expect(container.querySelector('details')).not.toBeInTheDocument();
    expect(screen.getByRole('table')).toHaveAccessibleName('Diff');
    expect(warn).toHaveBeenCalledWith(
      'DiffViewer: captionDisclosure requires a visible accessible caption. The disclosure was omitted.',
    );
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

  it('limits rendered diff rows and reports omitted content', () => {
    render(<DiffViewer hunks={hunks} maxRenderedRows={1} />);

    expect(screen.getAllByRole('row')).toHaveLength(3);
    expect(screen.getByText('2 diff rows omitted')).toBeInTheDocument();
    expect(screen.queryByText('enabled: true')).not.toBeInTheDocument();
  });

  it('allows zero as an explicit rendering limit', () => {
    render(<DiffViewer hunks={hunks} maxRenderedRows={0} />);

    expect(screen.getAllByRole('row')).toHaveLength(1);
    expect(screen.getByText('3 diff rows omitted')).toBeInTheDocument();
    expect(screen.queryByText('enabled: false')).not.toBeInTheDocument();
  });

  it('localizes fallback labels and allows message overrides', () => {
    const { rerender } = render(
      <LocaleProvider defaultLocale="ja-JP" global={false}>
        <DiffViewer hunks={hunks} maxRenderedRows={1} mode="split" />
      </LocaleProvider>,
    );

    expect(screen.getByRole('table', { name: '差分' })).toBeInTheDocument();
    expect(screen.getByLabelText('変更前の行 1')).toBeInTheDocument();
    expect(screen.getByText('2行の差分を省略')).toBeInTheDocument();

    rerender(
      <DiffViewer
        hunks={hunks}
        messages={{ diff: 'Changes', omittedRows: (count) => `${count} hidden` }}
        maxRenderedRows={1}
      />,
    );

    expect(screen.getByRole('table', { name: 'Changes' })).toBeInTheDocument();
    expect(screen.getByText('2 hidden')).toBeInTheDocument();
  });

  it('keeps the table named when a caption has no accessible content', () => {
    render(<DiffViewer caption="" hunks={hunks} />);

    expect(screen.getByRole('table', { name: 'Diff' })).toBeInTheDocument();
  });

  it('ignores hidden caption content but uses an explicitly visible sibling', () => {
    const { rerender } = render(
      <DiffViewer caption={<span aria-hidden>Hidden diff</span>} hunks={hunks} />,
    );

    expect(screen.getByRole('table', { name: 'Diff' })).toBeInTheDocument();

    rerender(
      <DiffViewer
        caption={
          <>
            <span hidden>Hidden diff</span>
            <span aria-hidden="false">Visible diff</span>
          </>
        }
        hunks={hunks}
      />,
    );

    expect(screen.getByRole('table', { name: 'Visible diff' })).toBeInTheDocument();
  });

  it('trims an explicit label and uses it instead of the caption', () => {
    render(<DiffViewer caption="Ignored caption" aria-label="  Config changes  " hunks={hunks} />);

    expect(screen.getByRole('table', { name: 'Config changes' })).toHaveAttribute(
      'aria-label',
      'Config changes',
    );
  });

  it('prioritizes explicit labels for the focusable table', () => {
    render(
      <>
        <span id="deployment-diff">Deployment diff</span>
        <DiffViewer
          caption="Ignored caption"
          aria-label="Ignored label"
          aria-labelledby="deployment-diff"
          aria-describedby="deployment-diff"
          hunks={hunks}
        />
      </>,
    );

    expect(screen.getByRole('table', { name: 'Deployment diff' })).toHaveAttribute(
      'aria-describedby',
      'deployment-diff',
    );
  });

  it('renders distinct old and new content for modified split rows', () => {
    render(
      <DiffViewer
        mode="split"
        hunks={[
          {
            lines: [
              {
                kind: 'modified',
                oldLineNumber: 1,
                newLineNumber: 1,
                content: 'new value',
                oldContent: 'old value',
                newContent: 'new value',
              },
            ],
          },
        ]}
      />,
    );

    expect(screen.getByRole('row', { name: 'Modified change' })).toHaveTextContent('old value');
    expect(screen.getByRole('row', { name: 'Modified change' })).toHaveTextContent('new value');
  });

  it('defensively renders malformed JavaScript modified lines without leaking content', () => {
    render(
      <DiffViewer
        mode="split"
        hunks={[
          {
            lines: [
              {
                kind: 'modified',
                oldLineNumber: 1,
                newLineNumber: 1,
                content: 'legacy value',
              } as unknown as import('./DiffViewer.types').DiffLine,
            ],
          },
        ]}
      />,
    );

    expect(screen.getByRole('row', { name: 'Modified change' })).toHaveTextContent('legacy value');
  });

  it('slots generated content into a figure host and falls back for invalid hosts', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const { rerender } = render(
      <DiffViewer asChild hunks={hunks}>
        <figure data-testid="slotted-figure" />
      </DiffViewer>,
    );

    expect(screen.getByTestId('slotted-figure')).toContainElement(screen.getByRole('table'));

    rerender(
      <DiffViewer asChild hunks={hunks}>
        <section data-testid="invalid-host" />
      </DiffViewer>,
    );

    expect(screen.getByRole('figure')).toContainElement(screen.getByRole('table'));
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<DiffViewer caption="Accessible diff" hunks={hunks} />);

    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no accessibility violations with an open caption disclosure', async () => {
    const { container } = render(
      <DiffViewer
        caption="Accessible diff"
        captionDisclosure={{
          summary: 'Show comparison scope',
          content: 'Generated files are excluded from this comparison.',
          defaultOpen: true,
        }}
        hunks={hunks}
      />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
