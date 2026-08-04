import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, forwardRef } from 'react';
import type { ComponentPropsWithoutRef, FormEvent } from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';
import { CopyButton } from './CopyButton';
import * as clipboardModule from '@poffy-ui/behavior/clipboard';

const CustomButton = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<'button'>>(
  function CustomButton(props, ref) {
    return <button ref={ref} {...props} />;
  },
);

vi.mock('@poffy-ui/behavior/clipboard', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@poffy-ui/behavior/clipboard')>();
  return {
    ...actual,
    copyToClipboard: vi.fn(),
  };
});

describe('CopyButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<CopyButton value="test value" />);
    const button = screen.getByRole('button', { name: /copy to clipboard/i });
    expect(button).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<CopyButton value="test value" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('copies text to clipboard when clicked', async () => {
    const user = userEvent.setup();
    render(<CopyButton value="test value" />);

    const button = screen.getByRole('button', { name: /copy to clipboard/i });
    await user.click(button);

    expect(clipboardModule.copyToClipboard).toHaveBeenCalledWith('test value', {
      ownerDocument: document,
    });
  });

  it('never submits an owning form when callers provide a conflicting type', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: FormEvent) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <CopyButton value="test value" type="submit" />
      </form>,
    );

    await user.click(screen.getByRole('button', { name: /copy to clipboard/i }));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(clipboardModule.copyToClipboard).toHaveBeenCalledWith('test value', {
      ownerDocument: document,
    });
  });

  it('delegates owned button props and ref to a custom button host', () => {
    const ref = createRef<HTMLElement>();
    const onSubmit = vi.fn((event: FormEvent) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <CopyButton
          {...({
            form: 'external-form',
            formAction: '/unsafe',
            name: 'unsafe',
            value: 'unsafe',
          } as unknown as { form?: never })}
          asChild
          ref={ref}
          value="test value"
          disabled
          aria-label="Copy value"
        >
          <CustomButton type="submit">Copy value</CustomButton>
        </CopyButton>
      </form>,
    );

    const button = screen.getByRole('button', { name: 'Copy value' });
    expect(ref.current).toBe(button);
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toBeDisabled();
    expect(button).not.toHaveAttribute('form');
    expect(button).not.toHaveAttribute('formaction');
    expect(button).not.toHaveAttribute('name');
    expect(button).not.toHaveAttribute('value');
    fireEvent.click(button);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(clipboardModule.copyToClipboard).not.toHaveBeenCalled();
  });

  it('calls onCopy callback when clicked', async () => {
    const user = userEvent.setup();
    const onCopy = vi.fn();
    render(<CopyButton value="test value" onCopy={onCopy} />);

    const button = screen.getByRole('button');
    await user.click(button);

    await waitFor(() => {
      expect(onCopy).toHaveBeenCalled();
    });
  });

  it('changes icon and aria-label after copying', async () => {
    const user = userEvent.setup();
    render(<CopyButton value="test value" />);

    const button = screen.getByRole('button');
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Copy to clipboard copied' })).toBeInTheDocument();
    });
    expect(screen.getByRole('status')).toHaveTextContent('Copy to clipboard copied');
  });

  it('does not report copied state when clipboard copy fails', async () => {
    const user = userEvent.setup();
    const onCopy = vi.fn();
    vi.mocked(clipboardModule.copyToClipboard).mockRejectedValueOnce(new Error('copy failed'));

    render(<CopyButton value="test value" onCopy={onCopy} />);

    await user.click(screen.getByRole('button', { name: /copy to clipboard/i }));

    await waitFor(() => {
      expect(clipboardModule.copyToClipboard).toHaveBeenCalledWith('test value', {
        ownerDocument: document,
      });
    });
    expect(onCopy).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: /copy to clipboard/i })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Copy failed');
  });

  it('reports clipboard failures to callers', async () => {
    const onCopyError = vi.fn();
    vi.mocked(clipboardModule.copyToClipboard).mockRejectedValueOnce(new Error('copy failed'));
    render(<CopyButton value="test value" onCopyError={onCopyError} />);

    await userEvent.setup().click(screen.getByRole('button', { name: /copy to clipboard/i }));

    await waitFor(() => expect(onCopyError).toHaveBeenCalledWith(expect.any(Error)));
  });

  it('restarts feedback timeout after repeated successful copies', async () => {
    vi.useFakeTimers();
    render(<CopyButton value="test value" timeout={100} />);
    const button = screen.getByRole('button', { name: /copy to clipboard/i });

    await act(async () => fireEvent.click(button));
    act(() => vi.advanceTimersByTime(75));
    await act(async () => fireEvent.click(button));
    act(() => vi.advanceTimersByTime(75));

    expect(screen.getByRole('button', { name: /copied/i })).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(25));
    expect(screen.getByRole('button', { name: /copy to clipboard/i })).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('preserves copy behavior when onClick is provided', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<CopyButton value="test value" onClick={onClick} />);

    await user.click(screen.getByRole('button', { name: /copy to clipboard/i }));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(clipboardModule.copyToClipboard).toHaveBeenCalledWith('test value', {
      ownerDocument: document,
    });
  });

  it('does not copy when the consumer cancels the click', async () => {
    const user = userEvent.setup();
    render(<CopyButton value="test value" onClick={(event) => event.preventDefault()} />);

    await user.click(screen.getByRole('button', { name: /copy to clipboard/i }));
    expect(clipboardModule.copyToClipboard).not.toHaveBeenCalled();
  });

  it('falls back to a native button for a link-like asChild host', async () => {
    const user = userEvent.setup();
    const onChildClick = vi.fn();
    render(
      <CopyButton asChild value="test value" aria-label="Copy value">
        <a href="/navigate" onClick={onChildClick}>
          Copy value
        </a>
      </CopyButton>,
    );

    const button = screen.getByRole('button', { name: 'Copy value' });
    expect(button.tagName).toBe('BUTTON');
    expect(button).not.toHaveAttribute('href');
    await user.click(button);
    expect(onChildClick).not.toHaveBeenCalled();
    expect(clipboardModule.copyToClipboard).toHaveBeenCalledWith('test value', {
      ownerDocument: document,
    });
  });

  it('falls back to a native button for incompatible interactive asChild hosts', async () => {
    const user = userEvent.setup();
    const selectChange = vi.fn();
    render(
      <CopyButton asChild value="test value" aria-label="Copy value">
        <select aria-label="Copy target" onChange={selectChange}>
          <option>Copy value</option>
        </select>
      </CopyButton>,
    );

    const button = screen.getByRole('button', { name: 'Copy value' });
    expect(screen.queryByRole('combobox', { name: 'Copy target' })).not.toBeInTheDocument();
    await user.click(button);
    expect(selectChange).not.toHaveBeenCalled();
    expect(clipboardModule.copyToClipboard).toHaveBeenCalledWith('test value', {
      ownerDocument: document,
    });
  });

  it('keeps the latest copy result when requests resolve out of order', async () => {
    let rejectFirst: ((error: Error) => void) | undefined;
    const firstRequest = new Promise<void>((_resolve, reject) => {
      rejectFirst = reject;
    });
    let resolveSecond: (() => void) | undefined;
    const secondRequest = new Promise<void>((resolve) => {
      resolveSecond = resolve;
    });
    vi.mocked(clipboardModule.copyToClipboard)
      .mockImplementationOnce(() => firstRequest)
      .mockImplementationOnce(() => secondRequest);

    render(<CopyButton value="test value" />);
    const button = screen.getByRole('button', { name: /copy to clipboard/i });
    fireEvent.click(button);
    fireEvent.click(button);

    await act(async () => resolveSecond?.());
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Copy to clipboard copied' })).toBeInTheDocument();
    });
    await act(async () => rejectFirst?.(new Error('stale failure')));

    expect(screen.getByRole('button', { name: 'Copy to clipboard copied' })).toBeInTheDocument();
  });
});
