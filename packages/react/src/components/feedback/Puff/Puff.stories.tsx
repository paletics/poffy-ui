'use client';

import { Box, Flex, Grid, Stack } from '@/components/layout';
import { Heading } from '@/components/typography/Heading';
import { Text } from '@/components/typography/Text';
import {
  BellIcon,
  CrossIcon,
  ErrorIcon,
  InfoIcon,
  PawIcon,
  SuccessIcon,
  WarningIcon,
} from '@/components/media/Icon/icons';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../inputs/Button';
import { Puff } from './Puff';
import { PuffProvider, usePuff } from './hooks/usePuffContext';
import { PuffBaseProps } from './Puff.types';

/**
 * Storybook documentation and visual review surface for Puff.
 * Covers representative usage, controls, and fixed review examples.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS recipe, Radix Slot
 */
const meta: Meta<PuffBaseProps> = {
  title: 'Feedback/Puff',
  component: Puff,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Flex minHeight="[400px]" justify="center" align="center" bg="layout.background" p="2xl">
        <Story />
      </Flex>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<PuffBaseProps>;

const TriggerButton = ({ options, label }: { options: PuffBaseProps; label: string }) => {
  const { addPuff } = usePuff();
  return (
    <Button size="sm" appearance="solid" intent={options.intent} onClick={() => addPuff(options)}>
      {label}
    </Button>
  );
};

const PlaygroundTrigger = (args: PuffBaseProps) => {
  const { addPuff } = usePuff();
  return (
    <Box textAlign="center">
      <Button
        size="lg"
        onClick={() =>
          addPuff({
            ...args,
            title: args.title ?? 'Playground Puff',
            children: args.children ?? 'Adjust controls to change me!',
          })
        }
      >
        Trigger Playground Puff
      </Button>
    </Box>
  );
};

export const Default: Story = {
  render: (args) => (
    <PuffProvider point={args.point}>
      <PlaygroundTrigger {...args} />
    </PuffProvider>
  ),
  args: {
    point: 'top-right',
    intent: 'primary',
    appearance: 'solid',
    size: 'md',
    animationType: 'puff',
    duration: 5000,
    isSimple: false,
    title: 'Playground Title',
    children: 'Change my props in the controls panel.',
  },
  argTypes: {
    point: {
      control: 'select',
      options: [
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right',
        'center',
      ],
    },
    intent: {
      control: 'select',
      options: ['primary', 'secondary', 'info', 'success', 'warning', 'danger', 'light', 'dark'],
    },
    appearance: {
      control: 'select',
      options: ['solid', 'soft', 'outline'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    animationType: {
      control: 'select',
      options: ['puff', 'fade', 'slide', 'zoom', 'blur', 'popover'],
    },
    duration: { control: { type: 'number', min: 1000, max: 20000, step: 1000 } },
    isSimple: { control: 'boolean' },
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Gallery: Story = {
  render: () => (
    <PuffProvider>
      <Stack gap="2xl" align="center">
        <Heading level={3} size="sm">
          Intents & Appearances
        </Heading>
        <Grid gridTemplateColumns="repeat(4, 1fr)" gap="md">
          <TriggerButton
            label="Primary Solid"
            options={{
              title: 'Primary',
              children: 'Solid appearance',
              intent: 'primary',
              appearance: 'solid',
            }}
          />
          <TriggerButton
            label="Success Soft"
            options={{
              title: 'Success',
              children: 'Soft appearance',
              intent: 'success',
              appearance: 'soft',
              icon: <SuccessIcon />,
            }}
          />
          <TriggerButton
            label="Info Glass"
            options={{
              title: 'Info',
              children: 'Glass appearance',
              intent: 'info',
              appearance: 'outline',
              icon: <InfoIcon />,
            }}
          />
          <TriggerButton
            label="Warning Neo"
            options={{
              title: 'Warning',
              children: 'Neo-brutalism',
              intent: 'warning',
              appearance: 'outline',
              icon: <WarningIcon />,
            }}
          />
          <TriggerButton
            label="Danger Outline"
            options={{
              title: 'Error',
              children: 'Outline appearance',
              intent: 'danger',
              appearance: 'outline',
              icon: <ErrorIcon />,
            }}
          />
          <TriggerButton
            label="Secondary Minimal"
            options={{
              title: 'Secondary',
              children: 'Minimal appearance',
              intent: 'secondary',
              appearance: 'outline',
              icon: <BellIcon />,
            }}
          />
          <TriggerButton
            label="Dark Ghost"
            options={{
              title: 'Dark',
              children: 'Ghost appearance',
              intent: 'dark',
              appearance: 'outline',
              icon: <PawIcon />,
            }}
          />
        </Grid>
      </Stack>
    </PuffProvider>
  ),
};

export const UseCases: Story = {
  render: () => (
    <PuffProvider>
      <Stack gap="xl" align="center">
        <Flex gap="md">
          <TriggerButton
            label="Simple Message"
            options={{
              isSimple: true,
              children: 'Just a simple message without title.',
              intent: 'primary',
              appearance: 'solid',
            }}
          />
          <TriggerButton
            label="With Action"
            options={{
              title: 'File Deleted',
              children: 'The file "report.pdf" was moved to trash.',
              intent: 'dark',
              appearance: 'outline',
              action: (
                <Button size="xs" appearance="solid" intent="danger">
                  Undo
                </Button>
              ),
            }}
          />
        </Flex>
        <Flex gap="md">
          <TriggerButton
            label="Long Content"
            options={{
              title: 'Terms Updated',
              children:
                'We have updated our terms of service. Please review the changes carefully as they affect how we handle your data and your rights as a user. This message is intentionally long to test wrapping.',
              intent: 'info',
              appearance: 'soft',
              duration: 8000,
            }}
          />
          <TriggerButton
            label="Custom Render"
            options={{
              intent: 'primary',
              render: (props) => (
                <Flex
                  align="center"
                  gap="sm"
                  bg="variants.primary.main"
                  color="white"
                  p="md"
                  borderRadius="lg"
                  boxShadow="lg"
                >
                  <InfoIcon />
                  <Box>
                    <Text weight="semibold">Custom Component</Text>
                    <Text variant="caption" opacity="0.9">
                      Fully custom React Node
                    </Text>
                  </Box>
                  <Button
                    size="xs"
                    appearance="ghost"
                    onClick={() => props.removePuff?.(props.id!)}
                    aria-label="Dismiss custom puff"
                  >
                    <CrossIcon />
                  </Button>
                </Flex>
              ),
            }}
          />
        </Flex>
      </Stack>
    </PuffProvider>
  ),
};

export const Positions: Story = {
  render: () => (
    <Grid gridTemplateColumns="repeat(3, 1fr)" gap="md" w="100%" maxWidth="[800px]">
      <Stack gap="xs" align="center" gridColumn="1 / -1">
        <Text align="center" color="text.secondary">
          Use the Playground story to test different positions interactively.
        </Text>
        <Text align="center" color="text.secondary" variant="caption">
          Rendering multiple fixed-position containers simultaneously can cause visual overlap.
        </Text>
      </Stack>
    </Grid>
  ),
};

export const TopLeft: Story = {
  args: { point: 'top-left' },
  render: (args) => (
    <PuffProvider point="top-left">
      <PlaygroundTrigger {...args} title="Top Left" />
    </PuffProvider>
  ),
};
export const TopCenter: Story = {
  args: { point: 'top-center' },
  render: (args) => (
    <PuffProvider point="top-center">
      <PlaygroundTrigger {...args} title="Top Center" />
    </PuffProvider>
  ),
};
export const TopRight: Story = {
  args: { point: 'top-right' },
  render: (args) => (
    <PuffProvider point="top-right">
      <PlaygroundTrigger {...args} title="Top Right" />
    </PuffProvider>
  ),
};
export const BottomLeft: Story = {
  args: { point: 'bottom-left' },
  render: (args) => (
    <PuffProvider point="bottom-left">
      <PlaygroundTrigger {...args} title="Bottom Left" />
    </PuffProvider>
  ),
};
export const BottomCenter: Story = {
  args: { point: 'bottom-center' },
  render: (args) => (
    <PuffProvider point="bottom-center">
      <PlaygroundTrigger {...args} title="Bottom Center" />
    </PuffProvider>
  ),
};
export const BottomRight: Story = {
  args: { point: 'bottom-right' },
  render: (args) => (
    <PuffProvider point="bottom-right">
      <PlaygroundTrigger {...args} title="Bottom Right" />
    </PuffProvider>
  ),
};
