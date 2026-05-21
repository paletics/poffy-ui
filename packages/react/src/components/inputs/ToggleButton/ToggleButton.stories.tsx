import { Button } from '@/components/inputs/Button';
import { ToggleButton } from '@/components/inputs/ToggleButton';
import { Flex, Stack } from '@/components/layout';
import { HeartIcon, StarIcon } from '@/components/media/Icon/icons';
import { Text } from '@/components/typography/Text';
import { css } from '@/styled-system/css';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';

/**
 * Storybook documentation and visual review surface for ToggleButton.
 * Covers representative usage, controls, and fixed review examples.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS recipe, Radix Slot
 */
const meta = {
  title: 'Inputs/ToggleButton',
  component: ToggleButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A dual-state button that toggles between pressed and unpressed. Supports `pressed` (controlled) and `defaultPressed` (uncontrolled) modes. `aria-pressed` is set automatically.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

const warningIconClass = css({ color: 'variants.warning.main' });
const dangerIconClass = css({ color: 'variants.danger.main' });

export const Default: Story = {
  args: {
    children: 'Toggle me',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Default uncontrolled toggle button. Clicking it cycles between pressed and unpressed without external state.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const btn = canvas.getByRole('button', { name: /toggle me/i });
    await expect(btn).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(btn);
    await expect(btn).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(btn);
    await expect(btn).toHaveAttribute('aria-pressed', 'false');
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'All four sizes: `xs`, `sm`, `md`, `lg`. Each scales padding and font proportionally via Silver Ratio tokens.',
      },
    },
  },
  args: { children: 'Toggle' },
  render: () => (
    <Flex gap="md" align="center">
      <ToggleButton size="xs">Extra Small</ToggleButton>
      <ToggleButton size="sm">Small</ToggleButton>
      <ToggleButton size="md">Medium</ToggleButton>
      <ToggleButton size="lg">Large</ToggleButton>
    </Flex>
  ),
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '`ghost` (default), `soft`, `outline`, and `minimal` appearances. `ghost` blends into toolbars while `soft` works better for filter chips.',
      },
    },
  },
  args: { children: 'Toggle' },
  render: () => (
    <Flex gap="md" align="center" wrap="wrap">
      <Stack gap="xs">
        <Text variant="caption" color="text.secondary">
          Ghost
        </Text>
        <ToggleButton appearance="ghost">Toggle</ToggleButton>
      </Stack>
      <Stack gap="xs">
        <Text variant="caption" color="text.secondary">
          Soft
        </Text>
        <ToggleButton appearance="soft">Toggle</ToggleButton>
      </Stack>
      <Stack gap="xs">
        <Text variant="caption" color="text.secondary">
          Outline
        </Text>
        <ToggleButton appearance="outline">Toggle</ToggleButton>
      </Stack>
      <Stack gap="xs">
        <Text variant="caption" color="text.secondary">
          Minimal
        </Text>
        <ToggleButton appearance="minimal">Toggle</ToggleButton>
      </Stack>
    </Flex>
  ),
};

export const WithIcons: Story = {
  args: { children: 'Star' },
  parameters: {
    docs: {
      description: {
        story: 'Icon + label toggle. The icon color changes based on `pressed` state.',
      },
    },
  },
  render: function WithIconsStory() {
    const [starred, setStarred] = useState(false);
    const [liked, setLiked] = useState(false);

    return (
      <Flex gap="md" align="center">
        <ToggleButton
          pressed={starred}
          onPressedChange={setStarred}
          leftIcon={<StarIcon className={starred ? warningIconClass : undefined} />}
        >
          {starred ? 'Starred' : 'Star'}
        </ToggleButton>
        <ToggleButton
          pressed={liked}
          onPressedChange={setLiked}
          leftIcon={<HeartIcon className={liked ? dangerIconClass : undefined} />}
          appearance="soft"
        >
          {liked ? 'Liked' : 'Like'}
        </ToggleButton>
      </Flex>
    );
  },
};

export const IconOnly: Story = {
  args: { children: 'Star' },
  parameters: {
    docs: {
      description: {
        story:
          'Icon-only toggle with dynamic `aria-label` ("Star" / "Unstar"). Required for screen-reader clarity.',
      },
    },
  },
  render: function IconOnlyStory() {
    const [starred, setStarred] = useState(false);

    return (
      <ToggleButton
        pressed={starred}
        onPressedChange={setStarred}
        aria-label={starred ? 'Unstar' : 'Star'}
      >
        <StarIcon className={starred ? warningIconClass : undefined} />
      </ToggleButton>
    );
  },
};

export const Controlled: Story = {
  args: { children: 'ON' },
  parameters: {
    docs: {
      description: {
        story:
          'Fully controlled mode via `pressed` + `onPressedChange`. An external button also updates state to demonstrate two-way binding.',
      },
    },
  },
  render: function ControlledToggleButtonStory() {
    const [pressed, setPressed] = useState(false);

    return (
      <Stack gap="md" align="flex-start">
        <ToggleButton pressed={pressed} onPressedChange={setPressed}>
          {pressed ? 'ON' : 'OFF'}
        </ToggleButton>
        <Text variant="caption" color="text.secondary">
          State: <strong>{pressed ? 'Pressed' : 'Not pressed'}</strong>
        </Text>
        <Button appearance="outline" onClick={() => setPressed(!pressed)}>
          Toggle from outside
        </Button>
      </Stack>
    );
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled state. `aria-disabled` is set and click events are suppressed.',
      },
    },
  },
};

export const FilterButtons: Story = {
  args: { children: 'Filter' },
  parameters: {
    docs: {
      description: {
        story:
          'Multi-toggle filter chip pattern. Each `ToggleButton` independently manages a filter flag in shared parent state.',
      },
    },
  },
  render: function FilterButtonsStory() {
    const [filters, setFilters] = useState({
      new: false,
      popular: false,
      trending: false,
    });

    return (
      <Stack gap="xs">
        <Text variant="body2" weight="semibold">
          Filters:
        </Text>
        <Flex gap="xs">
          <ToggleButton
            pressed={filters.new}
            onPressedChange={(p) => setFilters({ ...filters, new: p })}
            size="sm"
          >
            New
          </ToggleButton>
          <ToggleButton
            pressed={filters.popular}
            onPressedChange={(p) => setFilters({ ...filters, popular: p })}
            size="sm"
          >
            Popular
          </ToggleButton>
          <ToggleButton
            pressed={filters.trending}
            onPressedChange={(p) => setFilters({ ...filters, trending: p })}
            size="sm"
          >
            Trending
          </ToggleButton>
        </Flex>
        <Text variant="caption" color="text.secondary">
          Active filters:{' '}
          {(() => {
            const active = Object.entries(filters)
              .filter(([, v]) => v)
              .map(([k]) => k);

            return active.length === 0 ? 'None' : active.join(', ');
          })()}
        </Text>
      </Stack>
    );
  },
};
