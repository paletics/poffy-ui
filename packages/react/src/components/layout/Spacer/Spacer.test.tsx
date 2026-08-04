import { createRef, type ComponentProps } from 'react';
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

  it('keeps its fixed decorative div contract for untyped callers', () => {
    const ref = createRef<HTMLDivElement>();
    const unsafeProps = {
      asChild: true,
      children: <span>Meaningful content</span>,
      'aria-hidden': false,
      role: 'button',
      tabIndex: 0,
    } as unknown as ComponentProps<typeof Spacer>;

    const { container } = render(<Spacer ref={ref} {...unsafeProps} />);
    const spacer = container.firstElementChild;

    expect(spacer?.tagName).toBe('DIV');
    expect(spacer).toHaveAttribute('aria-hidden', 'true');
    expect(spacer).not.toHaveAttribute('role');
    expect(spacer).not.toHaveAttribute('tabindex');
    expect(spacer).toBeEmptyDOMElement();
    expect(ref.current).toBe(spacer);
  });
});
