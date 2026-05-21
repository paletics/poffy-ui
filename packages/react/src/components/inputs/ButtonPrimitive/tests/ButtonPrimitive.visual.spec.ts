import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'inputs-buttonprimitive',
  snapshotPrefix: 'button-primitive',
  title: 'ButtonPrimitive',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'AsChild', story: 'as-child' },
    { name: 'Disabled', story: 'disabled' },
  ],
});
