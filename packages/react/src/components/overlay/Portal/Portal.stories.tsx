import { Button } from '@/components/inputs/Button';
import { Box } from '@/components/layout/Box';
import { Stack } from '@/components/layout/Stack';
import { Text } from '@/components/typography/Text';
import { PortalProvider } from '@/providers/PortalProvider';
import { css } from '@/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react';
import { useRef, useState } from 'react';
import { Portal } from './Portal';
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from '../Popover';

const panelClass = css({
  borderWidth: 'thin',
  borderStyle: 'solid',
  borderColor: 'layout.divider',
  borderRadius: 'md',
  bg: 'layout.surface',
  boxShadow: 'md',
  color: 'text.primary',
  maxWidth: '[320px]',
  p: 'md',
});

const targetClass = css({
  borderWidth: 'thin',
  borderStyle: 'dashed',
  borderColor: 'layout.divider',
  borderRadius: 'md',
  minHeight: '[96px]',
  p: 'md',
});


const meta: Meta<typeof Portal> = {
  title: 'Overlay/Portal',
  component: Portal,
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Portal>;

export const Default: Story = {
  render: (args) => (
    <Stack gap="md">
      <Text>Content below is rendered at the document body level.</Text>
      <Portal {...args}>
        <Box className={panelClass} role="status">
          Portalled body content
        </Box>
      </Portal>
    </Stack>
  ),
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

const CustomContainerExample = () => {
  const targetRef = useRef<HTMLDivElement | null>(null);

  return (
    <Stack gap="md">
      <Box ref={targetRef} className={targetClass} aria-label="Custom portal target">
        <Text>Custom target</Text>
      </Box>
      <Portal container={() => targetRef.current}>
        <Box className={panelClass}>Rendered inside the custom target</Box>
      </Portal>
    </Stack>
  );
};

export const CustomContainer: Story = {
  render: () => <CustomContainerExample />,
};

const ProviderCustomTargetExample = () => {
  const providerTargetRef = useRef<HTMLDivElement | null>(null);
  const overrideTargetRef = useRef<HTMLDivElement | null>(null);

  return (
    <Stack gap="md">
      <Box
        ref={providerTargetRef}
        className={targetClass}
        role="region"
        aria-label="Provider portal target"
      >
        <Text>Provider target</Text>
      </Box>
      <Box
        ref={overrideTargetRef}
        className={targetClass}
        role="region"
        aria-label="Explicit portal target"
      >
        <Text>Explicit target</Text>
      </Box>

      <PortalProvider container={() => providerTargetRef.current}>
        <Portal>
          <Text>Provider inherited portal content</Text>
        </Portal>
        <Portal container={() => overrideTargetRef.current}>
          <Text>Explicit override portal content</Text>
        </Portal>

        <Popover>
          <PopoverTrigger asChild>
            <Button>Open provider popover</Button>
          </PopoverTrigger>
          <PopoverContent focusManagement>
            <PopoverClose aria-label="Close provider popover" />
            <Box className={panelClass}>
              <PopoverTitle>Provider popover</PopoverTitle>
              <PopoverDescription>Rendered in the provider target.</PopoverDescription>
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="sm">Open nested popover</Button>
                </PopoverTrigger>
                <PopoverContent focusManagement>
                  <PopoverClose aria-label="Close nested popover" />
                  <Box className={panelClass}>
                    <PopoverTitle>Nested provider popover</PopoverTitle>
                    <PopoverDescription>
                      Nested through the parent Floating UI portal.
                    </PopoverDescription>
                  </Box>
                </PopoverContent>
              </Popover>
            </Box>
          </PopoverContent>
        </Popover>
      </PortalProvider>
    </Stack>
  );
};

export const ProviderCustomTarget: Story = {
  render: () => <ProviderCustomTargetExample />,
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => (
    <Stack gap="md">
      <Text>Disabled portals render in place.</Text>
      <Portal {...args}>
        <Box className={panelClass}>Inline portal content</Box>
      </Portal>
    </Stack>
  ),
};

const ToggleExample = () => {
  const [open, setOpen] = useState(false);

  return (
    <Stack gap="md">
      <Button onClick={() => setOpen((value) => !value)}>
        {open ? 'Hide portal' : 'Show portal'}
      </Button>
      {open ? (
        <Portal>
          <Box className={panelClass} role="status">
            Toggle portal content
          </Box>
        </Portal>
      ) : null}
    </Stack>
  );
};

export const Toggle: Story = {
  render: () => <ToggleExample />,
};
