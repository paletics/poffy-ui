import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Tabs, TabList, TabTrigger, TabContent } from './index';

describe('Tabs', () => {
  it('renders default value content', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabList>
          <TabTrigger value="tab1">Tab 1</TabTrigger>
          <TabTrigger value="tab2">Tab 2</TabTrigger>
        </TabList>
        <TabContent value="tab1">Content 1</TabContent>
        <TabContent value="tab2">Content 2</TabContent>
      </Tabs>,
    );
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.getByText('Content 2')).not.toBeVisible();
  });

  it('switches content on click', () => {
    const onValueChange = vi.fn();
    render(
      <Tabs defaultValue="tab1" onValueChange={onValueChange}>
        <TabList>
          <TabTrigger value="tab1">Tab 1</TabTrigger>
          <TabTrigger value="tab2">Tab 2</TabTrigger>
        </TabList>
        <TabContent value="tab1">Content 1</TabContent>
        <TabContent value="tab2">Content 2</TabContent>
      </Tabs>,
    );

    fireEvent.click(screen.getByText('Tab 2'));
    expect(screen.getByText('Content 2')).toBeInTheDocument();
    expect(onValueChange).toHaveBeenCalledWith('tab2');
  });

  it('supports controlled mode', () => {
    const TestComponent = () => {
      return (
        <Tabs value="tab2">
          <TabList>
            <TabTrigger value="tab1">Tab 1</TabTrigger>
            <TabTrigger value="tab2">Tab 2</TabTrigger>
          </TabList>
          <TabContent value="tab1">Content 1</TabContent>
          <TabContent value="tab2">Content 2</TabContent>
        </Tabs>
      );
    };
    render(<TestComponent />);
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('does not render unselected content when lazyMount is true', () => {
    render(
      <Tabs defaultValue="tab1" lazyMount>
        <TabList>
          <TabTrigger value="tab1">Tab 1</TabTrigger>
          <TabTrigger value="tab2">Tab 2</TabTrigger>
        </TabList>
        <TabContent value="tab1">Content 1</TabContent>
        <TabContent value="tab2">Content 2</TabContent>
      </Tabs>,
    );
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
  });

  it('links tabpanel to its tab trigger via aria-labelledby', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabList>
          <TabTrigger value="tab1">Tab 1</TabTrigger>
        </TabList>
        <TabContent value="tab1">Content 1</TabContent>
      </Tabs>,
    );
    const panel = screen.getByRole('tabpanel');
    const labelId = panel.getAttribute('aria-labelledby');
    expect(labelId).toBe('tab-tab1');
    expect(document.getElementById(labelId!)).not.toBeNull();
  });

  it('maps public appearance to the internal visual recipe', () => {
    const { rerender } = render(
      <Tabs defaultValue="tab1" appearance="outline">
        <TabList>
          <TabTrigger value="tab1">Tab 1</TabTrigger>
          <TabTrigger value="tab2">Tab 2</TabTrigger>
        </TabList>
        <TabContent value="tab1">Content 1</TabContent>
        <TabContent value="tab2">Content 2</TabContent>
      </Tabs>,
    );

    expect(screen.getByRole('tablist')).toHaveClass('poffy-tabs__list--variant_enclosed');

    rerender(
      <Tabs defaultValue="tab1" appearance="soft">
        <TabList>
          <TabTrigger value="tab1">Tab 1</TabTrigger>
          <TabTrigger value="tab2">Tab 2</TabTrigger>
        </TabList>
        <TabContent value="tab1">Content 1</TabContent>
        <TabContent value="tab2">Content 2</TabContent>
      </Tabs>,
    );

    expect(screen.getByRole('tablist')).toHaveClass('poffy-tabs__list--variant_pill');
  });

  it('accepts pop indicator animation', () => {
    render(
      <Tabs defaultValue="tab1" indicatorAnimation="pop">
        <TabList>
          <TabTrigger value="tab1">Tab 1</TabTrigger>
          <TabTrigger value="tab2">Tab 2</TabTrigger>
        </TabList>
        <TabContent value="tab1">Content 1</TabContent>
        <TabContent value="tab2">Content 2</TabContent>
      </Tabs>,
    );

    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('aria-selected', 'true');
  });

  it('only keeps the selected tab in the sequential tab order', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabList>
          <TabTrigger value="tab1">Tab 1</TabTrigger>
          <TabTrigger value="tab2">Tab 2</TabTrigger>
        </TabList>
        <TabContent value="tab1">Content 1</TabContent>
        <TabContent value="tab2">Content 2</TabContent>
      </Tabs>,
    );

    expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('tabindex', '-1');
  });

  describe('keyboard navigation', () => {
    function renderTabs() {
      render(
        <Tabs defaultValue="tab1">
          <TabList>
            <TabTrigger value="tab1">Tab 1</TabTrigger>
            <TabTrigger value="tab2">Tab 2</TabTrigger>
            <TabTrigger value="tab3">Tab 3</TabTrigger>
          </TabList>
          <TabContent value="tab1">Content 1</TabContent>
          <TabContent value="tab2">Content 2</TabContent>
          <TabContent value="tab3">Content 3</TabContent>
        </Tabs>,
      );
      return {
        tab1: screen.getByText('Tab 1'),
        tab2: screen.getByText('Tab 2'),
        tab3: screen.getByText('Tab 3'),
      };
    }

    it('moves focus right with ArrowRight', () => {
      const { tab1, tab2 } = renderTabs();
      tab1.focus();
      fireEvent.keyDown(tab1, { key: 'ArrowRight' });
      expect(document.activeElement).toBe(tab2);
    });

    it('preserves roving focus when a custom list key handler is provided', () => {
      const handleKeyDown = vi.fn();
      render(
        <Tabs defaultValue="tab1">
          <TabList onKeyDown={handleKeyDown}>
            <TabTrigger value="tab1">Tab 1</TabTrigger>
            <TabTrigger value="tab2">Tab 2</TabTrigger>
          </TabList>
          <TabContent value="tab1">Content 1</TabContent>
          <TabContent value="tab2">Content 2</TabContent>
        </Tabs>,
      );

      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
      tab1.focus();

      fireEvent.keyDown(tab1, { key: 'ArrowRight' });

      expect(handleKeyDown).toHaveBeenCalled();
      expect(document.activeElement).toBe(tab2);
    });

    it('moves focus left with ArrowLeft', () => {
      const { tab2, tab1 } = renderTabs();
      tab2.focus();
      fireEvent.keyDown(tab2, { key: 'ArrowLeft' });
      expect(document.activeElement).toBe(tab1);
    });

    it('wraps around to last tab on ArrowLeft from first', () => {
      const { tab1, tab3 } = renderTabs();
      tab1.focus();
      fireEvent.keyDown(tab1, { key: 'ArrowLeft' });
      expect(document.activeElement).toBe(tab3);
    });

    it('wraps around to first tab on ArrowRight from last', () => {
      const { tab1, tab3 } = renderTabs();
      tab3.focus();
      fireEvent.keyDown(tab3, { key: 'ArrowRight' });
      expect(document.activeElement).toBe(tab1);
    });

    it('moves focus to first tab with Home key', () => {
      const { tab1, tab3 } = renderTabs();
      tab3.focus();
      fireEvent.keyDown(tab3, { key: 'Home' });
      expect(document.activeElement).toBe(tab1);
    });

    it('moves focus to last tab with End key', () => {
      const { tab1, tab3 } = renderTabs();
      tab1.focus();
      fireEvent.keyDown(tab1, { key: 'End' });
      expect(document.activeElement).toBe(tab3);
    });
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabList>
          <TabTrigger value="tab1">Tab 1</TabTrigger>
          <TabTrigger value="tab2">Tab 2</TabTrigger>
        </TabList>
        <TabContent value="tab1">Content 1</TabContent>
        <TabContent value="tab2">Content 2</TabContent>
      </Tabs>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
