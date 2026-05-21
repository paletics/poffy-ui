import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'inputs-checkbox',
  snapshotPrefix: 'checkbox',
  title: 'Checkbox',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Sizes', story: 'sizes' },
    { name: 'States', story: 'states' },
    { name: 'Controlled', story: 'controlled' },
  ],
});
