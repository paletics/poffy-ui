import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  accessibilityStory: 'default',
  componentId: 'display-avatargroup',
  snapshotPrefix: 'avatar-group',
  title: 'AvatarGroup',
  stories: [
    { name: 'Default', story: 'default' },
    { name: 'AsChild', story: 'as-child' },
    { name: 'WithMax', story: 'with-max' },
    { name: 'WithTotalOverride', story: 'with-total-override' },
  ],
});
