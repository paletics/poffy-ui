import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'inputs-listboxselect',
  snapshotPrefix: 'listbox-select',
  title: 'ListboxSelect',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Sizes', story: 'sizes' },
    { name: 'States', story: 'states' },
    { name: 'Variants', story: 'variants' },
    { name: 'Placeholder', story: 'placeholder' },
  ],
});
