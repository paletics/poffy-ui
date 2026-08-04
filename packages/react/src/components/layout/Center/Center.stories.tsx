import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/components/inputs/Button';
import { css } from '@/styled-system/css';
import { Center } from './Center';
import { Box } from '../Box';


const meta: Meta<typeof Center> = {
  title: 'Layout/Center',
  component: Center,
  tags: ['autodocs'],
  argTypes: {
    bg: { control: 'color' },
    color: { control: 'color' },
    p: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Center>;

const viewportGradientClass = css({
  bgGradient: 'to-r',
  gradientFrom: 'violet.400',
  gradientTo: 'pink.600',
});

export const Default: Story = {
  args: {
    bg: 'blue.100',
    w: 'full',
    h: '[200px]',
    children: 'Centered Content',
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const WithIcon: Story = {
  args: {
    bg: 'violet.500',
    color: 'white',
    w: '2xl',
    h: '2xl',
    borderRadius: 'full',
    children: '*',
  },
};

export const LoadingSpinner: Story = {
  render: () => (
    <Center h="[300px]" bg="slate.50">
      <Box
        w="2xl"
        h="2xl"
        borderRadius="full"
        borderWidth="strong"
        borderStyle="solid"
        borderColor="blue.200"
        borderTopColor="blue.500"
        animation="spin 1s linear infinite"
      />
    </Center>
  ),
};

export const EmptyState: Story = {
  render: () => (
    <Center h="[400px]" bg="slate.50">
      <Box textAlign="center" maxW="sm" p="xl">
        <Center mb="base">
          <Box
            w="3xl"
            h="3xl"
            bg="slate.200"
            borderRadius="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="2xl"
          >
            ?
          </Box>
        </Center>
        <Box fontSize="xl" fontWeight="bold" mb="sm">
          No items found
        </Box>
        <Box color="slate.600">There are no items to display at this time.</Box>
      </Box>
    </Center>
  ),
};

export const CardCentering: Story = {
  render: () => (
    <Center minH="[400px]" bg="slate.100" p="base">
      <Box maxW="md" w="full" bg="white" borderRadius="lg" boxShadow="md" p="xl">
        <Box fontSize="2xl" fontWeight="bold" mb="base">
          Login
        </Box>
        <Box mb="base">
          <Box as="label" display="block" mb="sm" fontWeight="medium">
            Email
          </Box>
          <Box
            as="input"
            type="email"
            w="full"
            p="sm"
            borderWidth="thin"
            borderStyle="solid"
            borderColor="slate.300"
            borderRadius="md"
          />
        </Box>
        <Box mb="lg">
          <Box as="label" display="block" mb="sm" fontWeight="medium">
            Password
          </Box>
          <Box
            as="input"
            type="password"
            w="full"
            p="sm"
            borderWidth="thin"
            borderStyle="solid"
            borderColor="slate.300"
            borderRadius="md"
          />
        </Box>
        <Box
          as="button"
          w="full"
          bg="blue.500"
          color="white"
          p="md"
          borderRadius="md"
          fontWeight="medium"
          _hover={{ bg: 'blue.600' }}
        >
          Sign In
        </Box>
      </Box>
    </Center>
  ),
};

export const FullViewportCentering: Story = {
  render: () => (
    <Center h="[100vh]" className={viewportGradientClass}>
      <Box textAlign="center" color="white" p="xl">
        <Box fontSize="3xl" fontWeight="bold" mb="sm">
          Welcome
        </Box>
        <Box fontSize="xl" opacity="0.9">
          Center anything in the viewport
        </Box>
      </Box>
    </Center>
  ),
};

export const AsChild: Story = {
  render: () => (
    <Center asChild h="[200px]" bg="blue.50">
      <Button>I&apos;m a centered button element</Button>
    </Center>
  ),
};
