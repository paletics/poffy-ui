import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'inputs-buttongroup',
  snapshotPrefix: 'button-group',
  title: 'ButtonGroup',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Vertical', story: 'vertical' },
    { name: 'Spacing', story: 'spacing' },
    { name: 'Connected', story: 'connected' },
    { name: 'VerticalConnected', story: 'vertical-connected' },
  ],
});
