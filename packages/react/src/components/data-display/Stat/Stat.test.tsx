import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { Stat } from './Stat';
import { StatLabel } from './StatLabel';
import { StatNumber } from './StatNumber';
import { StatHelpText } from './StatHelpText';
import { StatArrow } from './StatArrow';
import { Button } from '@/components/inputs/Button';
import { LocaleProvider } from '@/providers/LocaleProvider';

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

  it('renders arrows as decorative by default', () => {
    const { container } = render(
      <Stat>
        <StatLabel>Sent</StatLabel>
        <StatNumber>345,670</StatNumber>
        <StatHelpText>
          <StatArrow type="increase" />
          23.36%
        </StatHelpText>
      </Stat>,
    );
    expect(screen.queryByRole('img')).toBeNull();
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });

  it('normalizes empty labels from untyped meaningful legacy usage', () => {
    render(
      <Stat>
        <StatArrow {...({ decorative: false, type: 'increase', 'aria-label': '  ' } as never)} />
      </Stat>,
    );

    expect(screen.getByRole('img', { name: 'increase' })).toBeInTheDocument();
  });

  it('localizes the fallback arrow label while preserving an explicit label', () => {
    render(
      <LocaleProvider defaultLocale="ja-JP" global={false}>
        <StatArrow {...({ decorative: false, type: 'increase', 'aria-label': '' } as never)} />
        <StatArrow {...({ decorative: false, type: 'decrease', 'aria-label': '' } as never)} />
        <StatArrow decorative={false} type="decrease" aria-label="売上が減少" />
      </LocaleProvider>,
    );

    expect(screen.getByRole('img', { name: '増加' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '減少' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: '売上が減少' })).toBeInTheDocument();
  });

  it('supports the documented compound API and inherits size', () => {
    render(
      <Stat size="sm">
        <Stat.Label>Active users</Stat.Label>
        <Stat.Number>42</Stat.Number>
      </Stat>,
    );

    expect(screen.getByText('Active users').className).toContain('size_sm');
    expect(screen.getByText('42').className).toContain('size_sm');
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

  it('falls back to native hosts for invalid delegated Stat parts', () => {
    const { container } = render(
      <Stat asChild>
        <>Stat content</>
      </Stat>,
    );
    expect(container.firstChild?.nodeName).toBe('DIV');

    render(
      <Stat>
        <StatLabel asChild>Label content</StatLabel>
      </Stat>,
    );
    expect(screen.getByText('Label content').tagName).toBe('DIV');
  });

  it('falls back safely when a delegated root cannot contain Stat parts', async () => {
    const { container } = render(
      <Stat asChild>
        <button type="button">
          <StatLabel>Users</StatLabel>
          <StatNumber>42</StatNumber>
        </button>
      </Stat>,
    );

    expect(container.firstChild?.nodeName).toBe('DIV');
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('falls back safely for custom delegated roots that render buttons', async () => {
    const { container } = render(
      <Stat asChild>
        <Button>
          <StatLabel>Users</StatLabel>
          <StatNumber>42</StatNumber>
        </Button>
      </Stat>,
    );

    expect(container.firstChild?.nodeName).toBe('DIV');
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('keeps the built-in arrow inline for phrasing help-text hosts', async () => {
    const { container } = render(
      <Stat>
        <StatHelpText asChild>
          <p>
            <StatArrow decorative={false} type="increase" aria-label="increase" /> 10% up
          </p>
        </StatHelpText>
      </Stat>,
    );

    expect(screen.getByRole('img', { name: 'increase' }).tagName).toBe('SPAN');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('owns the trend image semantics for a custom arrow host', () => {
    render(
      <Stat>
        <StatArrow asChild decorative={false} type="decrease" aria-label="Revenue decreased">
          <svg aria-label="Wrong label" />
        </StatArrow>
      </Stat>,
    );
    expect(screen.getByRole('img', { name: 'Revenue decreased' }).tagName).toBe('svg');
  });

  it('falls back to the built-in arrow for interactive custom hosts', () => {
    render(
      <Stat>
        <StatArrow
          {...({
            asChild: true,
            decorative: false,
            type: 'decrease',
            'aria-label': 'decrease',
          } as never)}
        >
          <button type="button">Wrong host</button>
        </StatArrow>
      </Stat>,
    );
    expect(screen.getByRole('img', { name: 'decrease' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Wrong host' })).not.toBeInTheDocument();
  });

  it('falls back to the built-in arrow for custom interactive hosts', () => {
    render(
      <Stat>
        <StatArrow
          {...({
            asChild: true,
            decorative: false,
            type: 'decrease',
            'aria-label': 'decrease',
          } as never)}
        >
          <Button>Wrong host</Button>
        </StatArrow>
      </Stat>,
    );

    expect(screen.getByRole('img', { name: 'decrease' }).tagName).toBe('SPAN');
    expect(screen.queryByRole('button', { name: 'Wrong host' })).not.toBeInTheDocument();
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

  it('has no accessibility violations for delegated stats with trend icons', async () => {
    const { container } = render(
      <Stat asChild>
        <section aria-label="Revenue">
          <StatLabel>Revenue</StatLabel>
          <StatNumber>$100</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" /> 10% from last month
          </StatHelpText>
        </section>
      </Stat>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
