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
import { useEffect, useRef } from 'react';
import { AnimationProvider } from '@/providers/AnimationProvider';
import { Button } from '../../inputs/Button';
import { Puff } from './Puff';
import { PuffProvider, usePuff } from './hooks/usePuffContext';
import { PuffBaseProps } from './Puff.types';

const meta: Meta<PuffBaseProps> = {
  title: 'Feedback/Puff',
  component: Puff,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Flex
        minHeight="[400px]"
        justify="center"
        align="center"
        bg="layout.background"
        p={{ base: 'md', md: '2xl' }}
      >
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

const CustomRenderTrigger = () => {
  const { addPuff, removePuff } = usePuff();
  const puffId = useRef('');
  return (
    <Button
      size="sm"
      appearance="solid"
      intent="primary"
      onClick={() => {
        puffId.current = addPuff({
          intent: 'primary',
          render: () => (
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
                onClick={() => removePuff(puffId.current)}
                aria-label="Dismiss custom puff"
              >
                <CrossIcon />
              </Button>
            </Flex>
          ),
        });
      }}
    >
      Custom Render
    </Button>
  );
};

const InitiallyVisiblePuff = ({ options }: { options: PuffBaseProps }) => {
  const { addPuff } = usePuff();
  const didAddPuff = useRef(false);

  useEffect(() => {
    if (didAddPuff.current) return;
    didAddPuff.current = true;
    addPuff(options);
  }, [addPuff, options]);

  return null;
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
    live: {
      control: 'select',
      options: ['polite', 'assertive', 'off'],
    },
    announcement: { control: 'text' },
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
        <Grid
          aria-label="Puff appearance gallery"
          minChildWidth="160px"
          gap="md"
          width="[min(720px, calc(100vw - 2rem))]"
        >
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
            label="Info Outline"
            options={{
              title: 'Info',
              children: 'Outline appearance',
              intent: 'info',
              appearance: 'outline',
              icon: <InfoIcon />,
            }}
          />
          <TriggerButton
            label="Warning Outline"
            options={{
              title: 'Warning',
              children: 'Outline appearance',
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
            label="Secondary Outline"
            options={{
              title: 'Secondary',
              children: 'Outline appearance',
              intent: 'secondary',
              appearance: 'outline',
              icon: <BellIcon />,
            }}
          />
          <TriggerButton
            label="Dark Outline"
            options={{
              title: 'Dark',
              children: 'Outline appearance',
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
          <CustomRenderTrigger />
        </Flex>
      </Stack>
    </PuffProvider>
  ),
};

export const VisualMatrix: Story = {
  render: () => (
    <Stack gap="md" width="[min(520px, calc(100vw - 2rem))]">
      <Puff intent="primary" appearance="solid" size="sm" title="Primary">
        Compact notification
      </Puff>
      <Puff intent="success" appearance="soft" size="md" title="Saved">
        Your workspace changes are now live.
      </Puff>
      <Puff intent="warning" appearance="outline" size="lg" title="Review required">
        A long notification message demonstrates wrapping within the available width.
      </Puff>
      <Puff
        isSimple
        intent="danger"
        appearance="solid"
        size="md"
        action={<Button size="xs">Undo</Button>}
      >
        File deleted
      </Puff>
    </Stack>
  ),
};

export const TopLeftVisible: Story = {
  render: () => (
    <PuffProvider point="top-left">
      <InitiallyVisiblePuff
        options={{
          title: 'Top left notification',
          children: 'Provider-managed position is visible for visual review.',
          intent: 'info',
          appearance: 'soft',
          duration: 60_000,
        }}
      />
    </PuffProvider>
  ),
};

export const BottomRightVisible: Story = {
  render: () => (
    <PuffProvider point="bottom-right">
      <InitiallyVisiblePuff
        options={{
          title: 'Bottom right notification',
          children: 'Provider-managed position is visible for visual review.',
          intent: 'success',
          appearance: 'solid',
          duration: 60_000,
        }}
      />
    </PuffProvider>
  ),
};

const StackedPuffsWithActions = () => {
  const { addPuff } = usePuff();
  const didAddPuffs = useRef(false);

  useEffect(() => {
    if (didAddPuffs.current) return;
    didAddPuffs.current = true;
    Array.from({ length: 12 }, (_, index) => {
      const item = index + 1;
      addPuff({
        title: `Queued item ${item}`,
        children: 'A focusable action must remain fully visible at the scroll edge.',
        action: <Button size="xs">Review item {item}</Button>,
        duration: 60_000,
      });
    });
  }, [addPuff]);

  return null;
};

export const ScrollableActions: Story = {
  render: () => (
    <PuffProvider point="top-right">
      <StackedPuffsWithActions />
    </PuffProvider>
  ),
};

export const ScrollableActionsBottom: Story = {
  render: () => (
    <PuffProvider point="bottom-right">
      <StackedPuffsWithActions />
    </PuffProvider>
  ),
};

export const NoMotionVisible: Story = {
  render: () => (
    <AnimationProvider global={false} defaultAnimationEnabled={false}>
      <PuffProvider point="top-center">
        <InitiallyVisiblePuff
          options={{
            title: 'Motion disabled',
            children: 'The provider notification remains visible without motion.',
            intent: 'warning',
            appearance: 'outline',
            animationType: 'slide',
            duration: 60_000,
          }}
        />
      </PuffProvider>
    </AnimationProvider>
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

export const NarrowViewport: Story = {
  render: () => (
    <PuffProvider point="top-center">
      <Stack gap="sm">
        <TriggerButton
          label="Show structured puff"
          options={{
            size: 'lg',
            'aria-label': 'Structured narrow puff',
            title: 'Notificationidentifierwithoutbreakopportunities',
            children: 'Long content remains readable inside the available viewport width.',
            duration: 60_000,
          }}
        />
        <TriggerButton
          label="Show simple puff"
          options={{
            size: 'lg',
            isSimple: true,
            'aria-label': 'Simple narrow puff',
            children: 'Simplemessagewithoutbreakopportunities',
            duration: 60_000,
          }}
        />
      </Stack>
    </PuffProvider>
  ),
};
