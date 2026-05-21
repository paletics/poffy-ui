import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'animations-actionmotion',
  snapshotPrefix: 'action-motion',
  title: 'ActionMotion',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'AsChild', story: 'as-child' },
    { name: 'Gallery', story: 'gallery' },
    { name: 'Physical', story: 'physical' },
    { name: 'Bouncy', story: 'bouncy' },
  ],
});
