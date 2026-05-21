import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'layout-aspectratio',
  snapshotPrefix: 'aspect-ratio',
  title: 'AspectRatio',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Video4x3', story: 'video-4-x-3' },
    { name: 'UltraWide21x9', story: 'ultra-wide-21-x-9' },
    { name: 'Square1x1', story: 'square-1-x-1' },
    { name: 'ImageCover', story: 'image-cover' },
  ],
});
