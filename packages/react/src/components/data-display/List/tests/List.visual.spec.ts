import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'display-list',
  snapshotPrefix: 'list',
  title: 'List',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'WithIcons', story: 'with-icons' },
    { name: 'AsChild', story: 'as-child' },
    { name: 'Ordered', story: 'ordered' },
  ],
});
