import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'display-card',
  snapshotPrefix: 'card',
  title: 'Card',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Variants', story: 'variants' },
    { name: 'Appearances', story: 'appearances' },
  ],
});
