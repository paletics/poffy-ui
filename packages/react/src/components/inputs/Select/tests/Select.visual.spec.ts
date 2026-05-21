import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'inputs-select',
  snapshotPrefix: 'select',
  title: 'Select',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Sizes', story: 'sizes' },
    { name: 'Variants', story: 'variants' },
    { name: 'States', story: 'states' },
  ],
});
