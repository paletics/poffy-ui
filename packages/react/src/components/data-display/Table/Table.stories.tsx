import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { css } from '@/styled-system/css';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
  TableCaption,
  TableFooter,
} from '@/components/data-display/Table';
import { Stack } from '@/components/layout/Stack';
import { Box } from '@/components/layout/Box';
import { Heading } from '@/components/typography/Heading';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/surfaces/Collapsible';

const meta: Meta<typeof Table> = {
  title: 'Display/Table',
  component: Table,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Table>;

const wideTableClass = css({ minWidth: '[48rem]' });
const productColumnClass = css({ width: '[180px]' });
const inventoryColumnClass = css({ width: '[294px]' });
const verticalWritingTableClass = css({ writingMode: 'vertical-rl', width: 'fit-content' });
const constrainedCaption = `release/${'unbroken-caption-segment-'.repeat(12)}`;

export const Default: Story = {
  render: (args) => (
    <Table {...args}>
      <TableCaption>Imperial to metric conversion factors</TableCaption>
      <TableHead>
        <TableRow>
          <TableHeaderCell scope="col">To convert</TableHeaderCell>
          <TableHeaderCell scope="col">into</TableHeaderCell>
          <TableHeaderCell scope="col">multiply by</TableHeaderCell>
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
          <TableHeaderCell scope="col">Product</TableHeaderCell>
          <TableHeaderCell scope="col">Price</TableHeaderCell>
          <TableHeaderCell scope="col">Stock</TableHeaderCell>
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

export const VerticalWritingMode: Story = {
  render: () => (
    <Table className={verticalWritingTableClass} aria-label="Vertical writing table">
      <TableBody>
        <TableRow>
          <TableCell>甲</TableCell>
          <TableCell>一</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>乙</TableCell>
          <TableCell>二</TableCell>
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
          <TableHeaderCell scope="col">Name</TableHeaderCell>
          <TableHeaderCell scope="col">Email</TableHeaderCell>
          <TableHeaderCell scope="col">Role</TableHeaderCell>
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
          <TableHeaderCell scope="col">Column 1</TableHeaderCell>
          <TableHeaderCell scope="col">Column 2</TableHeaderCell>
          <TableHeaderCell scope="col">Column 3</TableHeaderCell>
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

export const Sizes: Story = {
  render: () => (
    <Stack gap="lg">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Table key={size} size={size} aria-label={`${size} size table`}>
          <TableCaption>{size} size caption</TableCaption>
          <TableBody>
            <TableRow>
              <TableCell>{size} cell</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ))}
    </Stack>
  ),
};

export const ScrollableWideTable: Story = {
  render: () => (
    <Box width="[min(240px,100%)]" maxWidth="100%" minWidth="0">
      <Table.ScrollContainer aria-label="Wide account activity table">
        <Table className={wideTableClass}>
          <TableCaption>Account activity with columns wider than the available panel</TableCaption>
          <TableHead>
            <TableRow>
              <TableHeaderCell scope="col">Timestamp</TableHeaderCell>
              <TableHeaderCell scope="col">Account identifier</TableHeaderCell>
              <TableHeaderCell scope="col">Operation</TableHeaderCell>
              <TableHeaderCell scope="col">Originating network</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>2026-07-17 09:42:18 JST</TableCell>
              <TableCell>acct_enterprise_01827</TableCell>
              <TableCell>Published a production release</TableCell>
              <TableCell>Tokyo office / 192.0.2.42</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Table.ScrollContainer>
    </Box>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Table.ScrollContainer keeps intentionally wide columns locally scrollable without changing the table DOM.',
      },
    },
  },
};

export const ConstrainedLongCaption: Story = {
  render: () => (
    <Box width="[160px]" maxWidth="100%" data-testid="constrained-caption-table">
      <Table aria-label="Constrained caption table">
        <TableCaption>{constrainedCaption}</TableCaption>
        <TableBody>
          <TableRow>
            <TableCell>Contained value</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'A long unbroken caption wraps to the table width without widening its constrained parent.',
      },
    },
  },
};

export const ComposedCaptionDetails: Story = {
  render: function ComposedCaptionDetailsStory() {
    const [open, setOpen] = useState(false);

    return (
      <Stack gap="xs" width="[320px]" maxWidth="100%">
        <Table aria-describedby={open ? 'inventory-caption-details' : undefined}>
          <TableCaption>Inventory summary</TableCaption>
          <TableHead>
            <TableRow>
              <TableHeaderCell scope="col">Product</TableHeaderCell>
              <TableHeaderCell scope="col">Status</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Portable charger</TableCell>
              <TableCell>Available</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Collapsible appearance="ghost" open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger>Show inventory scope</CollapsibleTrigger>
          <CollapsibleContent>
            <div id="inventory-caption-details">
              Counts include active products in the Tokyo warehouse and exclude archived records.
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Stack>
    );
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'Keep Table.Caption concise. Compose complex or progressive supporting information outside the native caption with Collapsible and associate it through aria-describedby so the table name remains stable.',
      },
    },
  },
};

export const DisplayEnhancements: Story = {
  render: () => (
    <Table stickyHeader variant="striped">
      <TableCaption>Inventory summary</TableCaption>
      <TableHead>
        <TableRow>
          <TableHeaderCell scope="col">Product</TableHeaderCell>
          <TableHeaderCell scope="col" textAlign="end">
            In stock
          </TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <Table.EmptyState colSpan={2}>No inventory records found</Table.EmptyState>
      </TableBody>
    </Table>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Sticky headers, semantic numeric alignment, and Table.EmptyState are display-only enhancements.',
      },
    },
  },
};

export const ColumnPresentation: Story = {
  render: () => (
    <Box width="[min(360px,100%)]" maxWidth="100%" minWidth="0">
      <Table.ScrollContainer aria-label="Product inventory">
        <Table
          className={wideTableClass}
          stickyHeader
          headerTone="strong"
          layout="fixed"
          variant="striped"
        >
          <Table.ColumnGroup>
            <Table.Column className={productColumnClass} />
            <Table.Column className={inventoryColumnClass} />
            <Table.Column className={inventoryColumnClass} />
          </Table.ColumnGroup>
          <TableCaption>Product inventory</TableCaption>
          <TableHead>
            <TableRow>
              <TableHeaderCell scope="col" sticky="start" truncate>
                Product
              </TableHeaderCell>
              <TableHeaderCell scope="col" textAlign="end">
                In stock
              </TableHeaderCell>
              <TableHeaderCell scope="col" textAlign="end">
                Reorder level
              </TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell sticky="start" truncate>
                Extremely long product name that remains in its own column
              </TableCell>
              <TableCell textAlign="end">1,240</TableCell>
              <TableCell textAlign="end">100</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Table.ScrollContainer>
    </Box>
  ),
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story:
          'A wide table remains locally scrollable while sticky columns preserve their position inside a constrained panel.',
      },
    },
  },
};
