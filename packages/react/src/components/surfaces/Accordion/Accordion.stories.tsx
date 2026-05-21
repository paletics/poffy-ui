import type { Meta, StoryObj } from '@storybook/react';
import { css } from '@/styled-system/css';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './index';

/**
 * A set of vertically stacked collapsible panels for organizing content into expand/collapse sections.
 * Use for FAQs, settings groups, or any layout that benefits from condensing large amounts of vertical content.
 *
 * ### AI Context & Architecture
 * - **Tier**: Organisms
 * - **Stack**: Panda CSS recipe (`accordion` - `defineSlotRecipe`), Radix Slot, `useAccordionState` hook, AccordionContext
 */
const meta: Meta<typeof Accordion> = {
  title: 'Display/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  argTypes: {
    appearance: {
      control: 'select',
      options: ['soft', 'outline', 'ghost'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

const constrainedWidthClass = css({
  width: '[280px]',
  maxWidth: '100%',
});

export const Default: Story = {
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>Yes, it adheres to the WAI-ARIA design pattern.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes, it comes with default styles that match the other components&apos; aesthetic.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          It has basic open/close logic. Animations can be added via CSS transitions or libraries.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Playground: Story = {
  args: {
    appearance: 'soft',
    multiple: false,
  },
  render: Default.render,
};

export const Multiple: Story = {
  render: Default.render,
  args: {
    multiple: true,
  },
};

export const Outlined: Story = {
  render: Default.render,
  args: {
    appearance: 'outline',
  },
};

export const WithDisabled: Story = {
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Enabled item</AccordionTrigger>
        <AccordionContent>This item can be opened and closed.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" disabled>
        <AccordionTrigger>Disabled item</AccordionTrigger>
        <AccordionContent>This content is not reachable.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const ConstrainedWidth: Story = {
  args: {
    defaultValue: 'item-1',
  },
  render: (args) => (
    <div className={constrainedWidthClass}>
      <Accordion {...args}>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            ExtremelyLongAccordionTriggerLabelWithoutNaturalBreakpoints
          </AccordionTrigger>
          <AccordionContent>
            https://example.com/reports/2026/accordion-width-regression-check-with-a-long-unbroken-segment
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Normal trigger</AccordionTrigger>
          <AccordionContent>Short supporting content stays within the same width.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};
