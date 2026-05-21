import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'inputs-datetimepicker',
  snapshotPrefix: 'date-time-picker',
  title: 'DateTimePicker',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Controlled', story: 'controlled' },
  ],
});
