import type { OTPInputMessages } from './OTPInput.types';

const ENGLISH_OTP_INPUT_MESSAGES: OTPInputMessages = {
  digit: (index, length) => `Digit ${index} of ${length}`,
};

const OTP_INPUT_MESSAGES: Record<string, OTPInputMessages> = {
  en: ENGLISH_OTP_INPUT_MESSAGES,
  ja: {
    digit: (index, length) => `${length}桁中の${index}桁目`,
  },
};

export const getOTPInputMessages = (
  locale = 'en-US',
  overrides?: Partial<OTPInputMessages>,
): OTPInputMessages => ({
  ...(OTP_INPUT_MESSAGES[locale.toLowerCase()] ??
    OTP_INPUT_MESSAGES[locale.toLowerCase().split('-')[0]] ??
    ENGLISH_OTP_INPUT_MESSAGES),
  ...overrides,
});
