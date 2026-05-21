import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'inputs-wheelpicker',
  snapshotPrefix: 'wheel-picker',
  title: 'WheelPicker',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Sizes', story: 'sizes' },
    { name: 'Controlled', story: 'controlled' },
  ],
});
