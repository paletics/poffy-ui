import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'layout-container',
  snapshotPrefix: 'container',
  title: 'Container',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'AsChild', story: 'as-child' },
    { name: 'WithContent', story: 'with-content' },
    { name: 'ArticleLayout', story: 'article-layout' },
    { name: 'ResponsivePadding', story: 'responsive-padding' },
  ],
});
