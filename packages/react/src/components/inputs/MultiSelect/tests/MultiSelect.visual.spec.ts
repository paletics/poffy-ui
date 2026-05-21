import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'inputs-multiselect',
  snapshotPrefix: 'multi-select',
  title: 'MultiSelect',
  stories: [{ name: 'Default', story: 'default' }],
});
