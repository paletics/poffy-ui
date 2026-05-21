import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'inputs-splitbutton',
  snapshotPrefix: 'split-button',
  title: 'SplitButton',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Sizes', story: 'sizes' },
    { name: 'Variants', story: 'variants' },
    { name: 'Disabled', story: 'disabled' },
  ],
});
