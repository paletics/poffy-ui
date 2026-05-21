import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'media-icon',
  snapshotPrefix: 'icon',
  title: 'Icon',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Sizes', story: 'sizes' },
    { name: 'Disabled', story: 'disabled' },
    { name: 'AsChild', story: 'as-child' },
    { name: 'CustomIcons', story: 'custom-icons' },
  ],
});
