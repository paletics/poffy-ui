import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { TreeView } from './index';

const mockData = [
  {
    id: '1',
    name: 'Folder',
    children: [{ id: '1-1', name: 'File' }],
  },
  { id: '2', name: 'File 2' },
];

/**
 * ### Test Strategy: TreeView
 * - **Focus**: Correct rendering of auto and manual trees, expand/collapse logic, keyboard navigation, and a11y via axe.
 * - **DON'T**: Do not test visual aesthetics here; defer to Storybook VRT.
 */
describe('TreeView', () => {
  it('renders correctly', () => {
    render(<TreeView data={mockData} />);
    expect(screen.getByText('Folder')).toBeInTheDocument();
    expect(screen.getByText('File 2')).toBeInTheDocument();
  });

  it('renders APG tree roles for root and items', () => {
    render(<TreeView data={mockData} defaultExpandedIds={['1']} />);

    expect(screen.getByRole('tree')).toBeInTheDocument();
    expect(screen.getAllByRole('treeitem')).toHaveLength(3);
    expect(screen.getByRole('group')).toBeInTheDocument();
  });

  it('can expand and collapse items', () => {
    render(<TreeView data={mockData} />);

    const trigger = screen.getByRole('button', { name: /Folder/i });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('File')).toBeInTheDocument();

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('handles keyboard navigation (Enter/Space to toggle)', () => {
    render(<TreeView data={mockData} />);
    const trigger = screen.getByRole('button', { name: /Folder/i });

    trigger.focus();
    fireEvent.keyDown(trigger, { key: 'Enter', code: 'Enter' });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    fireEvent.keyDown(trigger, { key: ' ', code: 'Space' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('expands with ArrowRight and collapses with ArrowLeft', () => {
    render(<TreeView data={mockData} />);
    const trigger = screen.getByRole('button', { name: /Folder/i });

    fireEvent.keyDown(trigger, { key: 'ArrowRight', code: 'ArrowRight' });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('File')).toBeInTheDocument();

    fireEvent.keyDown(trigger, { key: 'ArrowLeft', code: 'ArrowLeft' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('applies public appearance classes and maps legacy variant aliases', () => {
    const { container, rerender } = render(<TreeView data={mockData} appearance="outline" />);
    expect(container.querySelector('[role="tree"]')).toHaveClass(
      'poffy-treeview__root--appearance_outline',
    );

    rerender(<TreeView data={mockData} variant="default" />);
    expect(container.querySelector('[role="tree"]')).toHaveClass(
      'poffy-treeview__root--appearance_soft',
    );
  });

  it('supports asChild triggers with the disclosure indicator', () => {
    render(
      <TreeView.Root>
        <TreeView.Item id="folder">
          <TreeView.Trigger asChild>
            <button type="button">Folder</button>
          </TreeView.Trigger>
          <TreeView.Content>
            <TreeView.Item id="file" hasChildren={false}>
              File
            </TreeView.Item>
          </TreeView.Content>
        </TreeView.Item>
      </TreeView.Root>,
    );

    const trigger = screen.getByRole('button', { name: /Folder/i });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('preserves trigger toggling when handlers are provided', () => {
    const handleClick = vi.fn();
    const handleKeyDown = vi.fn();

    render(
      <TreeView.Root>
        <TreeView.Item id="folder">
          <TreeView.Trigger onClick={handleClick} onKeyDown={handleKeyDown}>
            <TreeView.Label>Folder</TreeView.Label>
          </TreeView.Trigger>
          <TreeView.Content>
            <TreeView.Item id="file" hasChildren={false}>
              File
            </TreeView.Item>
          </TreeView.Content>
        </TreeView.Item>
      </TreeView.Root>,
    );

    const trigger = screen.getByRole('button', { name: /Folder/i });
    fireEvent.click(trigger);
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    fireEvent.keyDown(trigger, { key: 'ArrowLeft', code: 'ArrowLeft' });
    expect(handleKeyDown).toHaveBeenCalledTimes(1);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('allows trigger handlers to cancel toggling', () => {
    render(
      <TreeView.Root>
        <TreeView.Item id="folder">
          <TreeView.Trigger
            onClick={(event) => event.preventDefault()}
            onKeyDown={(event) => event.preventDefault()}
          >
            <TreeView.Label>Folder</TreeView.Label>
          </TreeView.Trigger>
          <TreeView.Content>
            <TreeView.Item id="file" hasChildren={false}>
              File
            </TreeView.Item>
          </TreeView.Content>
        </TreeView.Item>
      </TreeView.Root>,
    );

    const trigger = screen.getByRole('button', { name: /Folder/i });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    fireEvent.keyDown(trigger, { key: 'ArrowRight', code: 'ArrowRight' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('lets asChild child handlers cancel toggling', () => {
    const handleClick = vi.fn((event) => event.preventDefault());

    render(
      <TreeView.Root>
        <TreeView.Item id="folder">
          <TreeView.Trigger asChild>
            <button type="button" onClick={handleClick}>
              Folder
            </button>
          </TreeView.Trigger>
          <TreeView.Content>
            <TreeView.Item id="file" hasChildren={false}>
              File
            </TreeView.Item>
          </TreeView.Content>
        </TreeView.Item>
      </TreeView.Root>,
    );

    const trigger = screen.getByRole('button', { name: /Folder/i });
    fireEvent.click(trigger);

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('does not toggle expansion for leaf triggers', () => {
    const handleExpandedChange = vi.fn();
    const handleClick = vi.fn();
    const handleKeyDown = vi.fn();

    render(
      <TreeView.Root onExpandedChange={handleExpandedChange}>
        <TreeView.Item id="file" hasChildren={false}>
          <TreeView.Trigger onClick={handleClick} onKeyDown={handleKeyDown}>
            <TreeView.Label>File</TreeView.Label>
          </TreeView.Trigger>
        </TreeView.Item>
      </TreeView.Root>,
    );

    const trigger = screen.getByRole('button', { name: /File/i });
    expect(trigger).not.toHaveAttribute('aria-expanded');

    fireEvent.click(trigger);
    fireEvent.keyDown(trigger, { key: 'Enter', code: 'Enter' });
    fireEvent.keyDown(trigger, { key: ' ', code: 'Space' });
    fireEvent.keyDown(trigger, { key: 'ArrowRight', code: 'ArrowRight' });

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleKeyDown).toHaveBeenCalledTimes(3);
    expect(handleExpandedChange).not.toHaveBeenCalled();
    expect(trigger).not.toHaveAttribute('aria-expanded');
  });

  it('is accessible', async () => {
    const { container } = render(<TreeView data={mockData} defaultExpandedIds={['1']} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
