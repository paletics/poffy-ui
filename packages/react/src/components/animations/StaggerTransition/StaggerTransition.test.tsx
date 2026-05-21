import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import 'vitest-axe/extend-expect';
import { StaggerTransition } from './StaggerTransition';

describe('StaggerTransition', () => {
  it('renders children and items correctly', () => {
    const { getByText } = render(
      <StaggerTransition>
        <StaggerTransition.Item>Item 1</StaggerTransition.Item>
        <StaggerTransition.Item>Item 2</StaggerTransition.Item>
      </StaggerTransition>,
    );
    expect(getByText('Item 1')).toBeInTheDocument();
    expect(getByText('Item 2')).toBeInTheDocument();
  });

  it('supports polymorphism', () => {
    const { container } = render(
      <StaggerTransition asChild>
        <section>
          <StaggerTransition.Item asChild>
            <article>Item</article>
          </StaggerTransition.Item>
        </section>
      </StaggerTransition>,
    );
    expect(container.querySelector('section')).toBeInTheDocument();
    expect(container.querySelector('article')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <StaggerTransition>
        <StaggerTransition.Item>Item 1</StaggerTransition.Item>
        <StaggerTransition.Item>Item 2</StaggerTransition.Item>
      </StaggerTransition>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
