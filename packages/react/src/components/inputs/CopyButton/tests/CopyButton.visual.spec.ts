import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'inputs-copybutton',
  snapshotPrefix: 'copy-button',
  title: 'CopyButton',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'WithCallback', story: 'with-callback' },
  ],
});
