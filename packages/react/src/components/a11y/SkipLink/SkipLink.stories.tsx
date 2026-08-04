import type { Meta, StoryObj } from '@storybook/react';
import { SkipLink } from './SkipLink';

const meta: Meta<typeof SkipLink> = {
  title: 'A11y/SkipLink',
  component: SkipLink,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SkipLink>;

export const Default: Story = {
  args: { href: '#main-content', children: 'Skip to main content' },
  render: (args) => (
    <>
      <SkipLink {...args} />
      <nav aria-label="Primary navigation">Navigation</nav>
      <main id="main-content" tabIndex={-1}>
        Main content
      </main>
    </>
  ),
};

export const Playground: Story = { args: Default.args, render: Default.render };
