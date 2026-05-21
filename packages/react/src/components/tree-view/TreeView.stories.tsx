import { Box, Flex } from '@/components/layout';
import { FileIcon, FolderIcon } from '@/components/media/Icon/icons';
import type { Meta, StoryObj } from '@storybook/react';
import { TreeView } from './index';

/**
 * Storybook documentation and visual review surface for TreeView.
 * Covers representative usage, controls, and fixed review examples.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS recipe, Radix Slot
 */
const meta: Meta<typeof TreeView> = {
  title: 'Display/TreeView',
  component: TreeView,
  tags: ['autodocs'],
  argTypes: {
    appearance: {
      control: 'select',
      options: ['soft', 'outline'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof TreeView>;

const myHierarchyData = [
  {
    id: '1',
    name: 'src',
    icon: <FolderIcon />,
    children: [
      {
        id: '1-1',
        name: 'components',
        icon: <FolderIcon />,
        children: [
          {
            id: '1-1-1',
            name: 'Button.tsx',
            icon: <FileIcon />,
            children: [
              { id: '1-1-1-1', name: 'Button.tsx', icon: <FileIcon /> },
              { id: '1-1-1-2', name: 'Input.tsx', icon: <FileIcon /> },
            ],
          },
          { id: '1-1-2', name: 'Input.tsx', icon: <FileIcon /> },
        ],
      },
      { id: '1-2', name: 'utils.ts', icon: <FileIcon /> },
    ],
  },
  {
    id: '2',
    name: 'public',
    icon: <FolderIcon />,
    children: [
      { id: '2-1', name: 'favicon.ico', icon: <FileIcon /> },
      { id: '2-2', name: 'logo.svg', icon: <FileIcon /> },
    ],
  },
  { id: '3', name: 'package.json', icon: <FileIcon /> },
];

export const Default: Story = {
  render: (args) => (
    <Box width="[300px]">
      <TreeView {...args} />
    </Box>
  ),
  args: {
    data: myHierarchyData,
    appearance: 'soft',
    defaultExpandedIds: ['1', '1-1'],
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const ManualPartsConstruction: Story = {
  render: () => (
    <Box width="[300px]">
      <TreeView.Root defaultExpandedIds={['node-1']}>
        <TreeView.Item id="node-1">
          <TreeView.Trigger>
            <FolderIcon />
            <TreeView.Label>Folder</TreeView.Label>
          </TreeView.Trigger>
          <TreeView.Content>
            <TreeView.Item id="node-1-1" hasChildren={false}>
              <TreeView.Trigger>
                <FileIcon />
                <TreeView.Label>Magic File</TreeView.Label>
              </TreeView.Trigger>
            </TreeView.Item>
          </TreeView.Content>
        </TreeView.Item>
      </TreeView.Root>
    </Box>
  ),
};

export const WithCheckboxes: Story = {
  render: () => (
    <Box width="[300px]">
      <TreeView.Root defaultExpandedIds={['node-1']}>
        <TreeView.Item id="node-1" childrenIds={['node-1-1', 'node-1-2']}>
          <Flex align="center" gap="xs">
            <TreeView.Checkbox aria-label="Select Documents" />
            <TreeView.Trigger>
              <FolderIcon />
              <TreeView.Label>Documents</TreeView.Label>
            </TreeView.Trigger>
          </Flex>
          <TreeView.Content>
            <TreeView.Item id="node-1-1" hasChildren={false}>
              <Flex align="center" gap="xs">
                <TreeView.Checkbox aria-label="Select Work.pdf" />
                <TreeView.Trigger>
                  <FileIcon />
                  <TreeView.Label>Work.pdf</TreeView.Label>
                </TreeView.Trigger>
              </Flex>
            </TreeView.Item>
            <TreeView.Item id="node-1-2" hasChildren={false}>
              <Flex align="center" gap="xs">
                <TreeView.Checkbox aria-label="Select Personal.pdf" />
                <TreeView.Trigger>
                  <FileIcon />
                  <TreeView.Label>Personal.pdf</TreeView.Label>
                </TreeView.Trigger>
              </Flex>
            </TreeView.Item>
          </TreeView.Content>
        </TreeView.Item>
      </TreeView.Root>
    </Box>
  ),
};
