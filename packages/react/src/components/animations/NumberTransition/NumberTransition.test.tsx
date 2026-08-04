import { createRef, StrictMode } from 'react';
import { render } from '@testing-library/react';
import { animate } from 'motion/react';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import 'vitest-axe/extend-expect';
import { NumberTransition } from './NumberTransition';

vi.mock('motion/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('motion/react')>();

  return {
    ...actual,
    animate: vi.fn(() => ({ stop: vi.fn() })),
  };
});

describe('NumberTransition', () => {
  it('forwards and clears its element ref', () => {
    const ref = createRef<HTMLSpanElement>();
    const { unmount } = render(<NumberTransition ref={ref} from={0} to={0} />);

    expect(ref.current).toBeInstanceOf(HTMLSpanElement);

    unmount();

    expect(ref.current).toBeNull();
  });

  it('renders initial value', () => {
    const { getByText } = render(<NumberTransition from={0} to={100} duration={0} />);
    expect(getByText('0')).toBeInTheDocument();
  });

  it('restarts after Strict Mode replays its mount effect', () => {
    vi.mocked(animate).mockClear();
    render(
      <StrictMode>
        <NumberTransition from={0} to={100} animateOnView={false} duration={0} />
      </StrictMode>,
    );

    expect(animate).toHaveBeenCalledTimes(2);
  });

  it('renders custom formatted value', () => {
    const { getByText } = render(
      <NumberTransition from={10} to={10} format={(v) => `VAL: ${v}`} />,
    );
    expect(getByText('VAL: 10')).toBeInTheDocument();
  });

  it('injects the number into a valid asChild host', () => {
    const { getByText } = render(
      <NumberTransition asChild from={10} to={10}>
        <output />
      </NumberTransition>,
    );

    expect(getByText('10').closest('output')).toBeInTheDocument();
  });

  it('falls back to a span for invalid asChild children', () => {
    const { container } = render(
      <NumberTransition asChild from={10} to={10}>
        <>Ignored host</>
      </NumberTransition>,
    );

    expect(container.firstElementChild).toBeInstanceOf(HTMLSpanElement);
    expect(container).toHaveTextContent('10');
  });

  it('normalizes unsafe runtime decimal values', () => {
    const { getByText } = render(<NumberTransition from={1} to={1} decimals={-1} />);

    expect(getByText('1')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<NumberTransition from={0} to={100} duration={0} />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
