import { render, screen, fireEvent, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Pagination } from './index';
import { usePaginationRange } from './usePaginationRange';

describe('Pagination', () => {
  it('renders correct page numbers', () => {
    render(<Pagination count={5} page={1} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Prev')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('calls onChange when clicking a page', () => {
    const onChange = vi.fn();
    render(<Pagination count={5} page={1} onChange={onChange} />);

    fireEvent.click(screen.getByText('2'));
    expect(onChange).toHaveBeenCalledWith(2);
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
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('does not trigger onChange on keyboard when disabled', () => {
    const onChange = vi.fn();
    render(<Pagination count={5} page={1} onChange={onChange} />);
    fireEvent.keyDown(screen.getByText('Prev'), { key: 'Enter' });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('renders ellipsis for large page counts', () => {
    render(<Pagination count={20} page={10} />);
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

  it('renders an active page indicator', () => {
    const { container } = render(<Pagination count={5} page={3} indicatorAnimation="pop" />);
    const currentPage = screen.getByText('3').closest('[aria-current="page"]');
    expect(currentPage).toBeInTheDocument();
    expect(currentPage).toHaveAttribute('data-current');
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Pagination count={5} page={3} />);
    expect(await axe(container)).toHaveNoViolations();
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
