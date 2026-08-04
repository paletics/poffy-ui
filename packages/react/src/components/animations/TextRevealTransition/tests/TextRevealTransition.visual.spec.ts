import {
  testStoriesDoNotOverflowOnMobile,
  testVisualStories,
} from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'animations-textrevealtransition',
  snapshotPrefix: 'text-reveal-transition',
  title: 'TextRevealTransition',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'AsChild', story: 'as-child' },
    { name: 'Gallery', story: 'gallery' },
    { name: 'Typing', story: 'typing' },
    { name: 'FadeIn', story: 'fade-in' },
  ],
});

testStoriesDoNotOverflowOnMobile({
  componentId: 'animations-textrevealtransition',
  title: 'TextRevealTransition',
  stories: [{ name: 'Typing', story: 'typing' }],
});
