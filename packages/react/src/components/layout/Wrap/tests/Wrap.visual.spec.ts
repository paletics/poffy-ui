import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'layout-wrap',
  snapshotPrefix: 'wrap',
  title: 'Wrap',
  stories: [{ name: 'Default', story: 'default' }],
});
