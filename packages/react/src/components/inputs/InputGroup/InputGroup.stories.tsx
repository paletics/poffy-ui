import { Box, Stack } from '@/components/layout';
import { IconButton } from '@/components/inputs/IconButton';
import {
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  InputRightAddon,
  InputRightElement,
} from '@/components/inputs/InputGroup';
import {
  CheckIcon,
  EyeIcon,
  EyeOffIcon,
  MailIcon,
  SearchIcon,
} from '@/components/media/Icon/icons';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { css } from '@/styled-system/css';

/**
 * Storybook documentation and visual review surface for InputGroup.
 * Covers representative usage, controls, and fixed review examples.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS recipe, Radix Slot
 */
const meta = {
  title: 'Inputs/InputGroup',
  component: InputGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A structural wrapper that composes an `Input` field with prepended or appended addons, or absolutely positioned icon elements. Utilizes React Context to automatically align styles and border radii securely.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const interactiveElementClass = css({ pointerEvents: 'auto' });

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Addons explicitly extend the visual border of the input field. Ideal for URLs, currencies, or fixed prefix text. The inner field automatically drops corresponding border radii.',
      },
    },
  },
  render: () => (
    <Stack gap="md" width="[320px]">
      <InputGroup>
        <InputLeftAddon>https://</InputLeftAddon>
        <InputGroup.Input placeholder="example.com" />
      </InputGroup>

      <InputGroup>
        <InputGroup.Input placeholder="Amount" type="number" />
        <InputRightAddon>.00</InputRightAddon>
      </InputGroup>

      <InputGroup>
        <InputLeftAddon>https://</InputLeftAddon>
        <InputGroup.Input placeholder="example" />
        <InputRightAddon>.com</InputRightAddon>
      </InputGroup>
    </Stack>
  ),
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const WithElements: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Elements are absolutely positioned components (usually icons or small buttons) inside the input field. The inner field padding automatically adjusts to prevent overlapping.',
      },
    },
  },
  render: () => (
    <Stack gap="md" width="[320px]">
      <InputGroup>
        <InputLeftElement>
          <MailIcon />
        </InputLeftElement>
        <InputGroup.Input placeholder="Email address" type="email" />
      </InputGroup>

      <InputGroup>
        <InputGroup.Input type="password" placeholder="Enter password" />
        <InputRightElement>
          <CheckIcon />
        </InputRightElement>
      </InputGroup>
    </Stack>
  ),
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Available sizes: `sm`, `md`, and `lg`. The size cascades safely to all Addon and Element sub-components without requiring individual declarations.',
      },
    },
  },
  render: () => (
    <Stack gap="md" width="[320px]">
      <InputGroup size="sm">
        <InputLeftAddon>sm</InputLeftAddon>
        <InputGroup.Input placeholder="Small field" />
      </InputGroup>
      <InputGroup size="md">
        <InputLeftAddon>md</InputLeftAddon>
        <InputGroup.Input placeholder="Medium field" />
      </InputGroup>
      <InputGroup size="lg">
        <InputLeftAddon>lg</InputLeftAddon>
        <InputGroup.Input placeholder="Large field" />
      </InputGroup>
    </Stack>
  ),
};

export const MixedLayout: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Complex combinations of elements and addons. The visual offsets and radii automatically calculate boundaries perfectly via CSS slots.',
      },
    },
  },
  render: () => (
    <Stack gap="md" width="[400px]">
      <InputGroup>
        <InputLeftAddon>https://</InputLeftAddon>
        <InputLeftElement>
          <SearchIcon />
        </InputLeftElement>
        <InputGroup.Input placeholder="Search domain..." />
      </InputGroup>

      <InputGroup>
        <InputLeftElement>
          <MailIcon />
        </InputLeftElement>
        <InputGroup.Input placeholder="Send amount" type="number" />
        <InputRightAddon>USD</InputRightAddon>
      </InputGroup>
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const searchInput = canvas.getByPlaceholderText('Search domain...');

    await userEvent.type(searchInput, 'example.com');
    await expect(searchInput).toHaveValue('example.com');
  },
};

export const PasswordReveal: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Constructing interactive elements using `InputRightElement`. Here, a clickable button controls the internal masked state (`type="password"` vs `text`).',
      },
    },
  },
  render: function PasswordRevealStory() {
    const [show, setShow] = useState(false);

    return (
      <Box width="[320px]">
        <InputGroup>
          <InputGroup.Input type={show ? 'text' : 'password'} placeholder="Enter your password" />
          <InputRightElement className={interactiveElementClass}>
            <IconButton
              size="xs"
              appearance="ghost"
              onClick={() => setShow(!show)}
              aria-label={show ? 'Hide password' : 'Show password'}
              icon={show ? <EyeOffIcon /> : <EyeIcon />}
            />
          </InputRightElement>
        </InputGroup>
      </Box>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('Enter your password');
    const button = canvas.getByRole('button', { name: /show password/i });

    await userEvent.type(input, 'SuperSecret');
    await expect(input).toHaveAttribute('type', 'password');

    await userEvent.click(button);
    await expect(input).toHaveAttribute('type', 'text');
    await expect(button).toHaveAttribute('aria-label', 'Hide password');

    await userEvent.click(button);
    await expect(input).toHaveAttribute('type', 'password');
  },
};
