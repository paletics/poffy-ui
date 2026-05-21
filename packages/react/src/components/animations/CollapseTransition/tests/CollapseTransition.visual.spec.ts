import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'animations-collapsetransition',
  snapshotPrefix: 'collapse-transition',
  title: 'CollapseTransition',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'HeightOnly', story: 'height-only' },
    { name: 'ScaleY', story: 'scale-y' },
    { name: 'KeepMounted', story: 'keep-mounted' },
  ],
});
