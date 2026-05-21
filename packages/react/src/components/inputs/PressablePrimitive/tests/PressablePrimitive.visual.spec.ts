import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'inputs-pressableprimitive',
  snapshotPrefix: 'pressable-primitive',
  title: 'PressablePrimitive',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'AsChild', story: 'as-child' },
    { name: 'Disabled', story: 'disabled' },
  ],
});
