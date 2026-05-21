import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'inputs-button',
  snapshotPrefix: 'button',
  title: 'Button',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Polymorphic', story: 'polymorphic' },
    { name: 'Disabled', story: 'disabled' },
  ],
});
