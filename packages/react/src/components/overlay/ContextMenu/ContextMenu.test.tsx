import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Mock } from 'vitest';
import { axe } from 'vitest-axe';
import { ContextMenu } from './ContextMenu';
import { ContextMenuItem } from './ContextMenu.types';

/**
 * ### Test Strategy: ContextMenu
 * - **Focus**: ContextMenu must correctly open over a simulated coordinate, display provided items, and correctly fire their respective actions while closing the menu upon selection. Keyboard navigation must strictly conform to WAI-ARIA standards.
 * - **DON'T**: Do not test positioning mathematics since Floating UI provides that guarantee. Focus solely on component API mapping and structural tests.
 */
describe('ContextMenu', () => {
  let mockOnClose: Mock<() => void>;

  beforeEach(() => {
    mockOnClose = vi.fn<() => void>();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const position = { x: 100, y: 100 };
  const items: ContextMenuItem[] = [
    { id: '1', label: 'Item 1', type: 'item', onClick: vi.fn() },
    { id: '2', type: 'separator' },
    { id: '3', label: 'Item 3', type: 'item', disabled: true },
  ];

  it('does not render when open is false', () => {
    render(<ContextMenu items={items} position={position} open={false} onClose={mockOnClose} />);
    expect(screen.queryByText('Item 1')).toBeNull();
  });

  it('renders when open is true', () => {
    render(<ContextMenu items={items} position={position} open={true} onClose={mockOnClose} />);
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
    expect(screen.getByRole('menu', { hidden: true })).toHaveAttribute('data-brand', 'blue');
    expect(screen.getByRole('menu', { hidden: true })).toHaveAttribute('data-theme', 'light');
  });

  it('calls onClick and onClose when an item is clicked', () => {
    render(<ContextMenu items={items} position={position} open={true} onClose={mockOnClose} />);
    fireEvent.click(screen.getByText('Item 1'));
    expect(items[0].onClick).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('does not call onClick or onClose when a disabled item is clicked', () => {
    render(<ContextMenu items={items} position={position} open={true} onClose={mockOnClose} />);
    fireEvent.click(screen.getByText('Item 3'));
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('activates item on Enter key', () => {
    render(<ContextMenu items={items} position={position} open={true} onClose={mockOnClose} />);
    const [firstItem] = screen.getAllByRole('menuitem', { hidden: true });
    fireEvent.keyDown(firstItem, { key: 'Enter' });
    expect(items[0].onClick).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('activates item on Space key', () => {
    render(<ContextMenu items={items} position={position} open={true} onClose={mockOnClose} />);
    const [firstItem] = screen.getAllByRole('menuitem', { hidden: true });
    fireEvent.keyDown(firstItem, { key: ' ' });
    expect(items[0].onClick).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('does not activate disabled item on Enter key', () => {
    render(<ContextMenu items={items} position={position} open={true} onClose={mockOnClose} />);
    const menuitems = screen.getAllByRole('menuitem', { hidden: true });
    fireEvent.keyDown(menuitems[1], { key: 'Enter' });
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('has no accessibility violations when open', async () => {
    render(<ContextMenu items={items} position={position} open={true} onClose={mockOnClose} />);
    expect(await axe(document.body)).toHaveNoViolations();
  });
});
