import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'layout-vstack',
  snapshotPrefix: 'vstack',
  title: 'VStack',
  stories: [{ name: 'Default', story: 'default' }],
});
