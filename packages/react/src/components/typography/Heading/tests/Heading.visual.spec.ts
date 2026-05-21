import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'display-heading',
  snapshotPrefix: 'heading',
  title: 'Heading',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'AsChild', story: 'as-child' },
    { name: 'Levels', story: 'levels' },
    { name: 'Weights', story: 'weights' },
    { name: 'TypeScale', story: 'type-scale' },
  ],
});
