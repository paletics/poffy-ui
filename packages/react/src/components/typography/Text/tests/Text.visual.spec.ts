import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'display-text',
  snapshotPrefix: 'text',
  title: 'Text',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Variants', story: 'variants' },
    { name: 'AsChild', story: 'as-child' },
    { name: 'Weights', story: 'weights' },
    { name: 'Alignments', story: 'alignments' },
  ],
});
