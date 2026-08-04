import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '@/components/layout/Box';
import { Button } from '@/components/inputs/Button';
import { Text } from '@/components/typography/Text';
import { css } from '@/styled-system/css';
import { Backdrop } from '@/components/overlay/Backdrop/Backdrop';
import { useState } from 'react';
import { createPortal } from 'react-dom';


const meta: Meta<typeof Backdrop> = {
  title: 'Overlay/Backdrop',
  component: Backdrop,
  tags: ['autodocs'],
  argTypes: {
    asChild: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Backdrop>;

const containerClass = css({
  height: '[300px]',
  width: '100%',
  position: 'relative',
  overflow: 'hidden',
  borderWidth: 'thin',
  borderStyle: 'solid',
  borderColor: 'layout.divider',
});
const copyClass = css({ p: 'lg' });
const absoluteBackdropClass = css({ position: 'absolute' });
const customBackdropClass = css({
  position: 'absolute',
  bg: '[rgba(255, 0, 0, 0.2)]',
  backdropFilter: 'blur(4px)',
});

export const Default: Story = {
  render: (args) => (
    <Box className={containerClass}>
      <Text className={copyClass}>
        The backdrop is rendered inside this container with absolute positioning.
      </Text>
      <Backdrop {...args} className={absoluteBackdropClass} />
    </Box>
  ),
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const CustomStyle: Story = {
  args: {
    className: customBackdropClass,
  },
  render: (args) => (
    <Box className={containerClass}>
      <Text className={copyClass}>Custom red tinted backdrop with blur.</Text>
      <Backdrop {...args} />
    </Box>
  ),
};

const IframeScrollLockExample = () => {
  const [frame, setFrame] = useState<HTMLIFrameElement | null>(null);
  const [open, setOpen] = useState(false);
  const target = frame?.contentDocument?.body;

  return (
    <>
      <Button onClick={() => setOpen((value) => !value)}>
        {open ? 'Close iframe backdrop' : 'Open iframe backdrop'}
      </Button>
      <iframe ref={setFrame} title="Backdrop owner document" />
      {open && target ? createPortal(<Backdrop data-testid="iframe-backdrop" />, target) : null}
    </>
  );
};

export const IframeScrollLock: Story = {
  render: () => <IframeScrollLockExample />,
};
