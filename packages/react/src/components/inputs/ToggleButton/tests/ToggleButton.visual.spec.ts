import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'inputs-togglebutton',
  snapshotPrefix: 'toggle-button',
  title: 'ToggleButton',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Sizes', story: 'sizes' },
    { name: 'Variants', story: 'variants' },
    { name: 'Disabled', story: 'disabled' },
    { name: 'Controlled', story: 'controlled' },
  ],
});
