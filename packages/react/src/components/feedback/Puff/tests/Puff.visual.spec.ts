import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'feedback-puff',
  snapshotPrefix: 'puff',
  title: 'Puff',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Gallery', story: 'gallery' },
    { name: 'UseCases', story: 'use-cases' },
    { name: 'Positions', story: 'positions' },
    { name: 'TopLeft', story: 'top-left' },
  ],
});
