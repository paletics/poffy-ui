import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'basic',
  componentId: 'display-reference',
  snapshotPrefix: 'reference',
  title: 'Reference',
  stories: [
    { name: 'Basic', story: 'basic' },
    { name: 'WithDescription', story: 'with-description' },
    { name: 'List', story: 'list' },
  ],
});
