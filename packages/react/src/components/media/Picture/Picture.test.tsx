import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { Picture } from './Picture';

describe('Picture Component', () => {
  it('should pass accessibility compliance', async () => {
    const { container } = render(
      <Picture>
        <img src="test.jpg" alt="A test" />
      </Picture>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('forwards ref to the picture element', () => {
    const ref = createRef<HTMLPictureElement>();
    render(
      <Picture ref={ref}>
        <img src="test.jpg" alt="test" />
      </Picture>,
    );
    expect(ref.current).toBeInstanceOf(HTMLPictureElement);
  });

  it('renders successfully with children', () => {
    render(
      <Picture data-testid="picture">
        <img src="test.jpg" alt="test" />
      </Picture>,
    );
    const picture = screen.getByTestId('picture');
    expect(picture).toBeInTheDocument();
    expect(picture.querySelector('img')).toBeInTheDocument();
  });

  it('renders with sources', () => {
    render(
      <Picture data-testid="picture">
        <source srcSet="large.jpg" media="(min-width: 800px)" />
        <img src="small.jpg" alt="test" />
      </Picture>,
    );
    const picture = screen.getByTestId('picture');
    expect(picture.querySelector('source')).toBeInTheDocument();
  });
});
