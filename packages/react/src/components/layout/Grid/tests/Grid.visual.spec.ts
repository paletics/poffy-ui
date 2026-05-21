import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'layout-grid',
  snapshotPrefix: 'grid',
  title: 'Grid',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'SilverRatioLeft', story: 'silver-ratio-left' },
    { name: 'SilverRatioRight', story: 'silver-ratio-right' },
    { name: 'GoldenRatioLeft', story: 'golden-ratio-left' },
    { name: 'GoldenRatioRight', story: 'golden-ratio-right' },
  ],
});
