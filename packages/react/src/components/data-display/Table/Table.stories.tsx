import type { Meta, StoryObj } from '@storybook/react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableCaption,
  TableFooter,
} from '@/components/data-display/Table';
import { Stack } from '@/components/layout/Stack';
import { Heading } from '@/components/typography/Heading';

/**
 * Semantic HTML table composed of head, body, footer, row, and cell sub-components for structured data display.
 * Use for tabular datasets that require readable row/column relationships with optional striping or borders.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS (table recipe), Radix Slot
 */
const meta: Meta<typeof Table> = {
  title: 'Display/Table',
  component: Table,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Table>;

export const Default: Story = {
  render: (args) => (
    <Table {...args}>
      <TableCaption>Imperial to metric conversion factors</TableCaption>
      <TableHead>
        <TableRow>
          <TableCell asChild>
            <th scope="col">To convert</th>
          </TableCell>
          <TableCell asChild>
            <th scope="col">into</th>
          </TableCell>
          <TableCell asChild>
            <th scope="col">multiply by</th>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>inches</TableCell>
          <TableCell>millimetres (mm)</TableCell>
          <TableCell>25.4</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>feet</TableCell>
          <TableCell>centimetres (cm)</TableCell>
          <TableCell>30.48</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>yards</TableCell>
          <TableCell>metres (m)</TableCell>
          <TableCell>0.91444</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Conversion factors from Wikipedia</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

export const Playground: Story = {
  args: {
    variant: 'simple',
    layout: 'auto',
    size: 'md',
  },
  render: Default.render,
};

export const Striped: Story = {
  render: Default.render,
  args: {
    variant: 'striped',
  },
};

export const Outline: Story = {
  render: Default.render,
  args: {
    variant: 'outline',
  },
};

export const StripedVertical: Story = {
  render: () => (
    <Table variant="stripedVertical">
      <TableCaption>Vertical striped table example</TableCaption>
      <TableHead>
        <TableRow>
          <TableCell asChild>
            <th scope="col">Product</th>
          </TableCell>
          <TableCell asChild>
            <th scope="col">Price</th>
          </TableCell>
          <TableCell asChild>
            <th scope="col">Stock</th>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Laptop</TableCell>
          <TableCell>$999</TableCell>
          <TableCell>15</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Mouse</TableCell>
          <TableCell>$29</TableCell>
          <TableCell>150</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Keyboard</TableCell>
          <TableCell>$79</TableCell>
          <TableCell>80</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const Borderless: Story = {
  render: () => (
    <Table variant="borderless">
      <TableCaption>Borderless table - clean look</TableCaption>
      <TableHead>
        <TableRow>
          <TableCell asChild>
            <th scope="col">Name</th>
          </TableCell>
          <TableCell asChild>
            <th scope="col">Email</th>
          </TableCell>
          <TableCell asChild>
            <th scope="col">Role</th>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Alice Johnson</TableCell>
          <TableCell>alice@example.com</TableCell>
          <TableCell>Admin</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Bob Smith</TableCell>
          <TableCell>bob@example.com</TableCell>
          <TableCell>User</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Carol White</TableCell>
          <TableCell>carol@example.com</TableCell>
          <TableCell>Editor</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const FixedLayout: Story = {
  render: () => (
    <Table layout="fixed">
      <TableCaption>Fixed layout - equal column widths</TableCaption>
      <TableHead>
        <TableRow>
          <TableCell asChild>
            <th scope="col">Column 1</th>
          </TableCell>
          <TableCell asChild>
            <th scope="col">Column 2</th>
          </TableCell>
          <TableCell asChild>
            <th scope="col">Column 3</th>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>This is a very long text that would normally expand the column</TableCell>
          <TableCell>Short</TableCell>
          <TableCell>Medium text here</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Text</TableCell>
          <TableCell>Another very long text that gets constrained</TableCell>
          <TableCell>Text</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <Stack gap="xl">
      <Stack gap="xs">
        <Heading level="3">Simple (Default)</Heading>
        <Table variant="simple" size="sm">
          <TableBody>
            <TableRow>
              <TableCell>Row 1, Cell 1</TableCell>
              <TableCell>Row 1, Cell 2</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Row 2, Cell 1</TableCell>
              <TableCell>Row 2, Cell 2</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Stack>
      <Stack gap="xs">
        <Heading level="3">Striped (Horizontal)</Heading>
        <Table variant="striped" size="sm">
          <TableBody>
            <TableRow>
              <TableCell>Row 1, Cell 1</TableCell>
              <TableCell>Row 1, Cell 2</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Row 2, Cell 1</TableCell>
              <TableCell>Row 2, Cell 2</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Row 3, Cell 1</TableCell>
              <TableCell>Row 3, Cell 2</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Stack>
      <Stack gap="xs">
        <Heading level="3">Striped Vertical</Heading>
        <Table variant="stripedVertical" size="sm">
          <TableBody>
            <TableRow>
              <TableCell>Row 1, Cell 1</TableCell>
              <TableCell>Row 1, Cell 2</TableCell>
              <TableCell>Row 1, Cell 3</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Row 2, Cell 1</TableCell>
              <TableCell>Row 2, Cell 2</TableCell>
              <TableCell>Row 2, Cell 3</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Stack>
      <Stack gap="xs">
        <Heading level="3">Outline</Heading>
        <Table variant="outline" size="sm">
          <TableBody>
            <TableRow>
              <TableCell>Row 1, Cell 1</TableCell>
              <TableCell>Row 1, Cell 2</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Row 2, Cell 1</TableCell>
              <TableCell>Row 2, Cell 2</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Stack>
      <Stack gap="xs">
        <Heading level="3">Borderless</Heading>
        <Table variant="borderless" size="sm">
          <TableBody>
            <TableRow>
              <TableCell>Row 1, Cell 1</TableCell>
              <TableCell>Row 1, Cell 2</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Row 2, Cell 1</TableCell>
              <TableCell>Row 2, Cell 2</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Stack>
    </Stack>
  ),
};
