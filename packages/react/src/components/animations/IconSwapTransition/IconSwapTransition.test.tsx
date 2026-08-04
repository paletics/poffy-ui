import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { createRef } from 'react';
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

  it('keeps transition keys distinct across primitive types', () => {
    const { rerender, getByText } = render(
      <IconSwapTransition transitionKey={true}>Boolean key</IconSwapTransition>,
    );
    rerender(<IconSwapTransition transitionKey="true">String key</IconSwapTransition>);

    expect(getByText('String key')).toBeInTheDocument();
  });

  it('falls back to a span for invalid asChild children', () => {
    const { container } = render(
      <IconSwapTransition asChild transitionKey="fragment">
        <>Fragment content</>
      </IconSwapTransition>,
    );

    expect(container.firstElementChild).toBeInstanceOf(HTMLSpanElement);
    expect(container).toHaveTextContent('Fragment content');

    render(
      <IconSwapTransition asChild transitionKey="text">
        Plain text content
      </IconSwapTransition>,
    );
    expect(document.body).toHaveTextContent('Plain text content');
  });

  it('forwards an asChild ref to an SVG host', () => {
    const ref = createRef<SVGSVGElement>();
    const { getByRole } = render(
      <IconSwapTransition asChild ref={ref} transitionKey="svg">
        <svg aria-label="Status icon" role="img" />
      </IconSwapTransition>,
    );

    expect(ref.current).toBe(getByRole('img', { name: 'Status icon' }));
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <IconSwapTransition transitionKey="copy">Copy</IconSwapTransition>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
