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

  it('falls back to the default preset for unknown runtime values', () => {
    const { getByText } = render(
      <ContentTransition transitionKey="test" animationType={'unknown' as never}>
        Fallback Content
      </ContentTransition>,
    );
    expect(getByText('Fallback Content')).toBeInTheDocument();
  });

  it('keeps transition keys distinct across primitive types', () => {
    const { rerender, getByText } = render(
      <ContentTransition transitionKey={1}>Number key</ContentTransition>,
    );
    rerender(<ContentTransition transitionKey="1">String key</ContentTransition>);

    expect(getByText('String key')).toBeInTheDocument();
  });

  it('falls back to a div for invalid asChild children', () => {
    const { container } = render(
      <ContentTransition asChild transitionKey="fragment">
        <>Fragment content</>
      </ContentTransition>,
    );

    expect(container.firstElementChild).toBeInstanceOf(HTMLDivElement);
    expect(container).toHaveTextContent('Fragment content');
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
