import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { List, ListItem, ListItemText } from './index';

describe('List', () => {
  it('renders list items', () => {
    render(
      <List>
        <ListItem>
          <ListItemText>Item 1</ListItemText>
        </ListItem>
        <ListItem>
          <ListItemText>Item 2</ListItemText>
        </ListItem>
      </List>,
    );
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('renders ordered list', () => {
    const { container } = render(
      <List variant="ordered">
        <ListItem>1</ListItem>
      </List>,
    );
    expect(container.querySelector('ol')).toBeInTheDocument();
  });

  it('supports polymorphism via asChild', () => {
    const { container } = render(
      <List asChild>
        <nav>
          <ListItem asChild>
            <a href="/test">Link</a>
          </ListItem>
        </nav>
      </List>,
    );
    expect(container.querySelector('nav')).toBeInTheDocument();
    const link = container.querySelector('a');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
  });

  it('should have no a11y violations', async () => {
    const { container } = render(
      <List>
        <ListItem>Item 1</ListItem>
      </List>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
