import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, beforeAll, afterAll, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Avatar } from './Avatar';

class MockImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  src = '';
  constructor() {
    setTimeout(() => {
      if (this.src.includes('broken')) {
        this.onerror?.();
      } else if (this.src) {
        this.onload?.();
      }
    }, 100);
  }
}

describe('Avatar', () => {
  beforeAll(() => {
    vi.stubGlobal('Image', MockImage);
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it('renders initials when no src provided', () => {
    render(<Avatar name="John Doe" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders image when src provided', async () => {
    render(<Avatar src="https://example.com/image.jpg" name="Test User" />);

    const img = await screen.findByRole('img');
    expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
    expect(img).toHaveAttribute('alt', 'Test User');
  });

  it('prefers explicit alt text over name for image labels', async () => {
    render(<Avatar src="https://example.com/image.jpg" alt="Custom Avatar" name="Test User" />);

    const img = await screen.findByRole('img');
    expect(img).toHaveAttribute('alt', 'Custom Avatar');
  });

  it('does not trigger render-phase update warnings when src changes', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const { rerender } = render(<Avatar src="https://example.com/first.jpg" name="Test User" />);

    rerender(<Avatar src="https://example.com/second.jpg" name="Test User" />);

    await screen.findByRole('img');
    expect(errorSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('Cannot update a component while rendering a different component'),
    );

    errorSpy.mockRestore();
  });

  it('renders fallback when image fails to load', async () => {
    render(<Avatar src="broken-image.jpg" name="Broken Image" />);

    expect(await screen.findByText('BI')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole('img')).not.toBeInTheDocument());
  });

  it('renders children as fallback', () => {
    render(<Avatar>Custom</Avatar>);
    expect(screen.getByText('Custom')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const testClass = 'test-class';
    const { container } = render(<Avatar name="Class Test" className={testClass} />);
    expect(container.firstChild).toHaveClass(testClass);
  });

  it('renders as a different element when "asChild" prop is provided', () => {
    render(
      <Avatar asChild name="Link Avatar">
        <a href="https://example.com">Link Content</a>
      </Avatar>,
    );
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('should have no a11y violations', async () => {
    const { container } = render(<Avatar name="A11y Test" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
