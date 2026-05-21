import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'animations-selectiontransition',
  snapshotPrefix: 'selection-transition',
  title: 'SelectionTransition',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Pop', story: 'pop' },
    { name: 'KeepMounted', story: 'keep-mounted' },
  ],
});
