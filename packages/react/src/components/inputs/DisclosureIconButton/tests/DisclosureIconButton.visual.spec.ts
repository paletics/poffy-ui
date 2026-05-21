import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'inputs-disclosureiconbutton',
  snapshotPrefix: 'disclosure-icon-button',
  title: 'DisclosureIconButton',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'States', story: 'states' },
    { name: 'AsChild', story: 'as-child' },
  ],
});
