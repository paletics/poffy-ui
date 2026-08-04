import { render, screen } from '@testing-library/react';
import { createElement, createRef, StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Picture } from './Picture';

describe('Picture Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

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

  it('keeps the native picture and direct fallback image DOM when filling a frame', () => {
    const ref = createRef<HTMLPictureElement>();
    const { container } = render(
      <Picture ref={ref} sizing="fill" data-testid="framed-picture">
        <source srcSet="large.webp" type="image/webp" />
        <img src="small.jpg" alt="Framed" />
      </Picture>,
    );

    const picture = screen.getByTestId('framed-picture');
    expect(ref.current).toBe(picture);
    expect(picture.tagName).toBe('PICTURE');
    expect(picture.children).toHaveLength(2);
    expect(container.querySelector('picture > img')).toHaveAttribute('alt', 'Framed');
  });

  it('renders with sources', () => {
    render(
      <Picture data-testid="picture">
        <source srcSet="large.jpg" media="(min-width: 800px)" />
        <img src="small.jpg" alt="test" />
      </Picture>,
    );
    const picture = screen.getByTestId('picture');
    const source = picture.querySelector('source');
    const fallbackImage = picture.querySelector('img');

    expect(source).toBeInTheDocument();
    expect(fallbackImage).toBeInTheDocument();
    expect(source?.compareDocumentPosition(fallbackImage!)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it('warns about an invalid fallback image structure during staged migration', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    render(
      <Picture>
        {createElement('img', { src: 'first.jpg' })}
        <source srcSet="late.webp" type="image/webp" />
        <img src="second.jpg" alt="Second" />
      </Picture>,
    );

    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('only one direct-child fallback <img> is supported'),
    );
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('the fallback <img> must declare alt'),
    );
  });

  it('accepts fragment-wrapped source and fallback image children', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    render(
      <Picture>
        <>
          {false}
          <>
            <source srcSet="large.jpg" media="(min-width: 800px)" />
            <img src="small.jpg" alt="test" />
          </>
        </>
      </Picture>,
    );

    expect(warn).not.toHaveBeenCalled();
  });

  it('materializes a single-use child iterable for validation and repeated rendering', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    function* pictureChildren() {
      yield <source key="source" srcSet="large.webp" type="image/webp" />;
      yield <img key="image" src="small.jpg" alt="Generated" />;
    }
    const children = pictureChildren();
    const { container, rerender } = render(
      <StrictMode>
        <Picture>{children}</Picture>
      </StrictMode>,
    );

    expect(warn).not.toHaveBeenCalled();
    expect(container.querySelectorAll('source')).toHaveLength(1);
    expect(container.querySelector('img')).toHaveAttribute('alt', 'Generated');

    rerender(
      <StrictMode>
        <Picture>{children}</Picture>
      </StrictMode>,
    );
    expect(container.querySelectorAll('source')).toHaveLength(1);
    expect(container.querySelector('img')).toHaveAttribute('src', 'small.jpg');
  });

  it('renders a single-use child iterable on the server', () => {
    function* pictureChildren() {
      yield <source key="source" srcSet="large.webp" type="image/webp" />;
      yield <img key="image" src="small.jpg" alt="Generated" />;
    }

    const children = pictureChildren();
    const firstMarkup = renderToString(<Picture>{children}</Picture>);
    const secondMarkup = renderToString(<Picture>{children}</Picture>);

    expect(firstMarkup).toContain('<source srcSet="large.webp" type="image/webp"/>');
    expect(firstMarkup).toContain('<img src="small.jpg" alt="Generated"/>');
    expect(secondMarkup).toBe(firstMarkup);
  });

  it('warns when text follows the fallback image', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    render(
      <Picture>
        <img src="image.jpg" alt="Artwork" />
        Caption
      </Picture>,
    );

    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('the fallback <img> must be the final direct child'),
    );
  });
});
