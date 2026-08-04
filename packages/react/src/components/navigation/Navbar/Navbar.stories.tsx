import type { Meta, StoryObj } from '@storybook/react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarLink } from '.';
import { Button } from '@/components/inputs/Button';
import { css } from '@/styled-system/css';


const meta: Meta<typeof Navbar> = {
  title: 'Navigation/Navbar',
  component: Navbar,
  tags: ['autodocs'],
  argTypes: {
    appearance: {
      control: 'select',
      options: ['soft', 'outline', 'ghost'],
    },
    narrowLayout: {
      control: 'radio',
      options: ['scroll', 'wrap'],
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

export const NarrowWrap: Story = {
  render: () => (
    <Navbar narrowLayout="wrap" aria-label="Responsive primary navigation">
      <NavbarBrand href="#home">PoffyWorkspaceWithAnUnbrokenBrandName</NavbarBrand>
      <NavbarContent>
        <NavbarItem>
          <NavbarLink href="#dashboard" isActive>
            Dashboard
          </NavbarLink>
        </NavbarItem>
        <NavbarItem>
          <NavbarLink href="#projects">Projects</NavbarLink>
        </NavbarItem>
        <NavbarItem>
          <NavbarLink href="#activity">AReallyLongUnbrokenNavigationDestinationLabel</NavbarLink>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <Button size="sm">Sign in</Button>
        <Button size="sm">Create account</Button>
      </NavbarContent>
    </Navbar>
  ),
};
