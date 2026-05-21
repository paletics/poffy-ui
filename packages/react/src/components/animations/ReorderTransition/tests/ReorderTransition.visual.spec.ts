import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'animations-reordertransition',
  snapshotPrefix: 'reorder-transition',
  title: 'ReorderTransition',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'AsChild', story: 'as-child' },
    { name: 'Reorder', story: 'reorder' },
    { name: 'Slide', story: 'slide' },
  ],
});
