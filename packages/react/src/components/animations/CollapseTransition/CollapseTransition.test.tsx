import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { CollapseTransition } from './CollapseTransition';
import { collapseVariants } from './CollapseTransition.presets';

describe('CollapseTransition', () => {
  it('clips height transitions until the open animation completes', () => {
    expect(collapseVariants.height.animate).toMatchObject({
      height: 'auto',
      overflow: 'hidden',
      transitionEnd: { overflow: 'visible' },
    });
    expect(collapseVariants['height-fade'].animate).toMatchObject({
      height: 'auto',
      overflow: 'hidden',
      transitionEnd: { overflow: 'visible' },
    });
  });

  it('renders children when open', () => {
    const { getByText } = render(<CollapseTransition isOpen>Details</CollapseTransition>);
    expect(getByText('Details')).toBeInTheDocument();
  });

  it('does not render children when closed by default', () => {
    const { queryByText } = render(<CollapseTransition isOpen={false}>Details</CollapseTransition>);
    expect(queryByText('Details')).not.toBeInTheDocument();
  });

  it('keeps closed content mounted when keepMounted is true', () => {
    const { container, getByText } = render(
      <CollapseTransition isOpen={false} keepMounted>
        Details
      </CollapseTransition>,
    );
    expect(getByText('Details')).toBeInTheDocument();
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('keeps closed persistent content hidden when callers provide conflicting attributes', () => {
    const { container } = render(
      <CollapseTransition
        isOpen={false}
        keepMounted
        aria-hidden={false}
        inert={false}
        hidden={false}
      >
        Details
      </CollapseTransition>,
    );
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    expect(container.firstElementChild).toHaveAttribute('inert');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<CollapseTransition isOpen>Details</CollapseTransition>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('falls back to the default preset for unknown runtime values', () => {
    const { getByText } = render(
      <CollapseTransition isOpen animationType={'unknown' as never}>
        Fallback Content
      </CollapseTransition>,
    );
    expect(getByText('Fallback Content')).toBeInTheDocument();
  });

  it('falls back to a div for invalid asChild children', () => {
    const { container } = render(
      <CollapseTransition asChild isOpen>
        <>Fragment content</>
      </CollapseTransition>,
    );

    expect(container.firstElementChild).toBeInstanceOf(HTMLDivElement);
    expect(container).toHaveTextContent('Fragment content');
  });
});
