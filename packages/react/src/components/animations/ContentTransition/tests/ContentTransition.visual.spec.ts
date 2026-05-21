import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'animations-contenttransition',
  snapshotPrefix: 'content-transition',
  title: 'ContentTransition',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'TrueCrossfade', story: 'true-crossfade' },
    { name: 'Flip3D', story: 'flip-3-d' },
    { name: 'Morph', story: 'morph' },
  ],
});
