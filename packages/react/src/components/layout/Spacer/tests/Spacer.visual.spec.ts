import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'layout-spacer',
  snapshotPrefix: 'spacer',
  title: 'Spacer',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Vertical', story: 'vertical' },
  ],
});
