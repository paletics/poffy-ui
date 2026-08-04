import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Avatar } from './Avatar';

const ForwardingAvatarRoot = forwardRef<HTMLSpanElement, ComponentPropsWithoutRef<'span'>>(
  ({ children, ...props }, ref) => (
    <span ref={ref} {...props}>
      {children}
    </span>
  ),
);
ForwardingAvatarRoot.displayName = 'ForwardingAvatarRoot';

describe('Avatar', () => {
  it('renders initials when no src provided', () => {
    render(<Avatar name="John Doe" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('applies the square shape variant', () => {
    render(<Avatar data-testid="avatar" name="John Doe" shape="square" />);
    expect(screen.getByTestId('avatar').className).toContain('shape_square');
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

  it('passes crossOrigin to the rendered image', async () => {
    render(
      <Avatar.Root>
        <Avatar.Image src="https://example.com/image.jpg" crossOrigin="anonymous" alt="Test User" />
      </Avatar.Root>,
    );

    expect(((await screen.findByRole('img')) as HTMLImageElement).crossOrigin).toBe('anonymous');
  });

  it('uses managed image props when delegating to a native image child', () => {
    render(
      <Avatar.Root>
        <Avatar.Image asChild src="https://example.com/managed.jpg" alt="Managed user">
          <img src="https://example.com/conflicting.jpg" alt="Conflicting user" />
        </Avatar.Image>
      </Avatar.Root>,
    );

    const image = screen.getByRole('img', { name: 'Managed user' });
    expect(image).toHaveAttribute('src', 'https://example.com/managed.jpg');
  });

  it('owns data-loading across direct and delegated image props', async () => {
    render(
      <Avatar.Root>
        <Avatar.Image
          src="https://example.com/managed-loading.jpg"
          alt="Managed loading"
          {...({ 'data-loading': 'stale-outer-value' } as never)}
          asChild
        >
          <img alt="" data-loading="stale-child-value" />
        </Avatar.Image>
      </Avatar.Root>,
    );

    const image = screen.getByRole('img', { name: 'Managed loading' });
    expect(image).toHaveAttribute('data-loading', '');

    fireEvent.load(image);
    await waitFor(() => expect(image).not.toHaveAttribute('data-loading'));
  });

  it('synchronizes an already-complete cached image during layout', async () => {
    const completeSpy = vi
      .spyOn(HTMLImageElement.prototype, 'complete', 'get')
      .mockReturnValue(true);
    const naturalWidthSpy = vi
      .spyOn(HTMLImageElement.prototype, 'naturalWidth', 'get')
      .mockReturnValue(64);
    try {
      const onStatusChange = vi.fn();
      const { container } = render(
        <Avatar
          src="https://example.com/cached.jpg"
          name="Cached User"
          onStatusChange={onStatusChange}
        />,
      );

      await waitFor(() => expect(container.firstChild).toHaveAttribute('data-status', 'loaded'));
      expect(screen.getByRole('img', { name: 'Cached User' })).not.toHaveAttribute('data-loading');
      expect(onStatusChange).toHaveBeenCalledWith('loaded');
    } finally {
      completeSpy.mockRestore();
      naturalWidthSpy.mockRestore();
    }
  });

  it('synchronizes an already-complete failed image during layout', async () => {
    const completeSpy = vi
      .spyOn(HTMLImageElement.prototype, 'complete', 'get')
      .mockReturnValue(true);
    const naturalWidthSpy = vi
      .spyOn(HTMLImageElement.prototype, 'naturalWidth', 'get')
      .mockReturnValue(0);
    try {
      const { container } = render(
        <Avatar src="https://example.com/cached-error.jpg" name="Cached Error" />,
      );

      await waitFor(() => expect(container.firstChild).toHaveAttribute('data-status', 'error'));
      expect(screen.queryByRole('img', { name: 'Cached Error' })).not.toBeInTheDocument();
      expect(screen.getByLabelText('Cached Error')).toHaveTextContent('CE');
    } finally {
      completeSpy.mockRestore();
      naturalWidthSpy.mockRestore();
    }
  });

  it('falls back to a native image when an asChild image target is not an img', () => {
    render(
      <Avatar.Root>
        <Avatar.Image asChild src="https://example.com/image.jpg" alt="Test user">
          <div />
        </Avatar.Image>
      </Avatar.Root>,
    );

    expect(screen.getByRole('img', { name: 'Test user' }).tagName).toBe('IMG');
  });

  it('falls back to its native host for invalid Root and Fallback asChild children', () => {
    const { container } = render(
      <Avatar.Root asChild>
        <>Root content</>
      </Avatar.Root>,
    );
    expect(container.firstChild?.nodeName).toBe('SPAN');

    render(
      <Avatar.Root>
        <Avatar.Fallback asChild>Fallback content</Avatar.Fallback>
      </Avatar.Root>,
    );
    expect(screen.getByText('Fallback content').tagName).toBe('SPAN');
  });

  it('rejects void hosts for compound Root and Fallback asChild usage', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const { container } = render(
      <Avatar.Root asChild>
        <img data-testid="invalid-root" alt="Avatar host" />
      </Avatar.Root>,
    );

    expect(container.firstChild?.nodeName).toBe('SPAN');
    expect(screen.getByTestId('invalid-root').parentElement?.nodeName).toBe('SPAN');

    render(
      <Avatar.Root>
        <Avatar.Fallback asChild>
          <img data-testid="invalid-fallback" alt="Fallback host" />
        </Avatar.Fallback>
      </Avatar.Root>,
    );

    expect(screen.getByTestId('invalid-fallback').parentElement?.nodeName).toBe('SPAN');
    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('falls back to its native host for a void shorthand asChild child', () => {
    const { container } = render(
      <Avatar asChild src="https://example.com/image.jpg" name="Test User">
        <img alt="Original portrait" />
      </Avatar>,
    );

    expect(container.firstChild?.nodeName).toBe('SPAN');
    expect(screen.getByRole('img', { name: 'Test User' })).toBeInTheDocument();
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

    fireEvent.error(screen.getByRole('img', { name: 'Broken Image' }));
    expect(await screen.findByLabelText('Broken Image')).toHaveTextContent('BI');
    await waitFor(() => expect(screen.queryByRole('img')).not.toBeInTheDocument());
  });

  it('restores the fallback when the rendered image reports an error', async () => {
    const { container } = render(<Avatar src="https://example.com/image.jpg" name="Test User" />);

    const image = screen.getByRole('img', { name: 'Test User' });
    fireEvent.load(image);
    await waitFor(() => expect(container.firstChild).toHaveAttribute('data-status', 'loaded'));
    fireEvent.error(image);

    await waitFor(() => expect(container.firstChild).toHaveAttribute('data-status', 'error'));
    expect(screen.getByLabelText('Test User')).toHaveTextContent('TU');
    expect(screen.queryByRole('img', { name: 'Test User' })).not.toBeInTheDocument();
  });

  it('reports loading when an existing shorthand image source changes', async () => {
    const onStatusChange = vi.fn();
    const { rerender } = render(
      <Avatar
        src="https://example.com/first.jpg"
        name="Test User"
        onStatusChange={onStatusChange}
      />,
    );

    fireEvent.load(screen.getByRole('img', { name: 'Test User' }));
    await waitFor(() => expect(onStatusChange).toHaveBeenCalledWith('loaded'));
    rerender(
      <Avatar
        src="https://example.com/second.jpg"
        name="Test User"
        onStatusChange={onStatusChange}
      />,
    );

    await waitFor(() => expect(onStatusChange).toHaveBeenLastCalledWith('loading'));
  });

  it('ignores events from the replaced image host after a source change', () => {
    const { container, rerender } = render(
      <Avatar src="https://example.com/first.jpg" name="Test User" />,
    );
    const previousImage = screen.getByRole('img', { name: 'Test User' });

    rerender(<Avatar src="https://example.com/second.jpg" name="Test User" />);
    fireEvent.error(previousImage);

    expect(container.firstChild).toHaveAttribute('data-status', 'loading');
    expect(screen.getByRole('img', { name: 'Test User' })).toHaveAttribute(
      'src',
      'https://example.com/second.jpg',
    );
  });

  it('uses an empty alt value when Avatar.Image is decorative', () => {
    const { container } = render(
      <Avatar.Root>
        <Avatar.Image src="https://example.com/image.jpg" />
        <Avatar.Fallback name="Jane Doe" />
      </Avatar.Root>,
    );

    expect(container.querySelector('img')).toHaveAttribute('alt', '');
  });

  it('removes accessible naming attributes from decorative images and delegated hosts', () => {
    const { container, rerender } = render(
      <Avatar.Root>
        <Avatar.Image
          decorative
          src="https://example.com/decorative.jpg"
          {...({ 'aria-label': 'Ignored portrait', 'aria-labelledby': 'ignored-label' } as never)}
        />
      </Avatar.Root>,
    );

    let image = container.querySelector('img');
    expect(image).toHaveAttribute('alt', '');
    expect(image).not.toHaveAttribute('aria-label');
    expect(image).not.toHaveAttribute('aria-labelledby');

    rerender(
      <Avatar.Root>
        <Avatar.Image decorative asChild src="https://example.com/decorative.jpg">
          <img alt="" aria-label="Child portrait" aria-labelledby="child-label" />
        </Avatar.Image>
      </Avatar.Root>,
    );

    image = container.querySelector('img');
    expect(image).toHaveAttribute('alt', '');
    expect(image).not.toHaveAttribute('aria-label');
    expect(image).not.toHaveAttribute('aria-labelledby');
  });

  it('does not render an image element when Avatar.Image has no source', () => {
    const { container } = render(
      <Avatar.Root>
        <Avatar.Image />
        <Avatar.Fallback name="Jane Doe" />
      </Avatar.Root>,
    );

    expect(container.querySelector('img')).toBeNull();
    expect(screen.getByLabelText('Jane Doe')).toHaveTextContent('JD');
  });

  it('preserves explicit fallback accessibility attributes', () => {
    render(
      <Avatar.Root>
        <Avatar.Fallback aria-label="Profile unavailable">?</Avatar.Fallback>
      </Avatar.Root>,
    );

    expect(screen.getByLabelText('Profile unavailable')).toHaveTextContent('?');
  });

  it('does not inject an empty image into an asChild avatar without src', () => {
    const { container } = render(
      <Avatar asChild name="Link Avatar">
        <a href="https://example.com">Link Content</a>
      </Avatar>,
    );

    expect(container.querySelector('img')).toBeNull();
    expect(screen.getByRole('link', { name: 'Link ContentLink Avatar' })).toBeInTheDocument();
  });

  it('prefers an explicit fallback label over generated initials', () => {
    render(
      <Avatar.Root>
        <Avatar.Fallback name="Jane Doe" aria-label="Profile unavailable" />
      </Avatar.Root>,
    );

    expect(screen.getByLabelText('Profile unavailable')).toHaveTextContent('JD');
  });

  it('restores the fallback when a loaded shorthand image source is removed', async () => {
    const { rerender } = render(<Avatar src="https://example.com/image.jpg" name="Test User" />);

    fireEvent.load(screen.getByRole('img', { name: 'Test User' }));
    await waitFor(() => expect(screen.queryByLabelText('Test User')).toBeNull());

    rerender(<Avatar name="Test User" />);

    expect(screen.getByLabelText('Test User')).toHaveTextContent('TU');
  });

  it('uses the aggregate status when compound images settle in different states', async () => {
    const onStatusChange = vi.fn();
    const { container } = render(
      <Avatar.Root onStatusChange={onStatusChange}>
        <Avatar.Image src="https://example.com/image.jpg" alt="Loaded user" />
        <Avatar.Image src="broken-image.jpg" alt="Broken user" />
        <Avatar.Fallback name="Test User" />
      </Avatar.Root>,
    );

    fireEvent.load(screen.getByRole('img', { name: 'Loaded user' }));
    fireEvent.error(screen.getByRole('img', { name: 'Broken user' }));
    await waitFor(() => expect(container.firstChild).toHaveAttribute('data-status', 'loaded'));
    expect(screen.queryByLabelText('Test User')).not.toBeInTheDocument();
    expect(onStatusChange).toHaveBeenCalledWith('loaded');
    expect(onStatusChange).not.toHaveBeenCalledWith('error');
  });

  it('shows the fallback only after every compound image fails', async () => {
    const { container } = render(
      <Avatar.Root>
        <Avatar.Image src="broken-image-one.jpg" alt="Broken user one" />
        <Avatar.Image src="broken-image-two.jpg" alt="Broken user two" />
        <Avatar.Fallback name="Test User" />
      </Avatar.Root>,
    );

    fireEvent.error(screen.getByRole('img', { name: 'Broken user one' }));
    fireEvent.error(screen.getByRole('img', { name: 'Broken user two' }));
    await waitFor(() => expect(container.firstChild).toHaveAttribute('data-status', 'error'));
    expect(screen.getByLabelText('Test User')).toHaveTextContent('TU');
  });

  it('hides the loading fallback from assistive technology while an image is pending', () => {
    const { container } = render(<Avatar src="https://example.com/image.jpg" name="Test User" />);

    expect(screen.getByText('TU')).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelector('[aria-label="Test User"]')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
  });

  it('hides an image fallback in the server-rendered markup', () => {
    const markup = renderToStaticMarkup(
      <Avatar src="https://example.com/image.jpg" name="Test User" />,
    );

    expect(markup).toContain('alt="Test User"');
    expect(markup).toContain('aria-label="Test User"');
    expect(markup).toMatch(/aria-label="Test User"[^>]*aria-hidden="true"/);
  });

  it('does not hide the fallback for an image inside an opaque component', () => {
    const Suppress = ({ children: _children }: { children: React.ReactNode }) => null;
    render(
      <Avatar.Root>
        <Suppress>
          <Avatar.Image src="https://example.com/image.jpg" alt="Test User" />
        </Suppress>
        <Avatar.Fallback name="Test User" />
      </Avatar.Root>,
    );

    expect(screen.getByLabelText('Test User')).not.toHaveAttribute('aria-hidden');
  });

  it('preserves a custom fallback label while managing its loading visibility', async () => {
    render(
      <Avatar.Root>
        <Avatar.Image src="https://example.com/image.jpg" alt="Test User" />
        <Avatar.Fallback asChild>
          <span aria-label="Profile unavailable">?</span>
        </Avatar.Fallback>
      </Avatar.Root>,
    );

    const fallback = screen.getByLabelText('Profile unavailable');
    expect(fallback).toHaveAttribute('aria-hidden', 'true');

    fireEvent.error(screen.getByRole('img', { name: 'Test User' }));
    await waitFor(() => expect(fallback).not.toHaveAttribute('aria-hidden'));
    expect(fallback).toHaveAccessibleName('Profile unavailable');
  });

  it('renders children as fallback', () => {
    render(<Avatar>Custom</Avatar>);
    expect(screen.getByText('Custom')).toBeInTheDocument();
  });

  it('reapplies fallback delay when delayMs changes', () => {
    vi.useFakeTimers();
    try {
      const { rerender } = render(
        <Avatar.Root>
          <Avatar.Fallback name="Jane Doe" />
        </Avatar.Root>,
      );
      expect(screen.getByText('JD')).toBeInTheDocument();

      rerender(
        <Avatar.Root>
          <Avatar.Fallback name="Jane Doe" delayMs={100} />
        </Avatar.Root>,
      );
      expect(screen.queryByText('JD')).not.toBeInTheDocument();

      act(() => vi.advanceTimersByTime(100));
      expect(screen.getByText('JD')).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
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

  it('falls back to a noninteractive native host for decorative interactive asChild usage', async () => {
    const { container } = render(
      <>
        <Avatar decorative asChild name="Decorative shorthand">
          <button type="button">Shorthand content</button>
        </Avatar>
        <Avatar.Root decorative asChild>
          <a href="/profile">
            <Avatar.Fallback>Compound content</Avatar.Fallback>
          </a>
        </Avatar.Root>
        <Avatar.Root decorative asChild>
          <div role="button">Role content</div>
        </Avatar.Root>
        <Avatar.Root decorative asChild>
          <div tabIndex={-1}>Programmatic focus content</div>
        </Avatar.Root>
        <Avatar.Root decorative asChild>
          <div contentEditable>Editable content</div>
        </Avatar.Root>
      </>,
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(container.querySelector('[tabindex], [contenteditable]')).toBeNull();
    expect(screen.getByText('Shorthand content').closest('[aria-hidden="true"]')?.tagName).toBe(
      'SPAN',
    );
    expect(screen.getByText('Compound content').closest('[aria-hidden="true"]')?.tagName).toBe(
      'SPAN',
    );
    for (const text of ['Role content', 'Programmatic focus content', 'Editable content']) {
      expect(screen.getByText(text).closest('[aria-hidden="true"]')?.tagName).toBe('SPAN');
    }
    expect(await axe(container)).toHaveNoViolations();
  });

  it('preserves a verifiably noninteractive decorative asChild host', () => {
    render(
      <Avatar.Root decorative asChild>
        <span data-testid="decorative-host">
          <Avatar.Fallback>Decorative content</Avatar.Fallback>
        </span>
      </Avatar.Root>,
    );

    expect(screen.getByTestId('decorative-host')).toHaveAttribute('aria-hidden', 'true');
  });

  it('detects an image across an accepted asChild forwarding boundary on the server', () => {
    const markup = renderToStaticMarkup(
      <Avatar.Root asChild>
        <ForwardingAvatarRoot>
          <Avatar.Image src="https://example.com/image.jpg" alt="Test User" />
          <Avatar.Fallback name="Test User" />
        </ForwardingAvatarRoot>
      </Avatar.Root>,
    );

    expect(markup).toContain('aria-hidden="true"');
    expect(markup).toContain('src="https://example.com/image.jpg"');
  });

  it('should have no a11y violations', async () => {
    const { container } = render(<Avatar name="A11y Test" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
