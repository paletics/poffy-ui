import type { Meta, StoryObj } from '@storybook/react';
import { Flex } from '@/components/layout/Flex';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/surfaces/Card';
import { Button } from '@/components/inputs/Button';
import { css } from '@/styled-system/css';


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
const constrainedCardClass = css({ width: '[180px]', maxWidth: '100%' });

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

export const ConstrainedLongChrome: Story = {
  render: () => (
    <Card className={constrainedCardClass} aria-label="Constrained long-content card">
      <CardHeader>release-configuration-with-an-unusually-long-unbroken-identifier</CardHeader>
      <CardBody>CardBodyWithAnUnusuallyLongUnbrokenIdentifierThatMustWrapInsideTheCard</CardBody>
      <CardFooter>https://example.com/releases/2026/07/long-footer-destination</CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Header, body, and footer text wrap within a narrow card.',
      },
    },
  },
};

export const FocusableContent: Story = {
  parameters: {
    docs: {
      description: {
        story: 'A direct action can use the full card width without clipping its focus ring.',
      },
    },
  },
  render: () => (
    <Card className={variantCardClass} aria-label="Focusable card">
      <Button width="100%">Focusable card action</Button>
    </Card>
  ),
};
