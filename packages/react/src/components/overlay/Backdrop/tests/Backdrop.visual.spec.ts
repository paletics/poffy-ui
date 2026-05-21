import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'overlay-backdrop',
  snapshotPrefix: 'backdrop',
  title: 'Backdrop',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Custom Style', story: 'custom-style' },
  ],
});
