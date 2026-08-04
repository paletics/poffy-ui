import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/inputs/Button';
import { Box, Stack } from '@/components/layout';
import { CollapseTransition } from './CollapseTransition';
import { collapseVariants } from './CollapseTransition.presets';
import type { CollapseTransitionProps } from './CollapseTransition.types';

const meta: Meta<typeof CollapseTransition> = {
  title: 'Animations/CollapseTransition',
  component: CollapseTransition,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    animationType: {
      control: 'select',
      options: Object.keys(collapseVariants),
      description: 'The collapse animation preset to use.',
    },
    isOpen: {
      control: 'boolean',
      description: 'Whether the collapsible region is open.',
    },
    keepMounted: {
      control: 'boolean',
      description: 'Whether the region remains mounted when closed.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof CollapseTransition>;

const InteractiveTemplate = (args: CollapseTransitionProps) => {
  const [isOpen, setIsOpen] = useState(args.isOpen ?? true);

  return (
    <Stack gap="sm" align="flex-start">
      <Button
        appearance="outline"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((value) => !value)}
      >
        Toggle region
      </Button>
      <CollapseTransition {...args} isOpen={isOpen}>
        <Box
          mt="sm"
          width="[320px]"
          p="md"
          borderWidth="thin"
          borderColor="blue.200"
          borderRadius="md"
          bg="blue.50"
          color="slate.900"
          fontSize="sm"
        >
          Collapsible content can contain multiple lines, controls, or nested groups while the
          wrapper owns height and opacity motion.
        </Box>
      </CollapseTransition>
    </Stack>
  );
};

const DynamicCollapseContent = () => {
  const [itemCount, setItemCount] = useState(1);

  return (
    <Box
      data-testid="dynamic-collapse-content"
      width="[320px]"
      p="md"
      borderWidth="thin"
      borderColor="blue.200"
      borderRadius="md"
      bg="blue.50"
    >
      <Button appearance="outline" onClick={() => setItemCount((count) => count + 1)}>
        Add nested content
      </Button>
      <Button
        appearance="outline"
        disabled={itemCount === 1}
        onClick={() => setItemCount((count) => Math.max(1, count - 1))}
      >
        Remove nested content
      </Button>
      {Array.from({ length: itemCount }, (_, index) => (
        <Box key={index} mt="sm">
          Nested content row {index + 1}
        </Box>
      ))}
    </Box>
  );
};

export const Default: Story = {
  args: {
    animationType: 'height-fade',
    isOpen: true,
  },
  render: InteractiveTemplate,
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const HeightOnly: Story = {
  args: {
    animationType: 'height',
    isOpen: true,
  },
  render: InteractiveTemplate,
};

export const ScaleY: Story = {
  args: {
    animationType: 'scale-y',
    isOpen: true,
  },
  render: InteractiveTemplate,
};

export const KeepMounted: Story = {
  args: {
    animationType: 'height-fade',
    isOpen: true,
    keepMounted: true,
  },
  render: InteractiveTemplate,
};

const DynamicContentExample = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Stack gap="sm" align="flex-start">
      <Button aria-expanded={isOpen} onClick={() => setIsOpen((value) => !value)}>
        Toggle dynamic region
      </Button>
      <CollapseTransition
        data-testid="dynamic-collapse"
        isOpen={isOpen}
        keepMounted
        animationType="height-fade"
      >
        <DynamicCollapseContent />
      </CollapseTransition>
    </Stack>
  );
};

export const DynamicContent: Story = {
  render: () => <DynamicContentExample />,
};

const FocusedOpeningExample = () => {
  const [isOpen, setIsOpen] = useState(false);
  const nestedActionRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) nestedActionRef.current?.focus();
  }, [isOpen]);

  return (
    <Stack gap="sm" align="flex-start">
      <Button onClick={() => setIsOpen(true)}>Open focusable region</Button>
      <CollapseTransition
        data-testid="focusable-collapse"
        isOpen={isOpen}
        animationType="height-fade"
      >
        <Box p="md" borderWidth="thin" borderColor="blue.200" borderRadius="md">
          <Button ref={nestedActionRef}>Focusable nested action</Button>
        </Box>
      </CollapseTransition>
    </Stack>
  );
};

export const FocusedOpening: Story = {
  render: () => <FocusedOpeningExample />,
};

const IframeDynamicContentExample = () => {
  const [frame, setFrame] = useState<HTMLIFrameElement | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  const target = frame?.contentDocument?.body;

  return (
    <>
      <Button aria-expanded={isOpen} onClick={() => setIsOpen((value) => !value)}>
        Toggle iframe region
      </Button>
      <iframe ref={setFrame} title="Collapse owner document" />
      {target
        ? createPortal(
            <CollapseTransition
              data-testid="iframe-dynamic-collapse"
              isOpen={isOpen}
              keepMounted
              animationType="height-fade"
            >
              <DynamicCollapseContent />
            </CollapseTransition>,
            target,
          )
        : null}
    </>
  );
};

export const IframeDynamicContent: Story = {
  render: () => <IframeDynamicContentExample />,
};
