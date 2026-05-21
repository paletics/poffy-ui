import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import {
  Table,
  TableHead,
  TableBody,
  TableFooter,
  TableRow,
  TableCell,
  TableCaption,
} from './index';

describe('Table', () => {
  it('renders correctly', () => {
    render(
      <Table>
        <TableCaption>Imperial to metric conversion factors</TableCaption>
        <TableHead>
          <TableRow>
            <TableCell>To convert to</TableCell>
            <TableCell>multiply by</TableCell>
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

  it('renders th with explicit asChild', () => {
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
    expect(screen.getByText('Header Cell').tagName).toBe('TH');
  });

  it('forwards ref', () => {
    const ref = { current: null };
    render(<Table ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTableElement);
  });

  it('should have no a11y violations', async () => {
    const { container } = render(
      <Table>
        <TableCaption>Test Table</TableCaption>
        <TableHead>
          <TableRow>
            <TableCell>Header</TableCell>
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
