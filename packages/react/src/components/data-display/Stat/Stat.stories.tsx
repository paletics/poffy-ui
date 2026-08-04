import type { Meta, StoryObj } from '@storybook/react';
import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from '@/components/data-display/Stat';
import { Flex } from '@/components/layout/Flex';
import { css } from '@/styled-system/css';

const meta: Meta<typeof Stat> = {
  title: 'Display/Stat',
  component: Stat,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    intent: {
      control: 'select',
      options: ['success', 'warning', 'danger'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const constrainedStatClass = css({ width: '[7.5rem]' });
const responsiveStatClass = css({
  flex: '1 1 10rem',
  minInlineSize: '[8rem]',
});

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
    <Flex gap="lg" wrap="wrap">
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

export const MeaningfulIndicator: Story = {
  render: () => (
    <Stat>
      <StatLabel>Revenue trend</StatLabel>
      <StatNumber>$12.4k</StatNumber>
      <StatHelpText>
        <StatArrow decorative={false} type="increase" aria-label="Revenue increased" />
      </StatHelpText>
    </Stat>
  ),
};

export const Sizes: Story = {
  render: () => (
    <Flex gap="lg" wrap="wrap">
      <Stat className={responsiveStatClass} size="sm">
        <StatLabel>SM revenue</StatLabel>
        <StatNumber>$12.4k</StatNumber>
        <StatHelpText>
          <StatArrow type="increase" /> 12.5% from last month
        </StatHelpText>
      </Stat>
      <Stat className={responsiveStatClass} size="md">
        <StatLabel>MD revenue</StatLabel>
        <StatNumber>$12.4k</StatNumber>
        <StatHelpText>
          <StatArrow type="increase" /> 12.5% from last month
        </StatHelpText>
      </Stat>
      <Stat className={responsiveStatClass} size="lg">
        <StatLabel>LG revenue</StatLabel>
        <StatNumber>$12.4k</StatNumber>
        <StatHelpText>
          <StatArrow type="increase" /> 12.5% from last month
        </StatHelpText>
      </Stat>
    </Flex>
  ),
};

export const ConstrainedLongContent: Story = {
  render: () => (
    <div className={constrainedStatClass} data-testid="constrained-stat-parent">
      <Stat data-testid="constrained-stat">
        <StatLabel>MonthlyRecurringRevenueWithoutBreaks</StatLabel>
        <StatNumber>1234567890123456789012345678901234567890</StatNumber>
        <StatHelpText>
          <StatArrow type="increase" />
          ComparedWithThePreviousUninterruptedPeriod
        </StatHelpText>
      </Stat>
    </div>
  ),
};
