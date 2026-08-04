import { fireEvent, render } from '@testing-library/react';
import type { ReferenceType } from '@floating-ui/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { createOverlaySection } from './createOverlaySection';
import type { OverlayContext } from './types';

const classes = {
  body: 'body-slot',
  footer: 'footer-slot',
  header: 'header-slot',
};

const useFakeContext = () => ({ classes }) as OverlayContext<ReferenceType>;

describe('createOverlaySection', () => {
  it.each(['header', 'body', 'footer'] as const)(
    'creates the %s slot with the shared section contract',
    (slot) => {
      const displayName = `TestOverlay${slot}`;
      const Section = createOverlaySection(useFakeContext, displayName, slot);
      const ref = createRef<HTMLDivElement>();
      const defaultRender = render(
        <Section
          ref={ref}
          aria-label={`${slot} section`}
          className="consumer-class"
          data-rest-prop={slot}
        >
          Content
        </Section>,
      );

      const element = defaultRender.getByLabelText(`${slot} section`);
      expect(element.tagName).toBe('DIV');
      expect(element).toHaveClass(classes[slot], 'consumer-class');
      expect(element).toHaveAttribute('data-rest-prop', slot);
      expect(element).toHaveTextContent('Content');
      expect(ref.current).toBe(element);
      expect(Section.displayName).toBe(displayName);
      defaultRender.unmount();

      const childRef = createRef<HTMLElement>();
      const childOwnRef = createRef<HTMLElement>();
      const callOrder: string[] = [];
      const asChildRender = render(
        <Section
          ref={childRef}
          asChild
          className="consumer-class"
          data-rest-prop="slot-value"
          onClick={() => {
            callOrder.push('slot');
          }}
        >
          <section
            ref={childOwnRef}
            className="child-class"
            data-rest-prop="child-value"
            data-testid={`${slot}-child`}
            onClick={() => {
              callOrder.push('child');
            }}
          >
            Content
          </section>
        </Section>,
      );
      const child = asChildRender.getByTestId(`${slot}-child`);

      expect(child.tagName).toBe('SECTION');
      expect(child).toHaveClass(classes[slot], 'consumer-class', 'child-class');
      expect(child).toHaveAttribute('data-rest-prop', 'child-value');
      expect(childRef.current).toBe(child);
      expect(childOwnRef.current).toBe(child);
      expect(asChildRender.container.childElementCount).toBe(1);
      expect(asChildRender.container.firstElementChild).toBe(child);
      fireEvent.click(child);
      expect(callOrder).toEqual(['child', 'slot']);
    },
  );

  it('falls back to a div when asChild does not receive one host element', () => {
    const Section = createOverlaySection(useFakeContext, 'TestOverlaySection', 'body');
    const { container } = render(<Section asChild>Content</Section>);

    expect(container.firstElementChild).toHaveProperty('tagName', 'DIV');
    expect(container).toHaveTextContent('Content');
  });

  it('falls back to a div rather than delegating to an interactive host', () => {
    const Section = createOverlaySection(useFakeContext, 'TestOverlaySection', 'body');
    const ref = createRef<HTMLDivElement>();
    const { container, getByRole } = render(
      <Section ref={ref} asChild className="consumer-class">
        <button type="button">Action</button>
      </Section>,
    );

    expect(container.firstElementChild).toHaveProperty('tagName', 'DIV');
    expect(container.firstElementChild).toHaveClass('body-slot', 'consumer-class');
    expect(ref.current).toBe(container.firstElementChild);
    expect(getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });
});
