import { css, cx } from '@/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '@/components/layout/Box';
import { Flex } from '@/components/layout/Flex';
import { Grid } from '@/components/layout/Grid';
import { Stack } from '@/components/layout/Stack';
import { Text } from '@/components/typography/Text';
import { RevealTransition } from '@/components/animations/RevealTransition/RevealTransition';
import { revealVariants } from '@/components/animations/RevealTransition/RevealTransition.presets';
import type { RevealAnimationType } from '@/components/animations/RevealTransition/RevealTransition.types';

const meta: Meta<typeof RevealTransition> = {
  title: 'Animations/RevealTransition',
  component: RevealTransition,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    animationType: {
      control: 'select',
      options: Object.keys(revealVariants),
      description: 'The type of animation preset to use.',
    },
    once: {
      control: 'boolean',
      description: 'Whether the animation should happen only once.',
    },
    threshold: {
      control: { type: 'number', min: 0, max: 1, step: 0.1 },
      description: 'The viewport threshold to trigger the animation.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof RevealTransition>;

const boxStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '[150px]',
  height: '[150px]',
  bg: 'blue.500',
  color: 'white',
  fontWeight: 'bold',
  borderRadius: '2xl',
  fontSize: 'sm',
  textAlign: 'center',
  boxShadow: 'xl',
  transition: '[background 0.3s]',
});

const renderRevealGalleryItem = (type: RevealAnimationType) => (
  <Stack key={type} alignItems="center">
    <Text mb="base" fontSize="xs" color="slate.500" fontWeight="bold">
      {type.toUpperCase()}
    </Text>
    <RevealTransition animationType={type}>
      <Box className={cx(boxStyle, css({ width: '[200px]', height: '[100px]' }))}>{type}</Box>
    </RevealTransition>
  </Stack>
);

export const Default: Story = {
  render: (args) => (
    <Flex
      className={css({
        minHeight: '[150vh]',
        pt: '[100vh]',
        display: 'flex',
        justifyContent: 'center',
      })}
    >
      <RevealTransition {...args} animationType="fade-up">
        <Box className={cx(boxStyle, css({ bg: 'indigo.600' }))}>Fade Up (Scroll Down)</Box>
      </RevealTransition>
    </Flex>
  ),
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Gallery: Story = {
  render: () => (
    <Grid
      className={css({
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '2xl',
        p: 'xl',
      })}
    >
      {renderRevealGalleryItem('fade-up')}
      {renderRevealGalleryItem('fade-down')}
      {renderRevealGalleryItem('fade-right')}
      {renderRevealGalleryItem('fade-left')}
      {renderRevealGalleryItem('zoom')}
      {renderRevealGalleryItem('blur')}
    </Grid>
  ),
};

export const Thresholds: Story = {
  render: () => (
    <Stack gap="xl" p="xl">
      {[0.1, 0.5, 0.9].map((t) => (
        <Stack key={t} alignItems="center">
          <Text mb="sm" fontSize="xs">
            Threshold: {t}
          </Text>
          <RevealTransition threshold={t} animationType="fade-up">
            <Box
              className={cx(
                boxStyle,
                css({ width: '[300px]', height: '[60px]', bg: 'emerald.500' }),
              )}
            >
              Triggers at {t * 100}%
            </Box>
          </RevealTransition>
        </Stack>
      ))}
    </Stack>
  ),
};

export const AsChild: Story = {
  render: (args) => (
    <Flex
      className={css({
        minHeight: '[150vh]',
        pt: '[100vh]',
        display: 'flex',
        justifyContent: 'center',
      })}
    >
      <RevealTransition {...args} asChild animationType="fade-up">
        <Box className={cx(boxStyle, css({ bg: 'rose.500' }))}>
          I am a direct child (Scroll Down)
        </Box>
      </RevealTransition>
    </Flex>
  ),
};
