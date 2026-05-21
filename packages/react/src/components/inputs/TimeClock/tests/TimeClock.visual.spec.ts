import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'inputs-timeclock',
  snapshotPrefix: 'time-clock',
  title: 'TimeClock',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Sizes', story: 'sizes' },
    { name: 'Controlled', story: 'controlled' },
    { name: 'TwelveHour', story: 'twelve-hour' },
    { name: 'SteppedMinutes', story: 'stepped-minutes' },
  ],
});
