import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'layout-box',
  snapshotPrefix: 'box',
  title: 'Box',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'CustomElement', story: 'custom-element' },
    { name: 'CssOverride', story: 'css-override' },
  ],
});
