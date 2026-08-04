import {
  testStoriesDoNotOverflowOnMobile,
  testVisualStories,
} from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'feedback-result',
  snapshotPrefix: 'result',
  title: 'Result',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Error', story: 'error' },
    { name: 'Warning', story: 'warning' },
    { name: 'Info', story: 'info' },
    { name: 'ConstrainedLongContent', story: 'constrained-long-content' },
  ],
});

testStoriesDoNotOverflowOnMobile({
  componentId: 'feedback-result',
  title: 'Result',
  stories: [{ name: 'ConstrainedLongContent', story: 'constrained-long-content' }],
});
