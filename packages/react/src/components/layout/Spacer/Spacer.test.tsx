import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Spacer } from './Spacer';

describe('Spacer Component', () => {
  it('renders as a div', () => {
    const { container } = render(<Spacer />);
    expect(container.firstChild?.nodeName).toBe('DIV');
  });

  it('has box class', () => {
    const { container } = render(<Spacer />);
    expect(container.firstChild).toHaveClass(/box/);
  });

  it('passes accessibility checks', async () => {
    const { container } = render(<Spacer />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
