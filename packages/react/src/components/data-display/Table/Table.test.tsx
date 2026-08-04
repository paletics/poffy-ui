import { fireEvent, render, screen } from '@testing-library/react';
import { createRef, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import {
  Table,
  TableHead,
  TableBody,
  TableFooter,
  TableRow,
  TableCell,
  TableHeaderCell,
  TableCaption,
  TableScrollContainer,
} from './index';

describe('Table', () => {
  const NativeTableWrapper = ({ children }: { children?: ReactNode }) => (
    <table data-testid="nested-table">{children}</table>
  );
  const Status = () => <span>Active</span>;

  it('renders correctly', () => {
    render(
      <Table>
        <TableCaption>Imperial to metric conversion factors</TableCaption>
        <TableHead>
          <TableRow>
            <TableHeaderCell scope="col">To convert to</TableHeaderCell>
            <TableHeaderCell scope="col">multiply by</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>inches</TableCell>
            <TableCell>25.4</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Footer</TableCell>
            <TableCell>Footer</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
    const cells = screen.getAllByRole('cell');
    expect(cells.length).toBeGreaterThan(0);
    expect(screen.getByText(/inches/i)).toBeInTheDocument();
  });

  it('renders as child', () => {
    render(
      <Table asChild>
        <table data-testid="custom-table">
          <TableBody asChild>
            <tbody data-testid="custom-body">
              <TableRow asChild>
                <tr data-testid="custom-row">
                  <TableCell asChild>
                    <td data-testid="custom-cell">Cell</td>
                  </TableCell>
                </tr>
              </TableRow>
            </tbody>
          </TableBody>
        </table>
      </Table>,
    );

    expect(screen.getByTestId('custom-table')).toBeInTheDocument();
    expect(screen.getByTestId('custom-body')).toBeInTheDocument();
    expect(screen.getByTestId('custom-row')).toBeInTheDocument();
    expect(screen.getByTestId('custom-cell')).toBeInTheDocument();
  });

  it('restores a data cell when TableCell receives a header host', () => {
    render(
      <Table>
        <TableHead>
          <TableRow>
            <TableCell asChild>
              <th>Header Cell</th>
            </TableCell>
          </TableRow>
        </TableHead>
      </Table>,
    );
    expect(screen.getByText('Header Cell').tagName).toBe('TD');
  });

  it('preserves custom content when content slots reject asChild hosts', () => {
    render(
      <Table>
        <TableCaption asChild>
          <Status />
        </TableCaption>
        <TableHead>
          <TableRow>
            <TableHeaderCell asChild scope="col">
              <Status />
            </TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell asChild>
              <Status />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(screen.getByRole('caption')).toContainElement(screen.getAllByText('Active')[0]);
    expect(screen.getByRole('columnheader')).toContainElement(screen.getAllByText('Active')[1]);
    expect(screen.getByRole('cell')).toContainElement(screen.getAllByText('Active')[2]);
  });

  it('restores native table structure when delegated hosts are incompatible', async () => {
    const { container } = render(
      <Table asChild>
        <div>
          <TableCaption asChild>
            <div>Table caption</div>
          </TableCaption>
          <TableHead asChild>
            <div>
              <TableRow asChild>
                <div>
                  <TableHeaderCell asChild>
                    <td>Header</td>
                  </TableHeaderCell>
                </div>
              </TableRow>
            </div>
          </TableHead>
          <TableBody asChild>
            <div>
              <TableRow asChild>
                <div>
                  <TableCell asChild>
                    <div>Data</div>
                  </TableCell>
                </div>
              </TableRow>
            </div>
          </TableBody>
          <TableFooter asChild>
            <div>
              <TableRow asChild>
                <div>
                  <TableCell>Footer</TableCell>
                </div>
              </TableRow>
            </div>
          </TableFooter>
        </div>
      </Table>,
    );

    expect(screen.getByRole('table')).toContainElement(screen.getByText('Table caption'));
    expect(container.querySelector('thead tr th')).toHaveTextContent('Header');
    expect(container.querySelector('tbody tr td')).toHaveTextContent('Data');
    expect(container.querySelector('tfoot tr td')).toHaveTextContent('Footer');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('unwraps rejected custom table hosts without nesting tables', () => {
    const { container } = render(
      <Table asChild>
        <NativeTableWrapper>
          <TableBody>
            <TableRow>
              <TableCell>Data</TableCell>
            </TableRow>
          </TableBody>
        </NativeTableWrapper>
      </Table>,
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(container.querySelectorAll('table')).toHaveLength(1);
    expect(container.querySelector('table > tbody > tr > td')).toHaveTextContent('Data');
  });

  it('removes nested incompatible wrappers from strict table slots', async () => {
    const { container } = render(
      <Table asChild>
        <div>
          <div>
            <TableBody asChild>
              <div>
                <div>
                  <TableRow asChild>
                    <div>
                      <div>
                        <TableCell>Data</TableCell>
                      </div>
                    </div>
                  </TableRow>
                </div>
              </div>
            </TableBody>
          </div>
        </div>
      </Table>,
    );

    expect(container.querySelector('table > tbody > tr > td')).toHaveTextContent('Data');
    expect(container.querySelector('table div')).toBeNull();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders type-safe header cells with scope', () => {
    render(
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell scope="col">Header Cell</TableHeaderCell>
          </TableRow>
        </TableHead>
      </Table>,
    );

    expect(screen.getByRole('columnheader', { name: 'Header Cell' })).toHaveAttribute(
      'scope',
      'col',
    );
  });

  it('supports explicit row header associations', () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableHeaderCell scope="row">January</TableHeaderCell>
            <TableCell>$100</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByRole('rowheader', { name: 'January' })).toHaveAttribute('scope', 'row');
  });

  it('forwards ref', () => {
    const ref = { current: null };
    render(<Table ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTableElement);
  });

  it('keeps table semantics and refs inside the optional scroll container', async () => {
    const scrollRef = createRef<HTMLDivElement>();
    const tableRef = createRef<HTMLTableElement>();
    const { container } = render(
      <TableScrollContainer
        ref={scrollRef}
        aria-label="Scrollable results"
        tabIndex={0}
        data-testid="scroll-container"
      >
        <Table ref={tableRef}>
          <TableCaption>Results</TableCaption>
          <TableBody>
            <TableRow>
              <TableCell>Data</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableScrollContainer>,
    );

    expect(scrollRef.current).toBe(screen.getByTestId('scroll-container'));
    expect(tableRef.current).toBe(screen.getByRole('table'));
    expect(scrollRef.current?.tagName).toBe('DIV');
    expect(scrollRef.current?.querySelector(':scope > table')).toBe(tableRef.current);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('scrolls horizontally with navigation keys when the focused container overflows', () => {
    render(
      <TableScrollContainer aria-label="Scrollable results" tabIndex={0}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Data</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableScrollContainer>,
    );

    const scrollContainer = screen.getByLabelText('Scrollable results');
    const scrollBy = vi.fn();
    Object.defineProperties(scrollContainer, {
      clientWidth: { configurable: true, value: 200 },
      scrollWidth: { configurable: true, value: 600 },
    });
    Object.defineProperty(scrollContainer, 'scrollBy', { configurable: true, value: scrollBy });

    fireEvent.keyDown(scrollContainer, { key: 'ArrowRight' });
    expect(scrollBy).toHaveBeenLastCalledWith({ left: 160, behavior: 'auto' });

    fireEvent.keyDown(scrollContainer, { key: 'Home' });
    expect(scrollBy).toHaveBeenLastCalledWith({ left: -600, behavior: 'auto' });
  });

  it('provides a named scroll region when direct keyboard access is requested', async () => {
    const { container } = render(
      <TableScrollContainer tabIndex={0}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>Data</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableScrollContainer>,
    );

    expect(screen.getByRole('region', { name: 'Scrollable table' })).toHaveAttribute(
      'tabindex',
      '0',
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('preserves a consumer key handler that prevents scroll-container navigation', () => {
    const onKeyDown = vi.fn((event: ReactKeyboardEvent<HTMLDivElement>) => event.preventDefault());
    render(
      <TableScrollContainer aria-label="Scrollable results" tabIndex={0} onKeyDown={onKeyDown}>
        <Table />
      </TableScrollContainer>,
    );

    const scrollContainer = screen.getByLabelText('Scrollable results');
    const scrollBy = vi.fn();
    Object.defineProperties(scrollContainer, {
      clientWidth: { configurable: true, value: 200 },
      scrollWidth: { configurable: true, value: 600 },
    });
    Object.defineProperty(scrollContainer, 'scrollBy', { configurable: true, value: scrollBy });

    fireEvent.keyDown(scrollContainer, { key: 'ArrowRight' });
    expect(onKeyDown).toHaveBeenCalledOnce();
    expect(scrollBy).not.toHaveBeenCalled();
  });

  it('exposes the scroll container on the compound component', () => {
    expect(Table.ScrollContainer).toBe(TableScrollContainer);
  });

  it('renders an accessible empty state across the supplied columns', async () => {
    const { container } = render(
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell scope="col">Name</TableHeaderCell>
            <TableHeaderCell scope="col">Status</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <Table.EmptyState colSpan={2}>No records found</Table.EmptyState>
        </TableBody>
      </Table>,
    );

    expect(screen.getByRole('cell', { name: 'No records found' })).toHaveAttribute('colspan', '2');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('applies display-only alignment and sticky-header variants', () => {
    render(
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableHeaderCell scope="col" textAlign="end">
              Amount
            </TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell textAlign="end">120</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(screen.getByRole('table')).toHaveClass('poffy-table__root--stickyHeader_true');
    expect(screen.getByRole('columnheader', { name: 'Amount' })).toHaveClass('poffy-ta_end');
    expect(screen.getByRole('cell', { name: '120' })).toHaveClass('poffy-ta_end');
  });

  it('renders native column declarations and opt-in cell display features', () => {
    const { container } = render(
      <Table headerTone="strong">
        <Table.ColumnGroup>
          <Table.Column span={1} />
          <Table.Column span={2} />
        </Table.ColumnGroup>
        <TableHead>
          <TableRow>
            <TableHeaderCell scope="col" sticky="start" truncate>
              Product name
            </TableHeaderCell>
            <TableHeaderCell scope="col" textAlign="end">
              Quantity
            </TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell sticky="start" truncate>
              A product name that exceeds its constrained column
            </TableCell>
            <TableCell textAlign="end">42</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(container.querySelector('colgroup')).toBeInTheDocument();
    expect(container.querySelectorAll('col')).toHaveLength(2);
    expect(screen.getByRole('table')).toHaveClass('poffy-table__root--headerTone_strong');
    expect(screen.getByRole('columnheader', { name: 'Product name' })).toHaveClass(
      'poffy-pos_sticky',
    );
  });

  it('exposes the application-owned sort state on column headers', () => {
    render(
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell scope="col" sortDirection="ascending">
              Name
            </TableHeaderCell>
            <TableHeaderCell scope="col" sortDirection="none">
              Status
            </TableHeaderCell>
          </TableRow>
        </TableHead>
      </Table>,
    );

    expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute(
      'aria-sort',
      'ascending',
    );
    expect(screen.getByRole('columnheader', { name: 'Status' })).toHaveAttribute(
      'aria-sort',
      'none',
    );
  });

  it('should have no a11y violations', async () => {
    const { container } = render(
      <Table>
        <TableCaption>Test Table</TableCaption>
        <TableHead>
          <TableRow>
            <TableHeaderCell scope="col">Header</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Data</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
