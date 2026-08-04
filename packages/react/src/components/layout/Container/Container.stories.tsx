import type { Meta, StoryObj } from '@storybook/react';
import { Container } from './Container';
import { Box } from '../Box';
import { Flex } from '../Flex';


const meta: Meta<typeof Container> = {
  title: 'Layout/Container',
  component: Container,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Container>;

export const Default: Story = {
  args: {
    bg: 'slate.100',
    h: '[200px]',
    children: 'This container is centered and constrained.',
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const WithContent: Story = {
  render: () => (
    <Container py="xl">
      <Box fontSize="3xl" fontWeight="bold" mb="base">
        Page Title
      </Box>
      <Box color="slate.600" mb="lg">
        This is a typical page layout with a container that centers content and constrains its
        maximum width responsively.
      </Box>
      <Flex gap="md">
        <Box flex="1" p="lg" bg="blue.50" borderRadius="md">
          Card 1
        </Box>
        <Box flex="1" p="lg" bg="blue.50" borderRadius="md">
          Card 2
        </Box>
        <Box flex="1" p="lg" bg="blue.50" borderRadius="md">
          Card 3
        </Box>
      </Flex>
    </Container>
  ),
};

export const ArticleLayout: Story = {
  render: () => (
    <Container py="2xl">
      <Box as="article">
        <Box as="header" mb="xl">
          <Box fontSize="3xl" fontWeight="bold" mb="sm">
            Article Title
          </Box>
          <Box color="slate.600">Published on February 17, 2026</Box>
        </Box>
        <Box as="section" mb="lg" lineHeight="1.8">
          <Box mb="base">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris.
          </Box>
          <Box mb="base">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
            officia deserunt mollit anim id est laborum.
          </Box>
        </Box>
      </Box>
    </Container>
  ),
};

export const ResponsivePadding: Story = {
  render: () => (
    <Box bg="slate.50" minH="[300px]">
      <Container bg="white" py="xl">
        <Box fontSize="2xl" fontWeight="bold" mb="base">
          Responsive Padding
        </Box>
        <Box color="slate.600" mb="base">
          This container has responsive horizontal padding:
        </Box>
        <Box as="ul" pl="lg" color="slate.700" lineHeight="1.8">
          <li>
            Base (mobile): <code>md</code> padding
          </li>
          <li>
            Tablet and up: <code>xl</code> padding
          </li>
        </Box>
        <Box mt="base" p="base" bg="blue.50" borderRadius="md">
          Resize the viewport to see the padding adapt automatically.
        </Box>
      </Container>
    </Box>
  ),
};

export const MultipleContainers: Story = {
  render: () => (
    <Box>
      <Box bg="blue.500" color="white" py="3xl">
        <Container>
          <Box fontSize="3xl" fontWeight="bold" mb="sm">
            Hero Section
          </Box>
          <Box>Constrained hero content</Box>
        </Container>
      </Box>
      <Box bg="white" py="2xl">
        <Container>
          <Box fontSize="2xl" fontWeight="bold" mb="base">
            Main Content
          </Box>
          <Box color="slate.600">
            Each section uses a Container to maintain consistent max-width and centering across
            different background colors.
          </Box>
        </Container>
      </Box>
      <Box bg="slate.100" py="2xl">
        <Container>
          <Box fontSize="2xl" fontWeight="bold" mb="base">
            Another Section
          </Box>
          <Box color="slate.600">
            All containers align perfectly regardless of the parent background.
          </Box>
        </Container>
      </Box>
    </Box>
  ),
};

export const AsChild: Story = {
  render: () => (
    <Container asChild py="xl">
      <main>
        <Box fontSize="3xl" fontWeight="bold" mb="base">
          Semantic Main Element
        </Box>
        <Box color="slate.600">
          This Container is rendered as a <code>&lt;main&gt;</code> element using the asChild
          pattern for better semantic HTML.
        </Box>
      </main>
    </Container>
  ),
};
