import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { Stat } from './Stat';
import { StatLabel } from './StatLabel';
import { StatNumber } from './StatNumber';
import { StatHelpText } from './StatHelpText';
import { StatArrow } from './StatArrow';

describe('Stat', () => {
  it('renders correctly', () => {
    render(
      <Stat>
        <StatLabel>Collected Fees</StatLabel>
        <StatNumber>£0.00</StatNumber>
        <StatHelpText>Feb 12 - Feb 28</StatHelpText>
      </Stat>,
    );

    expect(screen.getByText('Collected Fees')).toBeInTheDocument();
    expect(screen.getByText('£0.00')).toBeInTheDocument();
    expect(screen.getByText('Feb 12 - Feb 28')).toBeInTheDocument();
  });

  it('renders with arrow', () => {
    render(
      <Stat>
        <StatLabel>Sent</StatLabel>
        <StatNumber>345,670</StatNumber>
        <StatHelpText>
          <StatArrow type="increase" />
          23.36%
        </StatHelpText>
      </Stat>,
    );
    expect(screen.getByRole('img', { name: 'increase' })).toBeInTheDocument();
  });

  it('renders as child', () => {
    render(
      <Stat asChild>
        <section data-testid="custom-stat">
          <StatLabel asChild>
            <span data-testid="custom-label">Label</span>
          </StatLabel>
        </section>
      </Stat>,
    );

    expect(screen.getByTestId('custom-stat')).toBeInTheDocument();
    expect(screen.getByTestId('custom-stat').tagName).toBe('SECTION');
    expect(screen.getByTestId('custom-label')).toBeInTheDocument();
    expect(screen.getByTestId('custom-label').tagName).toBe('SPAN');
  });

  it('forwards ref', () => {
    const ref = { current: null };
    render(<Stat ref={ref}>Stat</Stat>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('should have no a11y violations', async () => {
    const { container } = render(
      <Stat>
        <StatLabel>Label</StatLabel>
        <StatNumber>100</StatNumber>
        <StatHelpText>Help</StatHelpText>
      </Stat>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
