import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'animations-staggertransition',
  snapshotPrefix: 'stagger-transition',
  title: 'StaggerTransition',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'GridPop', story: 'grid-pop' },
    { name: 'SlideHorizontal', story: 'slide-horizontal' },
  ],
});
