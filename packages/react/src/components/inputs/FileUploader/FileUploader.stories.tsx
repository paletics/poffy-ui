import type { Meta, StoryObj } from '@storybook/react';
import { FileUploader } from '@/components/inputs/FileUploader';
import { Stack } from '@/components/layout';
import { Text } from '@/components/typography';
import { useState } from 'react';

/**
 * Storybook documentation and visual review surface for FileUploader.
 * Covers representative usage, controls, and fixed review examples.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS recipe, Radix Slot
 */
const meta: Meta<typeof FileUploader> = {
  title: 'Inputs/FileUploader',
  component: FileUploader,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Drop zone + click-to-browse file uploader. Supports single and multiple file selection. Files trigger `onChange(files: File[])`. Accessible: `role="button"` with keyboard Enter/Space support.',
      },
    },
  },
  argTypes: {
    appearance: { control: 'select', options: ['outline', 'soft', 'ghost'] },
    intent: { control: 'select', options: ['primary', 'secondary', 'success', 'danger'] },
  },
};

export default meta;
type Story = StoryObj<typeof FileUploader>;

export const Default: Story = {
  args: {
    helperText: 'Upload relevant documents',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Single-file drop zone with helper text. Click or drag a file onto the zone to trigger `onChange`.',
      },
    },
  },
};

export const Playground: Story = {
  args: Default.args,
  render: Default.render,
};

export const Multiple: Story = {
  args: {
    multiple: true,
    helperText: 'Drop multiple files here',
  },
  parameters: {
    docs: {
      description: {
        story: '`multiple` prop enabled; accepts multiple files in a single drop or selection.',
      },
    },
  },
};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Controlled interactive demo. The chosen file count updates below the drop zone.',
      },
    },
  },
  render: function InteractiveFileUploaderStory() {
    const [files, setFiles] = useState<File[]>([]);
    return (
      <Stack gap="sm">
        <FileUploader multiple onChange={setFiles} helperText="Upload files (Interactive)" />
        <Text>Count: {files.length}</Text>
      </Stack>
    );
  },
};
