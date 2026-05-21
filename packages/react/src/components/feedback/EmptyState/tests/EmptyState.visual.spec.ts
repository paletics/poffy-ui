import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'feedback-emptystate',
  snapshotPrefix: 'empty-state',
  title: 'EmptyState',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Sizes', story: 'sizes' },
    { name: 'Appearances', story: 'appearances' },
    { name: 'WithActions', story: 'with-actions' },
    { name: 'NoIcon', story: 'no-icon' },
  ],
});
