import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'overlay-listboxpopover',
  snapshotPrefix: 'listbox-popover',
  title: 'ListboxPopover',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Closed', story: 'closed' },
  ],
});
