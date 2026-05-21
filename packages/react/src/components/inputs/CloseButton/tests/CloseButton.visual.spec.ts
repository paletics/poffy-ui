import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'inputs-closebutton',
  snapshotPrefix: 'close-button',
  title: 'CloseButton',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Sizes', story: 'sizes' },
    { name: 'Appearances', story: 'appearances' },
    { name: 'Disabled', story: 'disabled' },
    { name: 'Shapes', story: 'shapes' },
  ],
});
