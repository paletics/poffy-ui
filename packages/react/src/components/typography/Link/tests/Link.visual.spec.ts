import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'display-link',
  snapshotPrefix: 'link',
  title: 'Link',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Variants', story: 'variants' },
    { name: 'External', story: 'external' },
    { name: 'AsChild', story: 'as-child' },
  ],
});
