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

  it('maps legacy variant aliases to public appearance', () => {
    const { container } = render(<Card variant="filled">Content</Card>);
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
