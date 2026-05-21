import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { DirectionalButton } from './DirectionalButton';
import { DirectionalButtonGroup } from './DirectionalButtonGroup';

describe('DirectionalButton', () => {
  it('renders a standalone directional button', () => {
    render(<DirectionalButton direction="left" aria-label="Previous" />);
    expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument();
  });

  it('supports asChild without leaking native disabled to non-button elements', () => {
    render(
      <DirectionalButton asChild direction="right" aria-label="Next page" disabled>
        <a href="/next">Next</a>
      </DirectionalButton>,
    );

    const link = screen.getByRole('link', { name: 'Next page' });
    expect(link).not.toHaveAttribute('disabled');
    expect(link).toHaveAttribute('aria-disabled', 'true');
  });

  it('blocks asChild click and keyboard activation when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <DirectionalButton
        asChild
        direction="right"
        aria-label="Next page"
        disabled
        onClick={onClick}
      >
        <a href="/next">Next</a>
      </DirectionalButton>,
    );

    const link = screen.getByRole('link', { name: 'Next page' });
    await user.click(link);
    expect(onClick).not.toHaveBeenCalled();

    link.focus();
    await user.keyboard('{Enter}');
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders a connected button group and triggers actions', async () => {
    const user = userEvent.setup();
    const onPrev = vi.fn();
    const onNext = vi.fn();

    render(
      <DirectionalButtonGroup
        startButton={{ direction: 'left', 'aria-label': 'Previous', onClick: onPrev }}
        endButton={{ direction: 'right', 'aria-label': 'Next', onClick: onNext }}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Previous' }));
    await user.click(screen.getByRole('button', { name: 'Next' }));

    expect(onPrev).toHaveBeenCalledTimes(1);
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('has no obvious accessibility violations', async () => {
    const { container } = render(
      <DirectionalButtonGroup
        orientation="vertical"
        startButton={{ direction: 'up', 'aria-label': 'Increment' }}
        endButton={{ direction: 'down', 'aria-label': 'Decrement' }}
      />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
