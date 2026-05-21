import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'inputs-iconbutton',
  snapshotPrefix: 'icon-button',
  title: 'IconButton',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Variants', story: 'variants' },
    { name: 'Disabled', story: 'disabled' },
    { name: 'Loading', story: 'loading' },
    { name: 'Shapes', story: 'shapes' },
  ],
});
