import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'feedback-skeleton',
  snapshotPrefix: 'skeleton',
  title: 'Skeleton',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Circle', story: 'circle' },
    { name: 'RectNoAnimation', story: 'rect-no-animation' },
    { name: 'ArticleLoading', story: 'article-loading' },
    { name: 'LegacyVariants', story: 'legacy-variants' },
  ],
});
