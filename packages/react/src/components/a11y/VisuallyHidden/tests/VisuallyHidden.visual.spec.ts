import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'a11y-visuallyhidden',
  snapshotPrefix: 'visually-hidden',
  title: 'VisuallyHidden',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'WithButton', story: 'with-button' },
    { name: 'AsDiv', story: 'as-div' },
  ],
});
