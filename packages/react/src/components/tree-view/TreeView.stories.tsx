import { Box, Flex } from '@/components/layout';
import { FileIcon, FolderIcon } from '@/components/media/Icon/icons';
import { AnimationProvider } from '@/providers/AnimationProvider';
import type { Meta, StoryObj } from '@storybook/react';
import { TreeView } from './index';


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

const deepHierarchyData = [
  {
    id: 'deep-1',
    name: 'Level 1',
    icon: <FolderIcon />,
    children: [
      {
        id: 'deep-2',
        name: 'Level 2',
        icon: <FolderIcon />,
        children: [
          {
            id: 'deep-3',
            name: 'Level 3',
            icon: <FolderIcon />,
            children: [
              {
                id: 'deep-4',
                name: 'Level 4',
                icon: <FolderIcon />,
                children: [
                  {
                    id: 'deep-5',
                    name: 'Level 5',
                    icon: <FolderIcon />,
                    children: [
                      {
                        id: 'deep-leaf',
                        name: 'Deep leaf',
                        icon: <FileIcon />,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
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
        <TreeView.Item id="node-1" hasChildren>
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
        <TreeView.Item id="node-1" hasChildren childrenIds={['node-1-1', 'node-1-2']}>
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

export const LongLabel: Story = {
  render: () => (
    <Box width="[12rem]">
      <TreeView.Root defaultExpandedIds={['long-folder']}>
        <TreeView.Item id="long-folder" hasChildren>
          <TreeView.Trigger>
            <FolderIcon />
            <TreeView.Label>
              A deliberately long folder name that must truncate without overflowing its tree row
            </TreeView.Label>
          </TreeView.Trigger>
          <TreeView.Content>
            <TreeView.Item id="long-file" hasChildren={false}>
              <TreeView.Trigger>
                <FileIcon />
                <TreeView.Label>
                  A deliberately long child filename that must truncate within a narrow viewport.tsx
                </TreeView.Label>
              </TreeView.Trigger>
            </TreeView.Item>
          </TreeView.Content>
        </TreeView.Item>
      </TreeView.Root>
    </Box>
  ),
};

export const DeepConstrainedReducedMotion: Story = {
  render: () => (
    <AnimationProvider global={false} defaultAnimationEnabled={false}>
      <Box width="[6rem]" aria-label="Deep constrained tree container" dir="rtl">
        <TreeView
          aria-label="Deep constrained tree"
          data={deepHierarchyData}
          defaultExpandedIds={['deep-1', 'deep-2', 'deep-3', 'deep-4', 'deep-5']}
          dir="rtl"
        />
      </Box>
    </AnimationProvider>
  ),
};
