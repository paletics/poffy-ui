import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'media-picture',
  snapshotPrefix: 'picture',
  title: 'Picture',
  stories: [{ name: 'Default', story: 'default' }],
});
