import { render } from '@testing-library/react';
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

  it('supports asChild polymorphism', () => {
    const { container } = render(
      <ReorderTransition asChild>
        <ul>
          <ReorderTransition.Item key="a" asChild>
            <li>Apple</li>
          </ReorderTransition.Item>
        </ul>
      </ReorderTransition>,
    );
    expect(container.querySelector('ul')).toBeInTheDocument();
    expect(container.querySelector('li')).toBeInTheDocument();
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
