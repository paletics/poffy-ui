import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import 'vitest-axe/extend-expect';
import { ListTransition } from './ListTransition';

describe('ListTransition', () => {
  it('renders children correctly', () => {
    render(
      <ListTransition>
        <ListTransition.Item>Item 1</ListTransition.Item>
        <ListTransition.Item>Item 2</ListTransition.Item>
      </ListTransition>,
    );
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('renders with asChild pattern', () => {
    const ref = createRef<HTMLOListElement>();

    render(
      <ListTransition asChild ref={ref}>
        <ol>
          <ListTransition.Item asChild>
            <li>Custom Item</li>
          </ListTransition.Item>
        </ol>
      </ListTransition>,
    );
    const list = screen.getByRole('list');
    expect(list.tagName).toBe('OL');
    expect(ref.current).toBeInstanceOf(HTMLOListElement);
    expect(screen.getByText('Custom Item').tagName).toBe('LI');
  });

  it('falls back to native list hosts for invalid asChild elements', () => {
    const { container } = render(
      <ListTransition asChild>
        <div>
          <ListTransition.Item asChild>
            <div>Item</div>
          </ListTransition.Item>
        </div>
      </ListTransition>,
    );

    expect(container.firstChild?.nodeName).toBe('UL');
    expect(screen.getByRole('listitem', { hidden: true })).toHaveTextContent('Item');
    expect(container.querySelector('div > li')).toBeNull();
  });

  it('has no a11y violations', async () => {
    const { container } = render(
      <ListTransition>
        <ListTransition.Item>Accessible Item</ListTransition.Item>
      </ListTransition>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
