import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { ReorderTransition } from './ReorderTransition';

describe('ReorderTransition', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <ReorderTransition>
        <ReorderTransition.Item key="a">Apple</ReorderTransition.Item>
        <ReorderTransition.Item key="b">Banana</ReorderTransition.Item>
      </ReorderTransition>,
    );
    expect(getByText('Apple')).toBeInTheDocument();
    expect(getByText('Banana')).toBeInTheDocument();
  });

  it('forwards root props to the asChild host', () => {
    const ref = { current: null as HTMLUListElement | null };
    render(
      <ReorderTransition asChild className="reorder-list" data-testid="reorder-list" ref={ref}>
        <ul>
          <ReorderTransition.Item key="a" asChild>
            <li>Apple</li>
          </ReorderTransition.Item>
        </ul>
      </ReorderTransition>,
    );
    const list = document.querySelector('ul');
    expect(list).toHaveClass('reorder-list');
    expect(list).toHaveAttribute('data-testid', 'reorder-list');
    expect(ref.current).toBe(list);
    expect(list?.querySelector('li')).toBeInTheDocument();
  });

  it('falls back to wrappers when asChild children cannot accept Slot props', () => {
    const { container } = render(
      <ReorderTransition asChild>
        <>Plain transition content</>
      </ReorderTransition>,
    );

    expect(container.firstElementChild).toBeInstanceOf(HTMLDivElement);
    expect(screen.getByText('Plain transition content')).toBeInTheDocument();

    render(
      <ReorderTransition>
        <ReorderTransition.Item asChild>Plain item content</ReorderTransition.Item>
      </ReorderTransition>,
    );
    expect(screen.getByText('Plain item content').parentElement).toBeInstanceOf(HTMLDivElement);
  });

  it('applies animationType override per item', () => {
    const { getByText } = render(
      <ReorderTransition animationType="pop">
        <ReorderTransition.Item key="a" animationType="slide">
          Slide item
        </ReorderTransition.Item>
        <ReorderTransition.Item key="b">Pop item</ReorderTransition.Item>
      </ReorderTransition>,
    );
    expect(getByText('Slide item')).toBeInTheDocument();
    expect(getByText('Pop item')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <ReorderTransition>
        <ReorderTransition.Item key="a">Apple</ReorderTransition.Item>
        <ReorderTransition.Item key="b">Banana</ReorderTransition.Item>
      </ReorderTransition>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
