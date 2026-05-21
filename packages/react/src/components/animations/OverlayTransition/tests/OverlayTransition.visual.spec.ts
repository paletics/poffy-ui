import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'animations-overlaytransition',
  snapshotPrefix: 'overlay-transition',
  title: 'OverlayTransition',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'AsChild', story: 'as-child' },
    { name: 'Gallery', story: 'gallery' },
    { name: 'Popover', story: 'popover' },
    { name: 'Zoom', story: 'zoom' },
  ],
});
