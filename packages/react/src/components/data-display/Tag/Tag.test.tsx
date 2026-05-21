import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Tag, TagLabel, TagCloseButton } from './index';

describe('Tag', () => {
  it('renders correctly', () => {
    render(
      <Tag>
        <TagLabel>Test Tag</TagLabel>
        <TagCloseButton />
      </Tag>,
    );
    expect(screen.getByText('Test Tag')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });

  it('renders as child', () => {
    render(
      <Tag asChild>
        <div data-testid="custom-tag">
          <TagLabel asChild>
            <span data-testid="custom-label">Label</span>
          </TagLabel>
        </div>
      </Tag>,
    );

    expect(screen.getByTestId('custom-tag')).toBeInTheDocument();
    expect(screen.getByTestId('custom-tag').tagName).toBe('DIV');
    expect(screen.getByTestId('custom-label')).toBeInTheDocument();
    expect(screen.getByTestId('custom-label').tagName).toBe('SPAN');
  });

  it('TagCloseButton renders as child', () => {
    render(
      <Tag>
        <TagCloseButton asChild>
          <a href="/test" data-testid="custom-close">
            Close
          </a>
        </TagCloseButton>
      </Tag>,
    );
    const close = screen.getByTestId('custom-close');
    expect(close).toBeInTheDocument();
    expect(close.tagName).toBe('A');
  });

  it('handles close button click', () => {
    const handleClick = vi.fn();
    render(
      <Tag>
        <TagCloseButton onClick={handleClick} />
      </Tag>,
    );
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(handleClick).toHaveBeenCalled();
  });

  it('forwards ref', () => {
    const ref = { current: null };
    render(<Tag ref={ref}>Tag</Tag>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('should have no a11y violations', async () => {
    const { container } = render(
      <Tag>
        <TagLabel>Accessible Tag</TagLabel>
        <TagCloseButton />
      </Tag>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
