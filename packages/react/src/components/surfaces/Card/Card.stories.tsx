import type { Meta, StoryObj } from '@storybook/react';
import { Flex } from '@/components/layout/Flex';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/surfaces/Card';
import { css } from '@/styled-system/css';

/**
 * A versatile container that groups related content into a distinct visual surface using CardHeader, CardBody, and CardFooter sub-components.
 * Use to present homogeneous items or discrete UI actions with consistent padding and border treatment.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS recipe (`card` - `defineSlotRecipe`), Radix Slot, CardContext
 */
const meta: Meta<typeof Card> = {
  title: 'Display/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    appearance: {
      control: 'select',
      options: ['solid', 'soft', 'outline', 'ghost', 'neo', 'glass'],
    },
    intent: {
      control: 'select',
      options: ['primary', 'secondary', 'info', 'success', 'warning', 'danger'],
    },
    shape: {
      control: 'select',
      options: ['rounded', 'square'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

const basicCardClass = css({ maxWidth: '[400px]' });
const variantCardClass = css({ width: '[300px]' });

export const Default: Story = {
  args: {
    appearance: 'solid',
    intent: 'primary',
    shape: 'rounded',
  },
  render: (args) => (
    <Card {...args} className={basicCardClass}>
      <CardHeader>Card Header</CardHeader>
      <CardBody>This is the body of the card. It contains the main content.</CardBody>
      <CardFooter>Card Footer</CardFooter>
    </Card>
  ),
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Variants = () => (
  <Flex gap="lg" wrap="wrap">
    <Card appearance="solid" className={variantCardClass}>
      <CardHeader>Solid</CardHeader>
      <CardBody>Standard surface styling.</CardBody>
    </Card>
    <Card appearance="outline" className={variantCardClass}>
      <CardHeader>Outline</CardHeader>
      <CardBody>Border styling.</CardBody>
    </Card>
    <Card appearance="soft" className={variantCardClass}>
      <CardHeader>Soft</CardHeader>
      <CardBody>Tinted surface styling.</CardBody>
    </Card>
  </Flex>
);

export const Appearances = () => (
  <Flex gap="lg" wrap="wrap">
    <Card appearance="ghost" className={variantCardClass}>
      <CardHeader>Ghost</CardHeader>
      <CardBody>Minimal chrome styling.</CardBody>
    </Card>
    <Card appearance="glass" className={variantCardClass}>
      <CardHeader>Glass</CardHeader>
      <CardBody>Translucent surface styling.</CardBody>
    </Card>
    <Card appearance="neo" intent="warning" className={variantCardClass}>
      <CardHeader>Neo</CardHeader>
      <CardBody>Brand-forward brutalist surface styling.</CardBody>
    </Card>
    <Card appearance="soft" intent="success" className={variantCardClass}>
      <CardHeader>Success</CardHeader>
      <CardBody>Semantic accent styling.</CardBody>
    </Card>
  </Flex>
);
