import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'animations-pathdrawtransition',
  snapshotPrefix: 'path-draw-transition',
  title: 'PathDrawTransition',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Gallery', story: 'gallery' },
    { name: 'Toggle', story: 'toggle' },
  ],
});
