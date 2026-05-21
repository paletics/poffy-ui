import { render, screen } from '@testing-library/react';
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
    render(
      <ListTransition asChild>
        <ol>
          <ListTransition.Item asChild>
            <li>Custom Item</li>
          </ListTransition.Item>
        </ol>
      </ListTransition>,
    );
    const list = screen.getByRole('list');
    expect(list.tagName).toBe('OL');
    expect(screen.getByText('Custom Item').tagName).toBe('LI');
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
