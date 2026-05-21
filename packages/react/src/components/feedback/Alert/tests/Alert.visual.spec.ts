import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'feedback-alert',
  snapshotPrefix: 'alert',
  title: 'Alert',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Variants', story: 'variants' },
    { name: 'Statuses', story: 'statuses' },
    { name: 'WithClose', story: 'with-close' },
  ],
});
