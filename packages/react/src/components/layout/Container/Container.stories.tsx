import type { Meta, StoryObj } from '@storybook/react';
import { Container } from './Container';
import { Box } from '../Box';
import { Flex } from '../Flex';

/**
 * A horizontal constraint block that bounds page content to application-wide max-widths and auto-centers via margin-inline, used to wrap major page sections.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS (Recipe: containerStyle, splitCssProps), Radix Slot
 */
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
    h: '200px',
    children: 'This container is centered and constrained.',
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const WithContent: Story = {
  render: () => (
    <Container py="8">
      <Box fontSize="3xl" fontWeight="bold" mb="4">
        Page Title
      </Box>
      <Box color="slate.600" mb="6">
        This is a typical page layout with a container that centers content and constrains its
        maximum width responsively.
      </Box>
      <Flex gap="md">
        <Box flex="1" p="6" bg="blue.50" borderRadius="md">
          Card 1
        </Box>
        <Box flex="1" p="6" bg="blue.50" borderRadius="md">
          Card 2
        </Box>
        <Box flex="1" p="6" bg="blue.50" borderRadius="md">
          Card 3
        </Box>
      </Flex>
    </Container>
  ),
};

export const ArticleLayout: Story = {
  render: () => (
    <Container py="12">
      <Box as="article">
        <Box as="header" mb="8">
          <Box fontSize="3xl" fontWeight="bold" mb="2">
            Article Title
          </Box>
          <Box color="slate.600">Published on February 17, 2026</Box>
        </Box>
        <Box as="section" mb="6" lineHeight="1.8">
          <Box mb="4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris.
          </Box>
          <Box mb="4">
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
    <Box bg="slate.50" minH="300px">
      <Container bg="white" py="8">
        <Box fontSize="2xl" fontWeight="bold" mb="4">
          Responsive Padding
        </Box>
        <Box color="slate.600" mb="4">
          This container has responsive horizontal padding:
        </Box>
        <Box as="ul" pl="6" color="slate.700" lineHeight="1.8">
          <li>
            Base (mobile): <code>md</code> padding
          </li>
          <li>
            Tablet and up: <code>xl</code> padding
          </li>
        </Box>
        <Box mt="4" p="4" bg="blue.50" borderRadius="md">
          Resize the viewport to see the padding adapt automatically.
        </Box>
      </Container>
    </Box>
  ),
};

export const MultipleContainers: Story = {
  render: () => (
    <Box>
      <Box bg="blue.500" color="white" py="16">
        <Container>
          <Box fontSize="3xl" fontWeight="bold" mb="2">
            Hero Section
          </Box>
          <Box>Constrained hero content</Box>
        </Container>
      </Box>
      <Box bg="white" py="12">
        <Container>
          <Box fontSize="2xl" fontWeight="bold" mb="4">
            Main Content
          </Box>
          <Box color="slate.600">
            Each section uses a Container to maintain consistent max-width and centering across
            different background colors.
          </Box>
        </Container>
      </Box>
      <Box bg="slate.100" py="12">
        <Container>
          <Box fontSize="2xl" fontWeight="bold" mb="4">
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
    <Container asChild py="8">
      <main>
        <Box fontSize="3xl" fontWeight="bold" mb="4">
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
