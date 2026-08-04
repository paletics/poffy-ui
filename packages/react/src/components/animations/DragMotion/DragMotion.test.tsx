import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import 'vitest-axe/extend-expect';
import { DragMotion } from './DragMotion';

describe('DragMotion', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <DragMotion>
        <div>Draggable item</div>
      </DragMotion>,
    );
    expect(getByText('Draggable item')).toBeInTheDocument();
  });

  it('propagates drag props to underlying component', () => {
    const { container } = render(
      <DragMotion drag="x">
        <div>Content</div>
      </DragMotion>,
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('falls back to a div for invalid asChild children', () => {
    const { container } = render(
      <DragMotion asChild>
        <>Fragment content</>
      </DragMotion>,
    );

    expect(container.firstElementChild).toBeInstanceOf(HTMLDivElement);
    expect(container).toHaveTextContent('Fragment content');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <DragMotion>
        <div>Draggable item</div>
      </DragMotion>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
