import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'layout-divider',
  snapshotPrefix: 'divider',
  title: 'Divider',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Variants', story: 'variants' },
    { name: 'Vertical', story: 'vertical' },
  ],
});
