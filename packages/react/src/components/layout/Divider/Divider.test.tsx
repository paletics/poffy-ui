import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Divider } from './Divider';

describe('Divider Component', () => {
  it('renders as an hr by default', () => {
    const { container } = render(<Divider />);
    expect(container.firstChild?.nodeName).toBe('HR');
  });

  it('has separator role', () => {
    const { getByRole } = render(<Divider />);
    expect(getByRole('separator')).toBeInTheDocument();
  });

  it('applies divider class', () => {
    const { container } = render(<Divider />);
    expect(container.firstChild).toHaveClass(/divider/);
  });

  it('passes accessibility checks', async () => {
    const { container } = render(<Divider />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('passes accessibility checks for vertical orientation', async () => {
    const { container } = render(<Divider orientation="vertical" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
