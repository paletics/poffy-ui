import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Card, CardBody, CardFooter, CardHeader } from '.';

describe('Card', () => {
  it('renders all parts correctly', () => {
    render(
      <Card>
        <CardHeader>Header</CardHeader>
        <CardBody>Body</CardBody>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );

    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('applies public appearance, intent, and shape classes', () => {
    const { container } = render(
      <Card appearance="outline" intent="success" shape="square">
        Content
      </Card>,
    );
    expect(container.firstChild).toHaveClass('poffy-card__root--appearance_outline');
    expect(container.firstChild).toHaveClass('poffy-card__root--intent_success');
    expect(container.firstChild).toHaveClass('poffy-card__root--shape_square');
  });

  it('supports neo appearance as a public surface option', () => {
    const { container } = render(<Card appearance="neo">Content</Card>);
    expect(container.firstChild).toHaveClass('poffy-card__root--appearance_neo');
  });

  it('applies the canonical soft appearance', () => {
    const { container } = render(<Card appearance="soft">Content</Card>);
    expect(container.firstChild).toHaveClass('poffy-card__root--appearance_soft');
  });

  it('supports asChild pattern', () => {
    render(
      <Card asChild>
        <article>Article Card</article>
      </Card>,
    );
    expect(screen.getByRole('article')).toBeInTheDocument();
  });

  it('falls back to a container when the asChild host cannot contain card parts', () => {
    render(
      <Card asChild>
        <button type="button" data-testid="invalid-card-host">
          <CardFooter>
            <button type="button">Action</button>
          </CardFooter>
        </button>
      </Card>,
    );

    expect(screen.queryByTestId('invalid-card-host')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });

  it('passes accessibility checks', async () => {
    const { container } = render(
      <Card>
        <CardHeader>Card Title</CardHeader>
        <CardBody>Card content goes here.</CardBody>
        <CardFooter>Actions</CardFooter>
      </Card>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
