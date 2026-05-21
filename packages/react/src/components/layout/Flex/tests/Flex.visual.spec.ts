import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'layout-flex',
  snapshotPrefix: 'flex',
  title: 'Flex',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Column', story: 'column' },
    { name: 'JustifySpaceBetween', story: 'justify-space-between' },
    { name: 'Wrap', story: 'wrap' },
  ],
});
