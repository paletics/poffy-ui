import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'inputs-formcontrol',
  snapshotPrefix: 'form-control',
  title: 'FormControl',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Disabled', story: 'disabled' },
    { name: 'Required', story: 'required' },
    { name: 'Invalid', story: 'invalid' },
  ],
});
