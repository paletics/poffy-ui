import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'inputs-switch',
  snapshotPrefix: 'switch',
  title: 'Switch',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Sizes', story: 'sizes' },
    { name: 'States', story: 'states' },
    { name: 'Controlled', story: 'controlled' },
  ],
});
