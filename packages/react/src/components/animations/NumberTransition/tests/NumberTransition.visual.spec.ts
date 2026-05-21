import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'animations-numbertransition',
  snapshotPrefix: 'number-transition',
  title: 'NumberTransition',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Currency', story: 'currency' },
    { name: 'Staggered', story: 'staggered' },
    { name: 'LargeNumber', story: 'large-number' },
  ],
});
