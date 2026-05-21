import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'display-stat',
  snapshotPrefix: 'stat',
  title: 'Stat',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'WithIndicators', story: 'with-indicators' },
  ],
});
