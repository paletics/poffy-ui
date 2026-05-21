import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'display-avatar',
  snapshotPrefix: 'avatar',
  title: 'Avatar',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Sizes', story: 'sizes' },
    { name: 'AsChild', story: 'as-child' },
    { name: 'Fallback', story: 'fallback' },
    { name: 'BrokenImage', story: 'broken-image' },
  ],
});
