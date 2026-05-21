import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'navigation-breadcrumbs',
  snapshotPrefix: 'breadcrumbs',
  title: 'Breadcrumbs',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'Custom Separator', story: 'custom-separator' },
    { name: 'Background Variant', story: 'background-variant' },
  ],
});
