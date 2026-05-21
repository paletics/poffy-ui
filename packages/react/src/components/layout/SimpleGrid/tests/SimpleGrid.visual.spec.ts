import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'layout-simplegrid',
  snapshotPrefix: 'simple-grid',
  title: 'SimpleGrid',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'GapVariations', story: 'gap-variations' },
    { name: 'Responsive', story: 'responsive' },
    { name: 'MinChildWidth', story: 'min-child-width' },
    { name: 'SemanticList', story: 'semantic-list' },
  ],
});
