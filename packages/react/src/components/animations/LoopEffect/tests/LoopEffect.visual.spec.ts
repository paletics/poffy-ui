import {
  testStoriesDoNotOverflowOnMobile,
  testVisualStories,
} from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'animations-loopeffect',
  snapshotPrefix: 'loop-effect',
  title: 'LoopEffect',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'AsChild', story: 'as-child' },
    { name: 'Gallery', story: 'gallery' },
    { name: 'Pulse', story: 'pulse' },
    { name: 'Spin', story: 'spin' },
  ],
});

testStoriesDoNotOverflowOnMobile({
  componentId: 'animations-loopeffect',
  title: 'LoopEffect',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Playground', story: 'playground' },
    { name: 'Pulse', story: 'pulse' },
    { name: 'Spin', story: 'spin' },
    { name: 'Shake', story: 'shake' },
    { name: 'Bounce', story: 'bounce' },
    { name: 'None', story: 'none' },
    { name: 'Gallery', story: 'gallery' },
    { name: 'AsChild', story: 'as-child' },
  ],
});
