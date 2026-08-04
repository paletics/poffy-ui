import type { Meta, StoryObj } from '@storybook/react';
import { FileUploader } from '@/components/inputs/FileUploader';
import { Stack } from '@/components/layout';
import { Text } from '@/components/typography';
import { useState } from 'react';
import { css } from '@/styled-system/css';


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

const narrowUploaderClass = css({
  width: '[12rem]',
  maxWidth: '100%',
});

const constrainedUploaderGalleryClass = css({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  gap: 'xl',
});

const constrainedUploaderCaseClass = css({
  display: 'flex',
  flexDirection: 'column',
  gap: 'xs',
});

const uploaderAtEightRemClass = css({
  width: '[8rem]',
});

const uploaderAtFourRemClass = css({
  width: '[4rem]',
});

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

export const NarrowRtlLongContent: Story = {
  render: function NarrowRtlLongContentStory() {
    const [files] = useState(() => [
      new File(
        ['content'],
        'extremely-long-file-name-without-break-opportunities-for-upload-validation.pdf',
        { type: 'application/pdf' },
      ),
    ]);

    return (
      <div className={narrowUploaderClass} dir="rtl">
        <FileUploader
          locale="ja-JP"
          defaultFiles={files}
          helperText="VeryLongUploadInstructionWithoutAnyNaturalBreakOpportunities"
        />
      </div>
    );
  },
};

export const ConstrainedWidths: Story = {
  render: function ConstrainedWidthsStory() {
    const [files] = useState(() => ({
      imageAtEightRem: new File(['image'], 'image-at-128-pixels.png', { type: 'image/png' }),
      documentAtEightRem: new File(['document'], 'document-at-128-pixels.pdf', {
        type: 'application/pdf',
      }),
      imageAtFourRem: new File(['image'], 'image-at-64-pixels.png', { type: 'image/png' }),
      documentAtFourRem: new File(['document'], 'document-at-64-pixels.pdf', {
        type: 'application/pdf',
      }),
    }));

    return (
      <div className={constrainedUploaderGalleryClass}>
        <div className={constrainedUploaderCaseClass} data-testid="file-uploader-image-128">
          <Text variant="caption">128 image</Text>
          <div className={uploaderAtEightRemClass}>
            <FileUploader defaultFiles={[files.imageAtEightRem]} helperText="Upload image" />
          </div>
        </div>
        <div
          className={constrainedUploaderCaseClass}
          data-testid="file-uploader-document-128-rtl"
          dir="rtl"
        >
          <Text variant="caption">128 document RTL</Text>
          <div className={uploaderAtEightRemClass}>
            <FileUploader defaultFiles={[files.documentAtEightRem]} helperText="Upload document" />
          </div>
        </div>
        <div className={constrainedUploaderCaseClass} data-testid="file-uploader-image-64">
          <Text variant="caption">64 image</Text>
          <div className={uploaderAtFourRemClass}>
            <FileUploader defaultFiles={[files.imageAtFourRem]} helperText="Upload" />
          </div>
        </div>
        <div
          className={constrainedUploaderCaseClass}
          data-testid="file-uploader-document-64-rtl"
          dir="rtl"
        >
          <Text variant="caption">64 document RTL</Text>
          <div className={uploaderAtFourRemClass}>
            <FileUploader defaultFiles={[files.documentAtFourRem]} helperText="Upload" />
          </div>
        </div>
      </div>
    );
  },
};
