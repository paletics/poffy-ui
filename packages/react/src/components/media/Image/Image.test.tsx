import { fireEvent, render, screen } from '@testing-library/react';
import { createRef, type ComponentPropsWithoutRef } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';
import { Image } from './Image';
import * as useImageModule from '@poffy-ui/behavior/hooks';
import { AspectRatio } from '@/components/layout/AspectRatio';

describe('Image Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should pass accessibility compliance', async () => {
    vi.spyOn(useImageModule, 'useImage').mockReturnValue({ status: 'loaded' });
    const { container } = render(<Image src="test.jpg" alt="A test" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('forwards ref to the img element', () => {
    vi.spyOn(useImageModule, 'useImage').mockReturnValue({ status: 'loaded' });
    const ref = createRef<HTMLImageElement>();
    render(<Image ref={ref} src="test.jpg" alt="test" />);
    expect(ref.current).toBeInstanceOf(HTMLImageElement);
  });

  it('renders successfully with src', () => {
    vi.spyOn(useImageModule, 'useImage').mockReturnValue({ status: 'loaded' });
    render(<Image src="test.jpg" alt="test" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'test.jpg');
    expect(img).toHaveAttribute('alt', 'test');
  });

  it('renders URL fallback when image fails to load', () => {
    vi.spyOn(useImageModule, 'useImage').mockReturnValue({ status: 'failed' });
    render(<Image src="invalid.jpg" alt="test" fallback="fallback.jpg" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'fallback.jpg');
  });

  it('forwards native events from a URL fallback image', () => {
    const onLoad = vi.fn();
    const onError = vi.fn();
    const { container } = render(
      <Image
        loading="lazy"
        src="broken.jpg"
        fallback="fallback.jpg"
        alt="Profile"
        onLoad={onLoad}
        onError={onError}
      />,
    );

    fireEvent.error(container.querySelector('img') as HTMLImageElement);
    const fallback = container.querySelector('img') as HTMLImageElement;
    fireEvent.load(fallback);
    fireEvent.error(fallback);

    expect(onLoad).toHaveBeenCalledWith(expect.objectContaining({ target: fallback }));
    expect(onError).toHaveBeenCalledTimes(2);
  });

  it('preserves native image attributes on a URL fallback', () => {
    vi.spyOn(useImageModule, 'useImage').mockReturnValue({ status: 'failed' });
    render(
      <Image
        src="invalid.jpg"
        alt="test"
        fallback="fallback.jpg"
        width={320}
        height={180}
        decoding="async"
        data-testid="fallback-image"
        aria-label="Fallback image"
      />,
    );

    const image = screen.getByTestId('fallback-image');
    expect(image).toHaveAttribute('width', '320');
    expect(image).toHaveAttribute('height', '180');
    expect(image).toHaveAttribute('decoding', 'async');
    expect(image).toHaveAttribute('aria-label', 'Fallback image');
  });

  it('renders custom fallback element when image fails to load', () => {
    vi.spyOn(useImageModule, 'useImage').mockReturnValue({ status: 'failed' });
    render(
      <Image src="invalid.jpg" alt="test" fallback={<div data-testid="fallback">Fallback</div>} />,
    );
    expect(screen.getByRole('img', { name: 'test' })).toHaveAttribute('data-testid', 'fallback');
  });

  it('keeps a React-node fallback as the direct child of a consumer-owned frame', () => {
    vi.spyOn(useImageModule, 'useImage').mockReturnValue({ status: 'failed' });
    const ref = createRef<HTMLImageElement>();

    render(
      <AspectRatio ratio={16 / 9} data-testid="frame">
        <Image
          ref={ref}
          src="invalid.jpg"
          alt="Preview"
          fallback={<div data-testid="framed-fallback">Unavailable</div>}
          sizing="fill"
        />
      </AspectRatio>,
    );

    const frame = screen.getByTestId('frame');
    const fallback = screen.getByTestId('framed-fallback');
    expect(fallback.parentElement).toBe(frame);
    expect(frame.children).toHaveLength(1);
    expect(ref.current).toBeNull();
  });

  it('preserves interactive fallback semantics', () => {
    vi.spyOn(useImageModule, 'useImage').mockReturnValue({ status: 'failed' });
    render(<Image src="invalid.jpg" alt="Profile" fallback={<button>Retry</button>} />);

    expect(screen.getByRole('button', { name: 'Retry' })).not.toHaveAttribute('role', 'img');
  });

  it('does not inject image semantics into a custom props-forwarding fallback', () => {
    vi.spyOn(useImageModule, 'useImage').mockReturnValue({ status: 'failed' });
    const Retry = (props: ComponentPropsWithoutRef<'button'>) => (
      <button type="button" {...props} />
    );
    render(<Image src="invalid.jpg" alt="Profile" fallback={<Retry>Retry</Retry>} />);

    expect(screen.getByRole('button', { name: 'Retry' })).not.toHaveAttribute('role', 'img');
  });

  it('does not wrap interactive fragment fallbacks in an image role', async () => {
    vi.spyOn(useImageModule, 'useImage').mockReturnValue({ status: 'failed' });
    const { container } = render(
      <Image
        src="invalid.jpg"
        alt="Profile"
        fallback={
          <>
            <button type="button">Retry</button>
          </>
        }
      />,
    );

    expect(screen.getByRole('group', { name: 'Profile' })).toContainElement(
      screen.getByRole('button', { name: 'Retry' }),
    );
    expect(screen.queryByRole('img', { name: 'Profile' })).not.toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders non-element fallback content without coercing it to an image URL', () => {
    vi.spyOn(useImageModule, 'useImage').mockReturnValue({ status: 'failed' });
    render(<Image src="invalid.jpg" alt="Unavailable image" fallback={42} />);

    expect(screen.getByRole('img', { name: 'Unavailable image' })).toHaveTextContent('42');
  });

  it('uses the original alt when an element fallback supplies an empty name', () => {
    vi.spyOn(useImageModule, 'useImage').mockReturnValue({ status: 'failed' });
    render(<Image src="invalid.jpg" alt="Profile" fallback={<img alt="" />} />);

    expect(screen.getByRole('img', { name: 'Profile' })).toHaveAttribute('aria-label', 'Profile');
  });

  it('restores image semantics when a fallback is marked presentational', () => {
    vi.spyOn(useImageModule, 'useImage').mockReturnValue({ status: 'failed' });
    render(
      <Image
        src="invalid.jpg"
        alt="Profile"
        fallback={<div data-testid="fallback" role="presentation" />}
      />,
    );

    expect(screen.getByRole('img', { name: 'Profile' })).toHaveAttribute('data-testid', 'fallback');
  });

  it('renders img when no fallback is provided and image fails', () => {
    vi.spyOn(useImageModule, 'useImage').mockReturnValue({ status: 'failed' });
    render(<Image src="invalid.jpg" alt="test" />);
    expect(screen.getByRole('img')).toHaveAttribute('src', 'invalid.jpg');
  });

  it('treats false fallback as no fallback', () => {
    vi.spyOn(useImageModule, 'useImage').mockReturnValue({ status: 'failed' });
    render(<Image src="invalid.jpg" alt="Profile" fallback={false} />);

    expect(screen.getByRole('img', { name: 'Profile' })).toHaveAttribute('src', 'invalid.jpg');
  });

  it('passes native events to onLoad and onError callbacks', () => {
    vi.spyOn(useImageModule, 'useImage').mockReturnValue({ status: 'loaded' });
    const onLoad = vi.fn();
    const onError = vi.fn();

    render(<Image src="valid.jpg" alt="test" onLoad={onLoad} onError={onError} />);

    const image = screen.getByRole('img');
    fireEvent.load(image);
    fireEvent.error(image);
    expect(onLoad.mock.calls[0]?.[0]).toMatchObject({ target: image, type: 'load' });
    expect(onError.mock.calls[0]?.[0]).toMatchObject({ target: image, type: 'error' });
  });

  it.each([
    { loading: 'lazy' as const, srcSet: undefined },
    { loading: undefined, srcSet: 'test-640.jpg 640w' },
  ])('uses rendered image events for lazy or responsive sources', ({ loading, srcSet }) => {
    const preloadImage = vi.fn();
    vi.stubGlobal('Image', preloadImage);
    const onError = vi.fn();

    try {
      render(
        <Image
          src="test.jpg"
          srcSet={srcSet}
          sizes={srcSet ? '640px' : undefined}
          loading={loading}
          alt="test"
          fallback="fallback.jpg"
          onError={onError}
        />,
      );

      fireEvent.error(screen.getByRole('img'));

      expect(preloadImage).not.toHaveBeenCalled();
      expect(onError).toHaveBeenCalledTimes(1);
      expect(screen.getByRole('img')).toHaveAttribute('src', 'fallback.jpg');
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('treats a missing alt as decorative', () => {
    vi.spyOn(useImageModule, 'useImage').mockReturnValue({ status: 'loaded' });
    render(<Image src="test.jpg" decorative />);

    expect(screen.getByRole('presentation')).toHaveAttribute('alt', '');
  });

  it('remounts rendered-event images when the resource changes', () => {
    const { rerender } = render(
      <Image loading="lazy" src="first.jpg" alt="test" fallback="fallback.jpg" />,
    );
    const previousImage = screen.getByRole('img');

    rerender(<Image loading="lazy" src="second.jpg" alt="test" fallback="fallback.jpg" />);
    const currentImage = screen.getByRole('img');

    expect(currentImage).not.toBe(previousImage);
    fireEvent.error(previousImage);
    expect(screen.getByRole('img')).toHaveAttribute('src', 'second.jpg');
  });

  it('reports preload and rendered resource states through onStatusChange', () => {
    vi.spyOn(useImageModule, 'useImage').mockReturnValue({ status: 'loaded' });
    const onStatusChange = vi.fn();

    render(<Image src="test.jpg" alt="test" onStatusChange={onStatusChange} />);

    expect(onStatusChange).toHaveBeenLastCalledWith('loaded');
  });

  it('does not repeat an unchanged status on rerender', () => {
    vi.spyOn(useImageModule, 'useImage').mockReturnValue({ status: 'loaded' });
    const onStatusChange = vi.fn();
    const { rerender } = render(
      <Image src="test.jpg" alt="test" onStatusChange={onStatusChange} />,
    );

    rerender(<Image src="test.jpg" alt="test" onStatusChange={onStatusChange} />);

    expect(onStatusChange).toHaveBeenCalledTimes(1);
  });
});
