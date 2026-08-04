import type { Meta, StoryObj } from '@storybook/react';
import { Grid } from '@/components/layout/Grid';
import { Stack } from '@/components/layout/Stack';
import { StaggerTransition } from '@/components/animations/StaggerTransition/StaggerTransition';
import { css } from '@/styled-system/css';

const meta: Meta<typeof StaggerTransition> = {
  title: 'Animations/StaggerTransition',
  component: StaggerTransition,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof StaggerTransition>;

const renderItem = (index: number) => (
  <StaggerTransition.Item
    key={index}
    className={css({
      p: 'base',
      bg: 'white',
      borderWidth: 'thin',
      borderStyle: 'solid',
      borderColor: 'layout.divider',
      borderRadius: 'md',
      boxShadow: 'sm',
    })}
  >
    Item {index + 1}
  </StaggerTransition.Item>
);

export const Default: Story = {
  render: () => (
    <StaggerTransition
      asChild
      className={css({
        p: 'xl',
        bg: 'slate.50',
      })}
    >
      <Stack gap="sm">{[...Array(5)].map((_, i) => renderItem(i))}</Stack>
    </StaggerTransition>
  ),
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const GridPop: Story = {
  args: {
    animationType: 'burst',
    itemAnimationType: 'pop',
  },
  render: (args) => (
    <StaggerTransition
      {...args}
      asChild
      className={css({
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 'base',
        p: 'xl',
      })}
    >
      <Grid>
        {[...Array(6)].map((_, i) => (
          <StaggerTransition.Item
            key={i}
            className={css({
              h: '[100px]',
              bg: 'indigo.500',
              borderRadius: 'lg',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
            })}
          >
            Card {i + 1}
          </StaggerTransition.Item>
        ))}
      </Grid>
    </StaggerTransition>
  ),
};

export const SlideHorizontal: Story = {
  args: {
    itemAnimationType: 'slide',
    animationType: 'lazy',
  },
  render: (args) => (
    <StaggerTransition
      {...args}
      asChild
      className={css({
        p: 'xl',
        maxWidth: '[400px]',
      })}
    >
      <Stack gap="sm">
        {[...Array(4)].map((_, i) => (
          <StaggerTransition.Item
            key={i}
            className={css({
              p: '[12px]',
              bg: 'slate.800',
              color: 'white',
              borderRadius: 'sm',
              borderLeft: '4px solid',
              borderLeftColor: 'blue.400',
            })}
          >
            Navigation Link {i + 1}
          </StaggerTransition.Item>
        ))}
      </Stack>
    </StaggerTransition>
  ),
};
