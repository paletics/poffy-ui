import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'layout-hstack',
  snapshotPrefix: 'hstack',
  title: 'HStack',
  stories: [{ name: 'Default', story: 'default' }],
});
