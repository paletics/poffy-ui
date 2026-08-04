import { Box, Stack } from '@/components/layout';
import { IconButton } from '@/components/inputs/IconButton';
import {
  InputGroup,
  InputStartAddon,
  InputStartElement,
  InputEndAddon,
  InputEndElement,
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
    <Stack gap="md" width="[min(320px, calc(100vw - 4rem))]">
      <InputGroup>
        <InputStartAddon>https://</InputStartAddon>
        <InputGroup.Input placeholder="example.com" />
      </InputGroup>

      <InputGroup>
        <InputGroup.Input placeholder="Amount" type="number" />
        <InputEndAddon>.00</InputEndAddon>
      </InputGroup>

      <InputGroup>
        <InputStartAddon>https://</InputStartAddon>
        <InputGroup.Input placeholder="example" />
        <InputEndAddon>.com</InputEndAddon>
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
    <Stack gap="md" width="[min(320px, calc(100vw - 4rem))]">
      <InputGroup>
        <InputStartElement>
          <MailIcon />
        </InputStartElement>
        <InputGroup.Input placeholder="Email address" type="email" />
      </InputGroup>

      <InputGroup>
        <InputGroup.Input type="password" placeholder="Enter password" />
        <InputEndElement>
          <CheckIcon />
        </InputEndElement>
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
    <Stack gap="md" width="[min(320px, calc(100vw - 4rem))]">
      <InputGroup size="sm">
        <InputStartAddon>sm</InputStartAddon>
        <InputGroup.Input placeholder="Small field" />
        <InputEndElement>
          <SearchIcon />
        </InputEndElement>
      </InputGroup>
      <InputGroup size="md">
        <InputStartAddon>md</InputStartAddon>
        <InputGroup.Input placeholder="Medium field" />
        <InputEndElement>
          <SearchIcon />
        </InputEndElement>
      </InputGroup>
      <InputGroup size="lg">
        <InputStartAddon>lg</InputStartAddon>
        <InputGroup.Input placeholder="Large field" />
        <InputEndElement>
          <SearchIcon />
        </InputEndElement>
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
    <Stack gap="md" width="[min(400px, calc(100vw - 4rem))]">
      <InputGroup>
        <InputStartAddon>https://</InputStartAddon>
        <InputStartElement>
          <SearchIcon />
        </InputStartElement>
        <InputGroup.Input placeholder="Search domain..." />
      </InputGroup>

      <InputGroup>
        <InputStartElement>
          <MailIcon />
        </InputStartElement>
        <InputGroup.Input placeholder="Send amount" type="number" />
        <InputEndAddon>USD</InputEndAddon>
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
          'Constructing interactive elements using `InputEndElement`. Here, a clickable button controls the internal masked state (`type="password"` vs `text`).',
      },
    },
  },
  render: function PasswordRevealStory() {
    const [show, setShow] = useState(false);

    return (
      <Box width="[min(320px, calc(100vw - 4rem))]">
        <InputGroup>
          <InputGroup.Input
            type={show ? 'text' : 'password'}
            aria-label="Password"
            placeholder="Enter your password"
          />
          <InputEndElement interactive>
            <IconButton
              size="xs"
              appearance="ghost"
              onClick={() => setShow(!show)}
              aria-label={show ? 'Hide password' : 'Show password'}
              icon={show ? <EyeOffIcon /> : <EyeIcon />}
            />
          </InputEndElement>
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

/** Verifies that a supported addon action keeps its external focus ring visible. */
export const AddonFocusSafety: Story = {
  render: () => (
    <Box width="[min(320px, calc(100vw - 4rem))]">
      <InputGroup>
        <InputGroup.Input placeholder="Filter results" />
        <InputEndAddon>
          <IconButton aria-label="Clear filter" appearance="ghost" icon={<CheckIcon />} />
        </InputEndAddon>
      </InputGroup>
    </Box>
  ),
};

export const PracticalMinimum: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Recommended readable widths: 10rem for a standard field with one inline element, and 16rem for a composition with addons on both sides. Narrower fixtures verify containment and action access only.',
      },
    },
  },
  render: () => (
    <Stack gap="lg">
      <Box width="[10rem]" maxWidth="100%">
        <InputGroup>
          <InputStartElement>
            <SearchIcon />
          </InputStartElement>
          <InputGroup.Input aria-label="Practical domain" defaultValue="example" />
        </InputGroup>
      </Box>
      <Box width="[16rem]" maxWidth="100%" data-testid="practical-input-group-owner">
        <InputGroup>
          <InputStartAddon>https://</InputStartAddon>
          <InputGroup.Input aria-label="Practical website" defaultValue="example" />
          <InputEndAddon>.com</InputEndAddon>
        </InputGroup>
      </Box>
    </Stack>
  ),
};

/** Keeps a functional inline action available when decorative slots collapse. */
export const ExtremeNarrowInteractiveElement: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A 32px containment stress fixture below the practical text-input width. It verifies that the interactive end action remains reachable; readable input content is intentionally outside this fixture’s contract.',
      },
    },
  },
  render: () => (
    <Box width="[2rem]">
      <InputGroup>
        <InputStartElement>
          <SearchIcon />
        </InputStartElement>
        <InputGroup.Input aria-label="Narrow search" />
        <InputEndElement interactive>
          <IconButton aria-label="Clear narrow search" appearance="ghost" icon={<CheckIcon />} />
        </InputEndElement>
      </InputGroup>
    </Box>
  ),
};
