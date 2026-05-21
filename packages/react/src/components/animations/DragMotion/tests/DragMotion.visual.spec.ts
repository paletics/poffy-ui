import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'animations-dragmotion',
  snapshotPrefix: 'drag-motion',
  title: 'DragMotion',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Constrained', story: 'constrained' },
    { name: 'AxisLocked', story: 'axis-locked' },
  ],
});
