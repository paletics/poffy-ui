import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'inputs-datepicker',
  snapshotPrefix: 'date-picker',
  title: 'DatePicker',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Sizes', story: 'standard-sizes' },
    { name: 'Controlled', story: 'controlled' },
  ],
});
