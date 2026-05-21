import { testVisualStories } from '@/components/e2e/visualSpecUtils';

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
