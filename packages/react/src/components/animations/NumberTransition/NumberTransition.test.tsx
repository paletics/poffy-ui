import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import 'vitest-axe/extend-expect';
import { NumberTransition } from './NumberTransition';

describe('NumberTransition', () => {
  it('renders initial value', () => {
    const { getByText } = render(<NumberTransition from={0} to={100} duration={0} />);
    expect(getByText('0')).toBeInTheDocument();
  });

  it('renders custom formatted value', () => {
    const { getByText } = render(
      <NumberTransition from={10} to={10} format={(v) => `VAL: ${v}`} />,
    );
    expect(getByText('VAL: 10')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<NumberTransition from={0} to={100} duration={0} />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
