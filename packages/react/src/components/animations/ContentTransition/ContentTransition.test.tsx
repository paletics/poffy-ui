import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import 'vitest-axe/extend-expect';
import { ContentTransition } from './ContentTransition';

describe('ContentTransition', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <ContentTransition transitionKey="test">
        <div>Test Content</div>
      </ContentTransition>,
    );
    expect(getByText('Test Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <ContentTransition transitionKey="test" className="custom-wrapper">
        <div>Content</div>
      </ContentTransition>,
    );
    expect(container.firstChild).toHaveClass('custom-wrapper');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <ContentTransition transitionKey="test">
        <div>Accessible content</div>
      </ContentTransition>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
