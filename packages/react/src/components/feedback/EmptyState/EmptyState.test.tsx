import { fireEvent, render, screen } from '@testing-library/react';
import { createRef, type ComponentType, type ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { EmptyState } from './EmptyState';
import { EmptyStateActions } from './EmptyStateActions';
import { EmptyStateDescription } from './EmptyStateDescription';
import { EmptyStateIcon } from './EmptyStateIcon';
import { EmptyStateTitle } from './EmptyStateTitle';
import { LocaleProvider } from '@/providers/LocaleProvider';

const RuntimeEmptyStateIcon = EmptyStateIcon as unknown as ComponentType<
  Record<string, unknown> & { children?: ReactNode }
>;

describe('EmptyState Component', () => {
  it('renders title and description', () => {
    render(
      <EmptyState>
        <EmptyStateTitle>No Data</EmptyStateTitle>
        <EmptyStateDescription>Nothing to display</EmptyStateDescription>
      </EmptyState>,
    );
    expect(screen.getByText('No Data')).toBeInTheDocument();
    expect(screen.getByText('Nothing to display')).toBeInTheDocument();
  });

  it('uses safe semantic hosts for title and description asChild', () => {
    render(
      <EmptyState>
        <EmptyStateTitle asChild>
          <h2>Safe title</h2>
        </EmptyStateTitle>
        <EmptyStateDescription asChild>
          <p>Safe description</p>
        </EmptyStateDescription>
      </EmptyState>,
    );

    expect(screen.getByRole('heading', { level: 2, name: 'Safe title' })).toBeInTheDocument();
    expect(screen.getByText('Safe description').tagName).toBe('P');
  });

  it('falls back to default semantics for unsafe title and description hosts', () => {
    render(
      <EmptyState>
        <EmptyStateTitle asChild data-testid="title-root">
          <button>Unsafe title</button>
        </EmptyStateTitle>
        <EmptyStateDescription asChild data-testid="description-root">
          <div>Unsafe description</div>
        </EmptyStateDescription>
      </EmptyState>,
    );

    expect(screen.getByTestId('title-root').tagName).toBe('H3');
    expect(screen.getByRole('heading', { level: 3, name: 'Unsafe title' })).toBeInTheDocument();
    expect(screen.getByTestId('description-root').tagName).toBe('P');
    expect(screen.getByText('Unsafe description').tagName).toBe('P');
  });

  it('keeps fallback content valid when invalid hosts contain blocks', () => {
    render(
      <EmptyState>
        <EmptyStateTitle asChild data-testid="title-root">
          <>
            <div>Nested title</div>
          </>
        </EmptyStateTitle>
        <EmptyStateDescription asChild data-testid="description-root">
          <>
            <div>Nested description</div>
          </>
        </EmptyStateDescription>
      </EmptyState>,
    );

    expect(screen.getByTestId('title-root')).toHaveTextContent('Nested title');
    expect(screen.getByTestId('title-root').querySelector('div')).toBeNull();
    expect(screen.getByTestId('description-root')).toHaveTextContent('Nested description');
    expect(screen.getByTestId('description-root').querySelector('div')).toBeNull();
  });

  it('keeps default title and description content valid with native blocks', () => {
    render(
      <EmptyState>
        <EmptyStateTitle data-testid="default-title">
          <div>Default title</div>
        </EmptyStateTitle>
        <EmptyStateDescription data-testid="default-description">
          <div>Default description</div>
        </EmptyStateDescription>
      </EmptyState>,
    );

    expect(screen.getByTestId('default-title').tagName).toBe('H3');
    expect(screen.getByTestId('default-title').querySelector('div')).toBeNull();
    expect(screen.getByTestId('default-description').tagName).toBe('P');
    expect(screen.getByTestId('default-description').querySelector('div')).toBeNull();
  });

  it('falls back to text for unsupported native and custom children', () => {
    const RichText = ({ children }: { children: ReactNode }) => <div>{children}</div>;

    render(
      <EmptyState>
        <EmptyStateTitle data-testid="list-title">
          <li>List title</li>
        </EmptyStateTitle>
        <EmptyStateDescription data-testid="custom-description">
          <RichText>Custom description</RichText>
        </EmptyStateDescription>
      </EmptyState>,
    );

    expect(screen.getByTestId('list-title').querySelector('li')).toBeNull();
    expect(screen.getByTestId('list-title')).toHaveTextContent('List title');
    expect(screen.getByTestId('custom-description').querySelector('div')).toBeNull();
    expect(screen.getByTestId('custom-description')).toHaveTextContent('Custom description');
  });

  it('preserves valid embedded phrasing content', () => {
    render(
      <EmptyState>
        <EmptyStateTitle data-testid="media-title">
          <svg aria-label="Search icon">
            <path d="M0 0" />
          </svg>
          Search results
        </EmptyStateTitle>
        <EmptyStateDescription data-testid="media-description">
          <picture>
            <>
              <source srcSet="small.png" media="(max-width: 600px)" />
              <>
                <img src="large.png" alt="Search result preview" />
              </>
            </>
          </picture>
        </EmptyStateDescription>
      </EmptyState>,
    );

    expect(screen.getByTestId('media-title').querySelector('svg')).not.toBeNull();
    expect(screen.getByTestId('media-description').querySelector('picture')).not.toBeNull();
  });

  it('falls back when picture content is invalid', () => {
    render(
      <EmptyState>
        <EmptyStateDescription data-testid="invalid-picture">
          <picture>
            <div>Invalid picture content</div>
          </picture>
        </EmptyStateDescription>
      </EmptyState>,
    );

    expect(screen.getByTestId('invalid-picture').querySelector('picture')).toBeNull();
    expect(screen.getByTestId('invalid-picture')).toHaveTextContent('Invalid picture content');
  });

  it('falls back when picture source and image order is invalid', () => {
    render(
      <EmptyState>
        <EmptyStateDescription data-testid="reordered-picture">
          <picture>
            <>
              <img src="large.png" alt="Preview" />
              <>
                <source srcSet="small.png" media="(max-width: 600px)" />
              </>
            </>
          </picture>
        </EmptyStateDescription>
        <EmptyStateDescription data-testid="missing-image-picture">
          <picture>
            <source srcSet="small.png" media="(max-width: 600px)" />
          </picture>
        </EmptyStateDescription>
      </EmptyState>,
    );

    expect(screen.getByTestId('reordered-picture').querySelector('picture')).toBeNull();
    expect(screen.getByTestId('missing-image-picture').querySelector('picture')).toBeNull();
  });

  it('renders icon via asChild', () => {
    render(
      <EmptyState>
        <EmptyStateIcon asChild>
          <svg data-testid="test-icon" />
        </EmptyStateIcon>
        <EmptyStateTitle>Title</EmptyStateTitle>
      </EmptyState>,
    );
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('reduces interactive meaningful icon descendants to passive content', () => {
    const onClick = vi.fn();
    render(
      <EmptyState>
        <EmptyStateIcon decorative={false} aria-label="Retry status">
          <button type="button" onClick={onClick}>
            Retry
          </button>
        </EmptyStateIcon>
      </EmptyState>,
    );

    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getByRole('img', { name: 'Retry status' })).toHaveTextContent('Retry');
    expect(onClick).not.toHaveBeenCalled();
  });

  it('forwards refs to the selected div or SVG icon host', () => {
    const divRef = createRef<HTMLDivElement>();
    const svgRef = createRef<SVGSVGElement>();

    render(
      <EmptyState>
        <EmptyStateIcon ref={divRef}>icon</EmptyStateIcon>
        <EmptyStateIcon asChild ref={svgRef}>
          <svg />
        </EmptyStateIcon>
      </EmptyState>,
    );

    expect(divRef.current?.tagName).toBe('DIV');
    expect(svgRef.current?.tagName).toBe('svg');
  });

  it('renders actions', () => {
    render(
      <EmptyState>
        <EmptyStateTitle>Title</EmptyStateTitle>
        <EmptyStateActions>
          <button>Click Me</button>
        </EmptyStateActions>
      </EmptyState>,
    );
    expect(screen.getByRole('button', { name: 'Click Me' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Empty state actions' })).toBeInTheDocument();
  });

  it('localizes the default action-group name', () => {
    render(
      <LocaleProvider defaultLocale="ja-JP" global={false}>
        <EmptyState>
          <EmptyStateActions>
            <button>再読み込み</button>
          </EmptyStateActions>
        </EmptyState>
      </LocaleProvider>,
    );

    expect(screen.getByRole('group', { name: '空の状態の操作' })).toBeInTheDocument();
  });

  it('normalizes empty action labels and falls back from interactive asChild hosts', () => {
    render(
      <EmptyState>
        <EmptyStateActions aria-label=" ">
          <button>Reset</button>
        </EmptyStateActions>
        <EmptyStateActions asChild data-testid="actions-root">
          <button>Unsafe wrapper</button>
        </EmptyStateActions>
      </EmptyState>,
    );

    expect(screen.getAllByRole('group', { name: 'Empty state actions' })).toHaveLength(2);
    expect(screen.getByTestId('actions-root').tagName).toBe('DIV');
  });

  it('preserves safe asChild action metadata after an empty component label', () => {
    render(
      <EmptyState>
        <EmptyStateActions asChild aria-label=" ">
          <div aria-label="Empty search actions" aria-live="polite">
            <button>Reset</button>
          </div>
        </EmptyStateActions>
      </EmptyState>,
    );

    const actions = screen.getByRole('group', { name: 'Empty search actions' });
    expect(actions).toHaveAttribute('aria-live', 'polite');
  });

  it('passes size and appearance props to root', () => {
    const { container } = render(
      <EmptyState size="lg" appearance="elevated">
        <EmptyStateTitle>Title</EmptyStateTitle>
      </EmptyState>,
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('falls back to a div when asChild receives compound children', () => {
    render(
      <EmptyState asChild data-testid="empty-state-root">
        <EmptyStateTitle>No results</EmptyStateTitle>
        <EmptyStateDescription>Try another search.</EmptyStateDescription>
      </EmptyState>,
    );

    expect(screen.getByTestId('empty-state-root').tagName).toBe('DIV');
    expect(screen.getByText('No results')).toBeInTheDocument();
  });

  it('only announces dynamically inserted empty states when requested', () => {
    const { container } = render(
      <EmptyState live="polite">
        <EmptyStateTitle>No matches</EmptyStateTitle>
      </EmptyState>,
    );
    expect(container.firstElementChild).toHaveAttribute('role', 'status');
    expect(container.firstElementChild).not.toHaveAttribute('aria-live');
  });

  it('uses alert semantics for an assertive empty state', () => {
    render(
      <EmptyState live="assertive">
        <EmptyStateTitle>Search failed</EmptyStateTitle>
      </EmptyState>,
    );

    expect(screen.getByRole('alert')).not.toHaveAttribute('aria-live');
  });

  it('keeps an explicit live region when an asChild host has conflicting attributes', () => {
    render(
      <EmptyState asChild live="polite">
        <section role="alert" aria-live="off">
          <EmptyStateTitle>No matches</EmptyStateTitle>
        </section>
      </EmptyState>,
    );

    const root = screen.getByRole('status');
    expect(root).not.toHaveAttribute('aria-live');
  });

  it('removes stale asChild live semantics when announcements are off', () => {
    render(
      <EmptyState asChild live="off">
        <section role="status" aria-live="polite">
          <EmptyStateTitle>No matches</EmptyStateTitle>
        </section>
      </EmptyState>,
    );

    const root = screen.getByText('No matches').closest('section');
    expect(root).not.toHaveAttribute('role');
    expect(root).toHaveAttribute('aria-live', 'off');
  });

  it('preserves explicit asChild semantics when the live shortcut is omitted', () => {
    render(
      <EmptyState asChild>
        <section aria-label="Search results">
          <EmptyStateTitle>No matches</EmptyStateTitle>
        </section>
      </EmptyState>,
    );

    expect(screen.getByRole('region', { name: 'Search results' })).not.toHaveAttribute('aria-live');
  });

  it('makes icons decorative when decorative is omitted', () => {
    render(
      <EmptyState>
        <RuntimeEmptyStateIcon aria-hidden={false}>icon</RuntimeEmptyStateIcon>
      </EmptyState>,
    );
    expect(screen.getByText('icon')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('icon')).toHaveAttribute('inert');
  });

  it('diagnoses interactive content inside a decorative icon', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(
      <EmptyState>
        <EmptyStateIcon>
          <button>Misplaced action</button>
        </EmptyStateIcon>
      </EmptyState>,
    );

    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('Icons must not contain interactive content'),
    );
    expect(screen.getByText('Misplaced action').closest('[inert]')).toBeInTheDocument();
  });

  it('allows a meaningful icon when marked non-decorative', () => {
    render(
      <EmptyState>
        <EmptyStateIcon decorative={false} aria-label="No search results">
          icon
        </EmptyStateIcon>
      </EmptyState>,
    );
    expect(screen.getByRole('img', { name: 'No search results' })).toHaveAttribute(
      'aria-hidden',
      'false',
    );
    expect(screen.getByText('icon')).toHaveAttribute('inert');
    expect(screen.getByText('icon')).toHaveAttribute('aria-hidden', 'true');
  });

  it('isolates opaque meaningful icon output behind an inert presentation boundary', () => {
    const OpaqueIcon = () => <button type="button">Unsafe opaque icon</button>;

    render(
      <EmptyState>
        <EmptyStateIcon decorative={false} aria-label="Status icon">
          <OpaqueIcon />
        </EmptyStateIcon>
      </EmptyState>,
    );

    const image = screen.getByRole('img', { name: 'Status icon' });
    const presentationBoundary = image.querySelector<HTMLElement>('[inert]');
    expect(presentationBoundary).toHaveAttribute('aria-hidden', 'true');
    expect(presentationBoundary).toContainElement(
      screen.getByRole('button', { name: 'Unsafe opaque icon', hidden: true }),
    );
  });

  it('uses a safe fallback for non-SVG asChild hosts', () => {
    render(
      <EmptyState>
        <RuntimeEmptyStateIcon asChild decorative data-testid="icon-root">
          <button>Unsafe icon host</button>
        </RuntimeEmptyStateIcon>
      </EmptyState>,
    );

    expect(screen.getByTestId('icon-root').tagName).toBe('DIV');
    expect(screen.getByTestId('icon-root')).toHaveAttribute('inert');
    expect(screen.getByTestId('icon-root')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('button', { name: 'Unsafe icon host' })).not.toBeInTheDocument();
  });

  it('makes explicitly decorative icons inert', () => {
    render(
      <EmptyState>
        <EmptyStateIcon decorative data-testid="decorative-icon">
          icon
        </EmptyStateIcon>
      </EmptyState>,
    );

    expect(screen.getByTestId('decorative-icon')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByTestId('decorative-icon')).toHaveAttribute('inert');
  });

  it('keeps explicit icon semantics when an asChild SVG has conflicting attributes', () => {
    const onClick = vi.fn();
    render(
      <EmptyState>
        <EmptyStateIcon asChild decorative>
          <svg data-testid="decorative-svg" aria-hidden={false} inert={false} />
        </EmptyStateIcon>
        <RuntimeEmptyStateIcon asChild decorative={false} aria-label="Project icon">
          <svg
            data-testid="meaningful-svg"
            role="presentation"
            aria-hidden
            inert
            autoFocus
            focusable="true"
            tabIndex={0}
            contentEditable
            draggable
            onClick={onClick}
          />
        </RuntimeEmptyStateIcon>
      </EmptyState>,
    );

    expect(screen.getByTestId('decorative-svg')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByTestId('decorative-svg')).toHaveAttribute('inert');
    expect(screen.getByTestId('meaningful-svg')).toHaveAttribute('role', 'img');
    expect(screen.getByTestId('meaningful-svg')).toHaveAttribute('aria-hidden', 'false');
    expect(screen.getByTestId('meaningful-svg')).not.toHaveAttribute('inert');
    expect(screen.getByTestId('meaningful-svg')).not.toHaveAttribute('autofocus');
    expect(screen.getByTestId('meaningful-svg')).not.toHaveAttribute('focusable');
    expect(screen.getByTestId('meaningful-svg')).not.toHaveAttribute('tabindex');
    expect(screen.getByTestId('meaningful-svg')).not.toHaveAttribute('contenteditable');
    expect(screen.getByTestId('meaningful-svg')).not.toHaveAttribute('draggable');
    fireEvent.click(screen.getByTestId('meaningful-svg'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('falls back to decorative semantics for an unnamed meaningful icon', () => {
    render(
      <EmptyState>
        <RuntimeEmptyStateIcon decorative={false} data-testid="unnamed-icon">
          icon
        </RuntimeEmptyStateIcon>
      </EmptyState>,
    );

    expect(screen.getByTestId('unnamed-icon')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByTestId('unnamed-icon')).not.toHaveAttribute('role');
  });

  it('keeps action group semantics when an asChild host has conflicting attributes', () => {
    render(
      <EmptyState>
        <EmptyStateActions asChild data-testid="actions-root">
          <section role="alert" aria-label=" ">
            <button>Create project</button>
          </section>
        </EmptyStateActions>
      </EmptyState>,
    );

    const root = screen.getByRole('group', { name: 'Empty state actions' });
    expect(root).toBeInTheDocument();
    expect(screen.getByTestId('actions-root')).toBe(root);
    expect(root.tagName).toBe('DIV');
  });

  describe('when sub-component is used outside EmptyState', () => {
    beforeEach(() => {
      vi.spyOn(console, 'error').mockImplementation(vi.fn());
    });
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('throws an error', () => {
      expect(() => render(<EmptyStateTitle>Orphan</EmptyStateTitle>)).toThrow(
        'EmptyState sub-components must be used within <EmptyState>.',
      );
    });
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <EmptyState>
        <EmptyStateIcon asChild>
          <svg aria-hidden="true" />
        </EmptyStateIcon>
        <EmptyStateTitle>No results</EmptyStateTitle>
        <EmptyStateDescription>Try a different search term.</EmptyStateDescription>
        <EmptyStateActions>
          <button>Reset</button>
        </EmptyStateActions>
      </EmptyState>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
