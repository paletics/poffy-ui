import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'animations-listtransition',
  snapshotPrefix: 'list-transition',
  title: 'ListTransition',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'AsChild', story: 'as-child' },
    { name: 'Burst', story: 'burst' },
    { name: 'Lazy', story: 'lazy' },
    { name: 'Mixed', story: 'mixed' },
  ],
});
