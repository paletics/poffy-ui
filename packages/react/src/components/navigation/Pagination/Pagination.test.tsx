import { render, screen, fireEvent, renderHook } from '@testing-library/react';
import { createElement, type KeyboardEvent } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Pagination, PaginationEllipsis, PaginationItem, PaginationRoot } from './index';
import { PaginationContext } from './PaginationContext';
import { PaginationLink } from './PaginationLink';
import { usePaginationRange } from './usePaginationRange';
import { LocaleProvider } from '@/providers/LocaleProvider';

describe('Pagination', () => {
  it('preserves capture handlers on enabled links', () => {
    const onClickCapture = vi.fn();
    const onKeyDownCapture = vi.fn();
    render(
      <PaginationContext.Provider
        value={
          {
            classes: { link: '', activeIndicator: '' },
            indicatorId: 'test',
            indicatorAnimation: 'stable',
          } as never
        }
      >
        <PaginationLink onClickCapture={onClickCapture} onKeyDownCapture={onKeyDownCapture}>
          Page
        </PaginationLink>
      </PaginationContext.Provider>,
    );

    const link = screen.getByRole('button', { name: 'Page' });
    fireEvent.click(link);
    fireEvent.keyDown(link, { key: 'ArrowRight' });

    expect(onClickCapture).toHaveBeenCalledOnce();
    expect(onKeyDownCapture).toHaveBeenCalledOnce();
  });

  it('allows keyboard activation to be cancelled by consumer handlers', () => {
    const onClick = vi.fn();
    const onKeyDown = vi.fn((event: KeyboardEvent<HTMLAnchorElement>) => event.preventDefault());
    render(
      <PaginationRoot>
        <PaginationItem>
          <PaginationLink onClick={onClick} onKeyDown={onKeyDown}>
            Page
          </PaginationLink>
        </PaginationItem>
      </PaginationRoot>,
    );

    fireEvent.keyDown(screen.getByRole('button', { name: 'Page' }), { key: 'Enter' });

    expect(onKeyDown).toHaveBeenCalledOnce();
    expect(onClick).not.toHaveBeenCalled();
  });

  it('honors preventDefault from a capture keyboard handler', () => {
    const onClick = vi.fn();
    render(
      <PaginationRoot>
        <PaginationItem>
          <PaginationLink onClick={onClick} onKeyDownCapture={(event) => event.preventDefault()}>
            Page
          </PaginationLink>
        </PaginationItem>
      </PaginationRoot>,
    );

    fireEvent.keyDown(screen.getByRole('button', { name: 'Page' }), { key: ' ' });

    expect(onClick).not.toHaveBeenCalled();
  });

  it('removes href from disabled links', () => {
    render(
      <PaginationRoot>
        <PaginationItem>
          <PaginationLink disabled href="/page/1">
            Previous
          </PaginationLink>
        </PaginationItem>
      </PaginationRoot>,
    );

    expect(screen.getByRole('link', { name: 'Previous' })).not.toHaveAttribute('href');
  });

  it('supports the documented compound composition', () => {
    render(
      <PaginationRoot aria-label="Search pages">
        <PaginationItem>
          <PaginationLink href="/search?page=1" isActive>
            1
          </PaginationLink>
        </PaginationItem>
      </PaginationRoot>,
    );

    expect(screen.getByRole('navigation', { name: 'Search pages' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Search pages' })).not.toHaveAttribute(
      'data-pagination-compact',
    );
    expect(screen.getByRole('link', { name: '1' })).toHaveAttribute('aria-current', 'page');
  });

  it('renders correct page numbers', () => {
    render(<Pagination count={5} page={1} onChange={vi.fn()} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Prev')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'pagination' })).toHaveAttribute(
      'data-pagination-compact',
    );
    expect(screen.getByRole('button', { name: 'Go to previous page' })).toHaveAttribute(
      'data-pagination-direction',
      'previous',
    );
    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute(
      'data-pagination-kind',
      'page',
    );
    expect(screen.getByRole('button', { name: 'Go to next page' })).toHaveAttribute(
      'data-pagination-direction',
      'next',
    );
  });

  it('localizes monolithic controls and formats page text and labels', () => {
    render(
      <Pagination
        count={3}
        page={2}
        locale="JA-jp"
        onChange={vi.fn()}
        formatPage={(page) => `第${page}`}
        getPageAriaLabel={(page, isCurrent) => `${isCurrent ? '現在' : '移動'}:${page}`}
      />,
    );

    expect(screen.getByRole('navigation', { name: 'ページネーション' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '前のページへ移動' })).toHaveTextContent('前へ');
    expect(screen.getByRole('button', { name: '現在:2' })).toHaveTextContent('第2');
    expect(screen.getByRole('button', { name: '次のページへ移動' })).toHaveTextContent('次へ');
  });

  it('uses one English fallback locale for malformed locale values', () => {
    render(<Pagination count={2} page={1} locale="ja-@" onChange={vi.fn()} />);

    expect(screen.getByRole('navigation', { name: 'pagination' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 1' })).toHaveTextContent('1');
  });

  it('keeps custom page text while deriving default labels from the fallback locale', () => {
    render(
      <Pagination
        count={2}
        page={1}
        locale="ja-@"
        formatPage={(pageNumber) => `item-${pageNumber}`}
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByRole('navigation', { name: 'pagination' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page item-1' })).toHaveTextContent('item-1');
  });

  it('renders malformed locale values during SSR with the same fallback labels', () => {
    const markup = renderToStaticMarkup(
      <Pagination count={2} page={1} locale="ja-@" onChange={vi.fn()} />,
    );

    expect(markup).toContain('aria-label="pagination"');
    expect(markup).toContain('aria-label="Page 1"');
  });

  it('resolves compound labels while preserving explicit aria labels', () => {
    render(
      <LocaleProvider defaultLocale="ja-JP" global={false}>
        <PaginationRoot aria-label="検索結果ページ">
          <PaginationEllipsis aria-label="省略された結果" />
          <PaginationEllipsis />
        </PaginationRoot>
      </LocaleProvider>,
    );

    expect(screen.getByRole('navigation', { name: '検索結果ページ' })).toBeInTheDocument();
    expect(screen.getByRole('listitem', { name: '省略された結果' })).toBeInTheDocument();
    expect(screen.getByRole('listitem', { name: 'その他のページ' })).toBeInTheDocument();
  });

  it('applies partial label overrides after locale defaults', () => {
    render(
      <Pagination
        count={2}
        page={1}
        locale="ja-JP"
        labels={{ next: '続ける' }}
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: '次のページへ移動' })).toHaveTextContent('続ける');
    expect(screen.getByRole('button', { name: '前のページへ移動' })).toHaveTextContent('前へ');
  });

  it('renders native links when getHref is supplied', () => {
    const onChange = vi.fn();
    render(
      <Pagination
        count={3}
        page={2}
        getHref={(page) => `/results?page=${page}`}
        onChange={onChange}
      />,
    );

    const pageThree = screen.getByRole('link', { name: 'Go to page 3' });
    expect(pageThree).toHaveAttribute('href', '/results?page=3');
    fireEvent.keyDown(pageThree, { key: ' ' });
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.click(pageThree);
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('keeps disabled URL controls as link intent without href', () => {
    render(<Pagination count={3} page={1} getHref={(page) => `/page/${page}`} />);

    const previous = screen.getByRole('link', { name: 'Go to previous page' });
    expect(previous).toHaveAttribute('aria-disabled', 'true');
    expect(previous).not.toHaveAttribute('href');
  });

  it('calls onChange when clicking a page', () => {
    const onChange = vi.fn();
    render(<Pagination count={5} page={1} onChange={onChange} />);

    fireEvent.click(screen.getByText('2'));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('does not notify when the active page is activated', () => {
    const onChange = vi.fn();
    render(<Pagination count={5} page={3} onChange={onChange} />);
    const currentPage = screen.getByRole('button', { name: 'Page 3' });

    fireEvent.click(currentPage);
    fireEvent.keyDown(currentPage, { key: 'Enter' });
    fireEvent.keyDown(currentPage, { key: ' ' });
    fireEvent.keyUp(currentPage, { key: ' ' });

    expect(onChange).not.toHaveBeenCalled();
  });

  it('preserves native href intent while suppressing active-page notification', () => {
    const onChange = vi.fn();
    render(
      <Pagination
        count={5}
        page={3}
        getHref={(page) => `/results?page=${page}`}
        onChange={onChange}
      />,
    );
    const currentPage = screen.getByRole('link', { name: 'Page 3' });

    expect(currentPage).toHaveAttribute('href', '/results?page=3');
    fireEvent.click(currentPage);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('prev button click is prevented on first page', () => {
    const onChange = vi.fn();
    render(<Pagination count={5} page={1} onChange={onChange} />);
    fireEvent.click(screen.getByText('Prev'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('next button click is prevented on last page', () => {
    const onChange = vi.fn();
    render(<Pagination count={5} page={5} onChange={onChange} />);
    fireEvent.click(screen.getByText('Next'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('next button works', () => {
    const onChange = vi.fn();
    render(<Pagination count={5} page={1} onChange={onChange} />);
    fireEvent.click(screen.getByText('Next'));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('prev button works', () => {
    const onChange = vi.fn();
    render(<Pagination count={5} page={3} onChange={onChange} />);
    fireEvent.click(screen.getByText('Prev'));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('triggers onChange via Enter key', () => {
    const onChange = vi.fn();
    render(<Pagination count={5} page={1} onChange={onChange} />);
    fireEvent.keyDown(screen.getByText('3'), { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('triggers onChange via Space key', () => {
    const onChange = vi.fn();
    render(<Pagination count={5} page={1} onChange={onChange} />);
    fireEvent.keyDown(screen.getByText('3'), { key: ' ' });
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.keyUp(screen.getByText('3'), { key: ' ' });
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('does not trigger onChange on keyboard when disabled', () => {
    const onChange = vi.fn();
    render(<Pagination count={5} page={1} onChange={onChange} />);
    fireEvent.keyDown(screen.getByText('Prev'), { key: 'Enter' });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('stops code-only Space events from disabled pagination controls', () => {
    const onKeyDown = vi.fn();
    const onKeyUp = vi.fn();
    render(
      createElement(
        'div',
        { onKeyDown, onKeyUp },
        <Pagination count={5} page={1} onChange={vi.fn()} />,
      ),
    );

    const previous = screen.getByRole('button', { name: 'Go to previous page' });
    fireEvent.keyDown(previous, { key: 'Unidentified', code: 'Space' });
    fireEvent.keyUp(previous, { key: 'Unidentified', code: 'Space' });

    expect(onKeyDown).not.toHaveBeenCalled();
    expect(onKeyUp).not.toHaveBeenCalled();
  });

  it('preserves capture handlers on disabled links while blocking activation', () => {
    const onClickCapture = vi.fn();
    const onKeyDownCapture = vi.fn();
    const onKeyUpCapture = vi.fn();
    render(
      <PaginationContext.Provider
        value={
          {
            classes: { link: '', activeIndicator: '' },
            indicatorId: 'test',
            indicatorAnimation: 'stable',
          } as never
        }
      >
        <PaginationLink
          disabled
          onClickCapture={onClickCapture}
          onKeyDownCapture={onKeyDownCapture}
          onKeyUpCapture={onKeyUpCapture}
        >
          Page
        </PaginationLink>
      </PaginationContext.Provider>,
    );

    const link = screen.getByRole('button', { name: 'Page' });
    fireEvent.click(link);
    fireEvent.keyDown(link, { key: 'Enter' });
    fireEvent.keyUp(link, { key: 'Enter' });

    expect(onClickCapture).toHaveBeenCalledTimes(1);
    expect(onKeyDownCapture).toHaveBeenCalledTimes(1);
    expect(onKeyUpCapture).toHaveBeenCalledTimes(1);
  });

  it('renders ellipsis for large page counts', () => {
    render(<Pagination count={20} page={10} onChange={vi.fn()} />);
    const items = screen.getAllByRole('listitem');
    const ellipsisItems = items.filter((item) => item.getAttribute('aria-label') === 'more pages');
    expect(ellipsisItems).toHaveLength(2);
  });

  it('renders with count=1 (both Prev and Next disabled)', () => {
    const onChange = vi.fn();
    render(<Pagination count={1} page={1} onChange={onChange} />);
    fireEvent.click(screen.getByText('Prev'));
    fireEvent.click(screen.getByText('Next'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('normalizes invalid page inputs before rendering and requesting navigation', () => {
    const onChange = vi.fn();
    render(
      <Pagination
        count={Number.POSITIVE_INFINITY}
        page={Number.NaN}
        siblingCount={-1}
        boundaryCount={Number.NaN}
        onChange={onChange}
      />,
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Next'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('renders an active page indicator', () => {
    const { container } = render(
      <Pagination count={5} page={3} indicatorAnimation="pop" onChange={vi.fn()} />,
    );
    const currentPage = screen.getByText('3').closest('[aria-current="page"]');
    expect(currentPage).toBeInTheDocument();
    expect(currentPage).toHaveAttribute('data-current');
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Pagination count={5} page={3} onChange={vi.fn()} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('protects new-window page links from opener access', () => {
    render(
      <PaginationRoot>
        <PaginationItem>
          <PaginationLink href="https://example.com" target="_blank" rel="opener">
            1
          </PaginationLink>
        </PaginationItem>
      </PaginationRoot>,
    );

    const link = screen.getByRole('link', { name: '1' });
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
    expect(link).toHaveAttribute('rel', expect.stringContaining('noreferrer'));
  });
});

describe('usePaginationRange', () => {
  it('returns all pages when count is small', () => {
    const { result } = renderHook(() => usePaginationRange({ count: 5, page: 1 }));
    expect(result.current).toEqual([1, 2, 3, 4, 5]);
  });

  it('shows right dots only when near the start', () => {
    const { result } = renderHook(() => usePaginationRange({ count: 20, page: 2 }));
    expect(result.current).toContain('dots-right');
    expect(result.current).not.toContain('dots-left');
  });

  it('shows left dots only when near the end', () => {
    const { result } = renderHook(() => usePaginationRange({ count: 20, page: 19 }));
    expect(result.current).toContain('dots-left');
    expect(result.current).not.toContain('dots-right');
  });

  it('shows both dots when in the middle', () => {
    const { result } = renderHook(() => usePaginationRange({ count: 20, page: 10 }));
    expect(result.current).toContain('dots-left');
    expect(result.current).toContain('dots-right');
  });

  it('never returns an empty array', () => {
    const { result } = renderHook(() =>
      usePaginationRange({ count: 10, page: 5, siblingCount: 1, boundaryCount: 1 }),
    );
    expect(result.current.length).toBeGreaterThan(0);
  });
});
