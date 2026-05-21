import type { Meta, StoryObj } from '@storybook/react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarLink } from '.';
import { Button } from '@/components/inputs/Button';
import { css } from '@/styled-system/css';

/**
 * Storybook documentation and visual review surface for Navbar.
 * Covers representative usage, controls, and fixed review examples.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS recipe, Radix Slot
 */
const meta: Meta<typeof Navbar> = {
  title: 'Navigation/Navbar',
  component: Navbar,
  tags: ['autodocs'],
  argTypes: {
    appearance: {
      control: 'select',
      options: ['soft', 'outline', 'ghost'],
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Navbar>;

const tallPageClass = css({ height: '[150vh]' });
const contentClass = css({ p: 'lg' });

export const Default: Story = {
  args: {
    appearance: 'soft',
  },
  render: (args) => (
    <Navbar {...args}>
      <NavbarBrand href="#">Brand</NavbarBrand>
      <NavbarContent>
        <NavbarItem>
          <NavbarLink href="#" isActive>
            Home
          </NavbarLink>
        </NavbarItem>
        <NavbarItem>
          <NavbarLink href="#">Features</NavbarLink>
        </NavbarItem>
        <NavbarItem>
          <NavbarLink href="#">Pricing</NavbarLink>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <Button size="sm">Login</Button>
        <Button size="sm">Sign Up</Button>
      </NavbarContent>
    </Navbar>
  ),
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Sticky: Story = {
  args: {
    sticky: true,
  },
  render: (args) => (
    <div className={tallPageClass}>
      <Navbar {...args}>
        <NavbarBrand href="#">Sticky Brand</NavbarBrand>
        <NavbarContent>
          <NavbarLink href="#">Link 1</NavbarLink>
          <NavbarLink href="#">Link 2</NavbarLink>
        </NavbarContent>
      </Navbar>
      <div className={contentClass}>
        <p>Scroll down to see sticky behavior</p>
      </div>
    </div>
  ),
};
