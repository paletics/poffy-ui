import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Breadcrumbs, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from './index';

describe('Breadcrumbs', () => {
  it('renders links and separators', () => {
    render(
      <Breadcrumbs>
        <BreadcrumbItem>
          <BreadcrumbLink href="/test">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/test">Category</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumbs>,
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('/')).toBeInTheDocument();
  });

  it('renders custom separator', () => {
    render(
      <Breadcrumbs separator=">">
        <BreadcrumbItem>
          <BreadcrumbLink href="/home">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/category">Category</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumbs>,
    );
    expect(screen.getByText('>')).toBeInTheDocument();
  });

  it('marks current page with aria-current and renders as span', () => {
    render(
      <Breadcrumbs>
        <BreadcrumbItem>
          <BreadcrumbLink href="/home">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink isCurrentPage>Current</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumbs>,
    );
    const currentLink = screen.getByText('Current');
    expect(currentLink).toHaveAttribute('aria-current', 'page');
    expect(currentLink.tagName).toBe('SPAN');
  });

  it('renders nav with accessible label', () => {
    render(
      <Breadcrumbs>
        <BreadcrumbItem>
          <BreadcrumbLink href="/home">Home</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumbs>,
    );
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
  });

  it('renders as span when both asChild and isCurrentPage are true', () => {
    render(
      <Breadcrumbs>
        <BreadcrumbItem>
          <BreadcrumbLink href="/home">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink asChild isCurrentPage data-testid="current-link">
            <a href="/current">Current</a>
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumbs>,
    );
    const current = screen.getByTestId('current-link');
    expect(current.tagName).toBe('SPAN');
    expect(current).toHaveAttribute('aria-current', 'page');
  });

  it('BreadcrumbSeparator renders as li with aria-hidden', () => {
    render(
      <Breadcrumbs separator="→">
        <BreadcrumbItem>
          <BreadcrumbLink href="/home">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink isCurrentPage>Current</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumbs>,
    );
    const separators = screen.getAllByText('→');
    expect(separators.length).toBeGreaterThan(0);
    separators.forEach((el) => {
      expect(el.tagName).toBe('LI');
      expect(el).toHaveAttribute('aria-hidden', 'true');
    });
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Breadcrumbs>
        <BreadcrumbItem>
          <BreadcrumbLink href="/home">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/category">Category</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink isCurrentPage>Current Page</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumbs>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
