import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'inputs-calendar',
  snapshotPrefix: 'calendar',
  title: 'Calendar',
  stories: [{ name: 'Default', story: 'default' }],
});
