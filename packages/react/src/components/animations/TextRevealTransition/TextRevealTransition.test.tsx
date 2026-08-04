import { fireEvent, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { createRef, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import 'vitest-axe/extend-expect';
import { TextRevealTransition } from './TextRevealTransition';

describe('TextRevealTransition', () => {
  it('renders text correctly', () => {
    const text = 'Hello';
    render(<TextRevealTransition>{text}</TextRevealTransition>);
    expect(screen.getByLabelText(text)).toBeInTheDocument();
  });

  it('splits text into characters for bounce animation', () => {
    const text = 'ABC';
    const { container } = render(
      <TextRevealTransition animationType="bounce">{text}</TextRevealTransition>,
    );
    const spans = container.querySelectorAll('span');
    expect(spans.length).toBeGreaterThanOrEqual(text.length);
    expect(container.textContent).toContain(text);
  });

  it('splits text into words for word-pop animation', () => {
    const text = 'Hello World';
    const { container } = render(
      <TextRevealTransition animationType="word-pop">{text}</TextRevealTransition>,
    );
    const spans = container.querySelectorAll('span');
    expect(spans.length).toBeGreaterThanOrEqual(2);
    expect(container.textContent).toContain('Hello');
    expect(container.textContent).toContain('World');
  });

  it('renders as a custom element', () => {
    render(
      <TextRevealTransition asChild>
        <h1>Heading</h1>
      </TextRevealTransition>,
    );
    const element = screen.getByLabelText('Heading');
    expect(element.tagName).toBe('H1');
    expect(screen.getByRole('heading', { name: 'Heading' })).toBe(element);
  });

  it('keeps one valid asChild host while merging refs, classes, rest props, and events', () => {
    const childMouseEnter = vi.fn();
    const transitionMouseEnter = vi.fn();
    const ref = createRef<HTMLHeadingElement>();
    const { container } = render(
      <TextRevealTransition
        ref={ref}
        asChild
        className="transition-class"
        data-testid="transition-host"
        onMouseEnter={transitionMouseEnter}
      >
        <h2 className="host-class" onMouseEnter={childMouseEnter}>
          Heading
        </h2>
      </TextRevealTransition>,
    );

    const host = screen.getByTestId('transition-host');
    expect(host.tagName).toBe('H2');
    expect(host).toHaveClass('transition-class', 'host-class');
    expect(ref.current).toBe(host);
    expect(container.childElementCount).toBe(1);
    fireEvent.mouseEnter(host);
    expect(childMouseEnter).toHaveBeenCalledOnce();
    expect(transitionMouseEnter).toHaveBeenCalledOnce();
  });

  it.each([
    ['img', <img key="img" alt="Artwork" />],
    ['input', <input key="input" aria-label="Nested field" />],
    ['Fragment', <>Fragment content</>],
    ['text', 'Text content'],
    ['multiple children', [<span key="a">First</span>, <span key="b">Second</span>]],
  ] as [string, ReactNode][])(
    'falls back to one div without injecting into %s asChild content',
    (_name, children) => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
      const { container } = render(
        <TextRevealTransition asChild data-testid="fallback-transition">
          {children}
        </TextRevealTransition>,
      );

      expect(screen.getByTestId('fallback-transition').tagName).toBe('DIV');
      expect(container.childElementCount).toBe(1);
      if (_name === 'img') expect(screen.getByRole('img', { name: 'Artwork' })).toBeInTheDocument();
      if (_name === 'input')
        expect(screen.getByRole('textbox', { name: 'Nested field' })).toBeInTheDocument();
      if (_name === 'Fragment') expect(container).toHaveTextContent('Fragment content');
      if (_name === 'text') expect(container).toHaveTextContent('Text content');
      if (_name === 'multiple children') expect(container).toHaveTextContent('FirstSecond');
      expect(consoleError).not.toHaveBeenCalled();
      consoleError.mockRestore();
    },
  );

  it('uses the same valid and fallback hosts during server rendering', () => {
    const validMarkup = renderToString(
      <TextRevealTransition asChild>
        <h2>Server heading</h2>
      </TextRevealTransition>,
    );
    const fallbackMarkup = renderToString(
      <TextRevealTransition asChild>
        <img alt="Server artwork" />
      </TextRevealTransition>,
    );

    expect(validMarkup).toContain('<h2');
    expect(fallbackMarkup).toContain('<div');
    expect(fallbackMarkup).toContain('<img');
  });

  it('falls back to a div when asChild does not receive a single host element', () => {
    const { container } = render(
      <TextRevealTransition asChild>
        <>Plain transition content</>
      </TextRevealTransition>,
    );

    expect(container.firstElementChild).toBeInstanceOf(HTMLDivElement);
    expect(screen.getByText('Plain transition content')).toBeInTheDocument();

    render(<TextRevealTransition asChild>Plain text content</TextRevealTransition>);
    expect(screen.getByLabelText('Plain text content')).toBeInstanceOf(HTMLDivElement);
  });

  it('falls back to bounce for an invalid runtime animation type', () => {
    render(
      <TextRevealTransition animationType={'unknown' as 'bounce'}>Fallback</TextRevealTransition>,
    );

    expect(screen.getByLabelText('Fallback')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <TextRevealTransition className="custom-test-class">Text</TextRevealTransition>,
    );
    expect(container.firstChild).toHaveClass('custom-test-class');
  });

  it('has no a11y violations', async () => {
    const text = 'Accessible Text';
    const { container } = render(<TextRevealTransition>{text}</TextRevealTransition>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
