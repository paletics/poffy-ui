import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';
import { CopyButton } from './CopyButton';
import * as clipboardModule from '@poffy-ui/behavior/clipboard';

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

    expect(clipboardModule.copyToClipboard).toHaveBeenCalledWith('test value');
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
      expect(screen.getByRole('button', { name: /copied/i })).toBeInTheDocument();
    });
  });

  it('does not report copied state when clipboard copy fails', async () => {
    const user = userEvent.setup();
    const onCopy = vi.fn();
    vi.mocked(clipboardModule.copyToClipboard).mockRejectedValueOnce(new Error('copy failed'));

    render(<CopyButton value="test value" onCopy={onCopy} />);

    await user.click(screen.getByRole('button', { name: /copy to clipboard/i }));

    await waitFor(() => {
      expect(clipboardModule.copyToClipboard).toHaveBeenCalledWith('test value');
    });
    expect(onCopy).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: /copy to clipboard/i })).toBeInTheDocument();
  });

  it('preserves copy behavior when onClick is provided', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<CopyButton value="test value" onClick={onClick} />);

    await user.click(screen.getByRole('button', { name: /copy to clipboard/i }));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(clipboardModule.copyToClipboard).toHaveBeenCalledWith('test value');
  });
});
