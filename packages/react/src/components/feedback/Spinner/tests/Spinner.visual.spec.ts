import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'feedback-spinner',
  snapshotPrefix: 'spinner',
  title: 'Spinner',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Sizes', story: 'sizes' },
    { name: 'Intents', story: 'intents' },
    { name: 'CSSAnimations', story: 'css-animations' },
  ],
});
