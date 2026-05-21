import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'animations-iconswaptransition',
  snapshotPrefix: 'icon-swap-transition',
  title: 'IconSwapTransition',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Gallery', story: 'gallery' },
    { name: 'Rotate', story: 'rotate' },
  ],
});
