import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { IconSwapTransition } from './IconSwapTransition';

describe('IconSwapTransition', () => {
  it('renders the current child', () => {
    const { getByText } = render(
      <IconSwapTransition transitionKey="copy">Copy</IconSwapTransition>,
    );
    expect(getByText('Copy')).toBeInTheDocument();
  });

  it('swaps content when transitionKey changes', () => {
    const { rerender, getByText, queryByText } = render(
      <IconSwapTransition transitionKey="copy">Copy</IconSwapTransition>,
    );
    rerender(<IconSwapTransition transitionKey="done">Done</IconSwapTransition>);
    expect(getByText('Done')).toBeInTheDocument();
    expect(queryByText('Copy')).not.toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <IconSwapTransition transitionKey="copy">Copy</IconSwapTransition>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
