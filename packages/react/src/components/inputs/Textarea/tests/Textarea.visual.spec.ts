import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'inputs-textarea',
  snapshotPrefix: 'textarea',
  title: 'Textarea',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Sizes', story: 'sizes' },
    { name: 'States', story: 'states' },
    { name: 'Variants', story: 'variants' },
  ],
});
