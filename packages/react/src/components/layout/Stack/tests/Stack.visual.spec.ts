import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'layout-stack',
  snapshotPrefix: 'stack',
  title: 'Stack',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Horizontal', story: 'horizontal' },
    { name: 'Polymorphic', story: 'polymorphic' },
    { name: 'Pop', story: 'pop' },
    { name: 'Alignment', story: 'alignment' },
  ],
});
