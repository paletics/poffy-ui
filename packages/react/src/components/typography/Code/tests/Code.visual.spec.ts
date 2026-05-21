import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'display-code',
  snapshotPrefix: 'code',
  title: 'Code',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Block', story: 'block' },
    { name: 'InlineExamples', story: 'inline-examples' },
    {
      name: 'BlockExamples',
      screenshotOptions: { maxDiffPixelRatio: 0.03 },
      story: 'block-examples',
    },
    { name: 'MultiLine', story: 'multi-line' },
  ],
});
