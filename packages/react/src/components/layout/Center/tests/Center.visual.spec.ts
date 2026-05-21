import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'layout-center',
  snapshotPrefix: 'center',
  title: 'Center',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'AsChild', story: 'as-child' },
    { name: 'WithIcon', story: 'with-icon' },
    { name: 'LoadingSpinner', story: 'loading-spinner' },
    { name: 'EmptyState', story: 'empty-state' },
  ],
});
