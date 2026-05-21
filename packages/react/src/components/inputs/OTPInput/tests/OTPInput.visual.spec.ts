import { testVisualStories } from '@/components/e2e/visualSpecUtils';

testVisualStories({
  componentId: 'inputs-otpinput',
  snapshotPrefix: 'otp-input',
  title: 'OTPInput',
  stories: [{ name: 'Default', story: 'default' }],
});
