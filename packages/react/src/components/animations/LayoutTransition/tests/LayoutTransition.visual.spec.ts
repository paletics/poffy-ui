import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'animations-layouttransition',
  snapshotPrefix: 'layout-transition',
  title: 'LayoutTransition',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Reorder', story: 'reorder' },
    { name: 'Accordion', story: 'accordion' },
    { name: 'Switch', story: 'switch' },
    { name: 'Morph', story: 'morph' },
  ],
});
