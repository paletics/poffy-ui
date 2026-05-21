import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'media-image',
  snapshotPrefix: 'image',
  title: 'Image',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'WithFallbackUrl', story: 'with-fallback-url' },
    { name: 'WithFallbackElement', story: 'with-fallback-element' },
    { name: 'AspectRatioVideo', story: 'aspect-ratio-video' },
    { name: 'Circular', story: 'circular' },
  ],
});
