import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';
import { Image } from './Image';
import * as useImageModule from '@poffy-ui/behavior/hooks';

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

  it('renders custom fallback element when image fails to load', () => {
    vi.spyOn(useImageModule, 'useImage').mockReturnValue({ status: 'failed' });
    render(
      <Image src="invalid.jpg" alt="test" fallback={<div data-testid="fallback">Fallback</div>} />,
    );
    expect(screen.getByTestId('fallback')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders img when no fallback is provided and image fails', () => {
    vi.spyOn(useImageModule, 'useImage').mockReturnValue({ status: 'failed' });
    render(<Image src="invalid.jpg" alt="test" />);
    expect(screen.getByRole('img')).toHaveAttribute('src', 'invalid.jpg');
  });

  it('passes onLoad and onError callbacks to useImage', () => {
    let capturedOnLoad: (() => void) | undefined;
    let capturedOnError: (() => void) | undefined;

    vi.spyOn(useImageModule, 'useImage').mockImplementation(({ onLoad, onError }) => {
      capturedOnLoad = onLoad;
      capturedOnError = onError;
      return { status: 'loaded' };
    });

    const onLoad = vi.fn();
    const onError = vi.fn();

    render(<Image src="valid.jpg" alt="test" onLoad={onLoad} onError={onError} />);

    capturedOnLoad?.();
    expect(onLoad).toHaveBeenCalled();

    capturedOnError?.();
    expect(onError).toHaveBeenCalled();
  });
});
