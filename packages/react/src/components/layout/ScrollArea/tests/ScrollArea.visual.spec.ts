import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'layout-scrollarea',
  snapshotPrefix: 'scroll-area',
  title: 'ScrollArea',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Horizontal', story: 'horizontal' },
    { name: 'Both', story: 'both' },
    { name: 'SmallScrollbar', story: 'small-scrollbar' },
    { name: 'LargeScrollbar', story: 'large-scrollbar' },
  ],
});
