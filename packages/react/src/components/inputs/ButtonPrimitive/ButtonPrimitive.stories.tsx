import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from '@/components/layout/Stack';
import { css } from '@/styled-system/css';
import { ButtonPrimitive } from './ButtonPrimitive';

const baseButtonClass = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minW: '[9rem]',
  h: '[2.5rem]',
  px: 'md',
  borderRadius: 'md',
  borderWidth: 'thin',
  borderStyle: 'solid',
  borderColor: 'border.default',
  bg: 'bg.canvas',
  color: 'fg.default',
  fontWeight: 'semibold',
  cursor: 'pointer',
  _hover: { bg: 'bg.subtle' },
  _focusVisible: {
    outlineWidth: '[var(--poffy-focus-ring-width)]',
    outlineStyle: 'solid',
    outlineColor: 'brand.main',
    outlineOffset: '[var(--poffy-focus-ring-offset)]',
  },
  _disabled: { opacity: 0.45, cursor: 'not-allowed' },
  '&[aria-disabled="true"]': { opacity: 0.45, cursor: 'not-allowed' },
});

const meta: Meta<typeof ButtonPrimitive> = {
  title: 'Inputs/ButtonPrimitive',
  component: ButtonPrimitive,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ButtonPrimitive>;

export const Default: Story = {
  args: {
    className: baseButtonClass,
    children: 'Primitive button',
  },
};

export const AsChild: Story = {
  render: () => (
    <ButtonPrimitive asChild className={baseButtonClass}>
      <a href="#button-primitive-as-child">Anchor child</a>
    </ButtonPrimitive>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Stack gap="sm" align="flex-start">
      <ButtonPrimitive className={baseButtonClass} disabled>
        Disabled button
      </ButtonPrimitive>
      <ButtonPrimitive asChild className={baseButtonClass} disabled>
        <a href="#button-primitive-disabled">Disabled anchor child</a>
      </ButtonPrimitive>
    </Stack>
  ),
};
