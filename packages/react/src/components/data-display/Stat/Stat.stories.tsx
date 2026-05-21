import type { Meta, StoryObj } from '@storybook/react';
import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from '@/components/data-display/Stat';
import { Flex } from '@/components/layout/Flex';

/**
 * Structured block for presenting a single key metric alongside a label, value, and optional trend indicator.
 * Use in dashboards and analytics views to highlight important KPIs.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS (stat recipe), Radix Slot
 */
const meta: Meta<typeof Stat> = {
  title: 'Display/Stat',
  component: Stat,
  tags: ['autodocs'],
  argTypes: {
    intent: {
      control: 'select',
      options: ['success', 'warning', 'danger'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Stat>
      <StatLabel>Collected Fees</StatLabel>
      <StatNumber>$0.00</StatNumber>
      <StatHelpText>Feb 12 - Feb 28</StatHelpText>
    </Stat>
  ),
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const WithIndicators: Story = {
  render: () => (
    <Flex gap="lg">
      <Stat>
        <StatLabel>Sent</StatLabel>
        <StatNumber>345,670</StatNumber>
        <StatHelpText>
          <StatArrow type="increase" />
          23.36%
        </StatHelpText>
      </Stat>

      <Stat>
        <StatLabel>Clicked</StatLabel>
        <StatNumber>45</StatNumber>
        <StatHelpText>
          <StatArrow type="decrease" />
          9.05%
        </StatHelpText>
      </Stat>
      <Stat intent="success">
        <StatLabel>Revenue</StatLabel>
        <StatNumber>$12.4k</StatNumber>
        <StatHelpText>
          <StatArrow type="increase" />
          12.5%
        </StatHelpText>
      </Stat>
    </Flex>
  ),
};
