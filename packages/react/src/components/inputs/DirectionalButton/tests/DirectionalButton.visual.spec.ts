import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'inputs-directionalbutton',
  snapshotPrefix: 'directional-button',
  title: 'DirectionalButton',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Directions', story: 'directions' },
    { name: 'Group', story: 'group' },
    { name: 'DisabledAsChild', story: 'disabled-as-child' },
  ],
});
