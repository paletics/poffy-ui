import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'display-badge',
  snapshotPrefix: 'badge',
  title: 'Badge',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Sizes', story: 'sizes' },
    { name: 'Appearances', story: 'appearances' },
    { name: 'Placements', story: 'placements' },
    { name: 'AsChild', story: 'as-child' },
  ],
});
