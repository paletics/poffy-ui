import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'animations-revealtransition',
  snapshotPrefix: 'reveal-transition',
  title: 'RevealTransition',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'AsChild', story: 'as-child' },
    { name: 'Gallery', story: 'gallery' },
    { name: 'Thresholds', story: 'thresholds' },
  ],
});
