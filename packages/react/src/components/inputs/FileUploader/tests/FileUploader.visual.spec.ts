import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'inputs-fileuploader',
  snapshotPrefix: 'file-uploader',
  title: 'FileUploader',
  stories: [{ name: 'Default', story: 'default' }],
});
