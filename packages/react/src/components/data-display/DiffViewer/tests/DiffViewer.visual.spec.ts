import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'unified',
  componentId: 'display-diffviewer',
  snapshotPrefix: 'diff-viewer',
  title: 'DiffViewer',
  stories: [
    { name: 'Unified', story: 'unified' },
    { name: 'Split', story: 'split' },
  ],
});
