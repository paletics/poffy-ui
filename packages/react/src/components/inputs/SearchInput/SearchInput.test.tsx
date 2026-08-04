import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { SearchInput } from './SearchInput';
import { LocaleProvider } from '@/providers/LocaleProvider';

/**
 * ### Test Strategy: SearchInput
 * - **Focus**: Native search semantics, clear action behavior, forwarded refs,
 *   and accessibility compliance via `axe`.
 * - **DON'T**: Do not assert visual styling details; those are covered by Input
 *   and Storybook visual coverage.
 */
describe('SearchInput', () => {
  it('renders a native search box', () => {
    render(<SearchInput aria-label="Search projects" />);
    expect(screen.getByRole('searchbox', { name: 'Search projects' })).toHaveAttribute(
      'type',
      'search',
    );
  });

  it('ignores runtime attempts to override owned input composition', () => {
    render(
      <SearchInput
        aria-label="Search projects"
        {...({
          type: 'text',
          children: 'Ignored child',
          startElement: <span>Ignored start</span>,
          endElement: <span>Ignored end</span>,
          startElementInteractive: true,
          endElementInteractive: true,
        } as never)}
      />,
    );

    expect(screen.getByRole('searchbox', { name: 'Search projects' })).toHaveAttribute(
      'type',
      'search',
    );
    expect(screen.queryByText(/Ignored/)).not.toBeInTheDocument();
  });

  it('renders a clear button when uncontrolled value is present', async () => {
    const user = userEvent.setup();
    const handleClear = vi.fn();
    render(<SearchInput aria-label="Search" defaultValue="alpha" onClear={handleClear} />);

    await user.click(screen.getByRole('button', { name: 'Clear search' }));

    expect(screen.getByRole('searchbox', { name: 'Search' })).toHaveValue('');
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();
    expect(handleClear).toHaveBeenCalledTimes(1);
  });

  it('localizes the default clear label', () => {
    render(
      <LocaleProvider defaultLocale="ja-JP" global={false}>
        <SearchInput aria-label="検索" defaultValue="alpha" />
      </LocaleProvider>,
    );
    expect(screen.getByRole('button', { name: '検索をクリア' })).toBeInTheDocument();
  });

  it('calls onClear for controlled consumers', async () => {
    const user = userEvent.setup();
    const handleClear = vi.fn();
    render(
      <SearchInput
        aria-label="Search"
        value="alpha"
        onChange={() => undefined}
        onClear={handleClear}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Clear search' }));

    expect(handleClear).toHaveBeenCalledTimes(1);
  });

  it('does not mutate a controlled value when onClear does not update it', async () => {
    const user = userEvent.setup();
    render(
      <SearchInput
        aria-label="Search"
        value="alpha"
        onChange={() => undefined}
        onClear={() => undefined}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Clear search' }));

    expect(screen.getByRole('searchbox', { name: 'Search' })).toHaveValue('alpha');
  });

  it('retains the latest controlled value when becoming uncontrolled', () => {
    const { rerender } = render(<SearchInput aria-label="Search" value="alpha" />);

    rerender(<SearchInput aria-label="Search" value="beta" />);
    rerender(<SearchInput aria-label="Search" />);

    expect(screen.getByRole('searchbox', { name: 'Search' })).toHaveValue('beta');
    expect(screen.getByRole('button', { name: 'Clear search' })).toBeInTheDocument();
  });

  it('hides clear button when disabled or read only', () => {
    const { rerender } = render(<SearchInput aria-label="Search" defaultValue="alpha" disabled />);
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();

    rerender(<SearchInput aria-label="Search" defaultValue="alpha" readOnly />);
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();
  });

  it('resynchronizes clear visibility after a native form reset', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <form>
        <SearchInput aria-label="Search" defaultValue="alpha" />
      </form>,
    );

    await user.click(screen.getByRole('button', { name: 'Clear search' }));
    rerender(
      <form>
        <SearchInput aria-label="Search" defaultValue="beta" />
      </form>,
    );
    screen.getByRole('searchbox').closest('form')?.reset();

    await waitFor(() =>
      expect(screen.getByRole('searchbox', { name: 'Search' })).toHaveValue('beta'),
    );
    expect(screen.getByRole('button', { name: 'Clear search' })).toBeInTheDocument();
  });

  it('resets through the current external form after its form association changes', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <>
        <form id="first-form" />
        <form id="second-form" />
        <SearchInput form="first-form" aria-label="Search" defaultValue="alpha" />
      </>,
    );

    const input = screen.getByRole('searchbox', { name: 'Search' });
    await user.clear(input);
    await user.type(input, 'beta');
    rerender(
      <>
        <form id="first-form" />
        <form id="second-form" />
        <SearchInput form="second-form" aria-label="Search" defaultValue="alpha" />
      </>,
    );
    (document.getElementById('second-form') as HTMLFormElement).reset();

    await waitFor(() => expect(input).toHaveValue('alpha'));
  });

  it('synchronizes reset state from an iframe-associated form', async () => {
    const frame = document.createElement('iframe');
    document.body.append(frame);
    const frameDocument = frame.contentDocument;
    if (!frameDocument) throw new Error('The test environment did not create an iframe document.');

    const form = frameDocument.createElement('form');
    form.id = 'search-form';
    const host = frameDocument.createElement('div');
    frameDocument.body.append(form, host);
    const { container, unmount } = render(
      <SearchInput form="search-form" aria-label="Search" defaultValue="alpha" />,
      { baseElement: frameDocument.body, container: host },
    );
    const input = container.querySelector<HTMLInputElement>('input[type="search"]');
    if (!input) throw new Error('The test did not render a search input.');

    fireEvent.change(input, { target: { value: 'beta' } });
    expect(input).toHaveValue('beta');
    await act(async () => {
      form.reset();
      await Promise.resolve();
    });
    expect(input).toHaveValue('alpha');

    unmount();
    frame.remove();
  });

  it('keeps the current value when a form reset is cancelled', async () => {
    const user = userEvent.setup();
    render(
      <form onReset={(event) => event.preventDefault()}>
        <SearchInput aria-label="Search" defaultValue="alpha" />
      </form>,
    );

    const input = screen.getByRole('searchbox', { name: 'Search' });
    await user.clear(input);
    await user.type(input, 'beta');
    input.closest('form')?.reset();

    await waitFor(() => expect(input).toHaveValue('beta'));
    expect(screen.getByRole('button', { name: 'Clear search' })).toBeInTheDocument();
  });

  it('keeps input focus when the clear button is activated with a pointer', async () => {
    const user = userEvent.setup();
    const onBlur = vi.fn();
    render(<SearchInput aria-label="Search" defaultValue="alpha" onBlur={onBlur} />);

    const input = screen.getByRole('searchbox', { name: 'Search' });
    input.focus();
    await user.click(screen.getByRole('button', { name: 'Clear search' }));

    expect(onBlur).not.toHaveBeenCalled();
    expect(input).toHaveFocus();
    expect(input).toHaveValue('');
  });

  it('forwards refs to the input element', () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<SearchInput ref={ref} aria-label="Search" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('has no a11y violations', async () => {
    const { container } = render(<SearchInput aria-label="Search" defaultValue="alpha" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
