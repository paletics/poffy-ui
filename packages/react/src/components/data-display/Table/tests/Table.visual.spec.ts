import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'display-table',
  snapshotPrefix: 'table',
  title: 'Table',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Striped', story: 'striped' },
    { name: 'Outline', story: 'outline' },
    { name: 'StripedVertical', story: 'striped-vertical' },
    { name: 'Borderless', story: 'borderless' },
  ],
});
