'use client';

import { useMergeRefs } from '@poffy-ui/behavior/hooks';
import type { RefObject } from 'react';
import {
  useFormAssociatedEventRef,
  useFormReset,
} from '@/components/inputs/shared/useFormControlBridge';

interface UseFileUploaderFormBridgeOptions {
  filesRef: RefObject<File[]>;
  isEffectivelyDisabledNow: () => boolean;
  name?: string;
  onReset: () => void;
}

export const useFileUploaderFormBridge = ({
  filesRef,
  isEffectivelyDisabledNow,
  name,
  onReset,
}: UseFileUploaderFormBridgeOptions) => {
  const formDataRef = useFormAssociatedEventRef<HTMLFieldSetElement>(
    'formdata',
    name
      ? (event) => {
          if (isEffectivelyDisabledNow()) return;
          const formData = (event as Event & { formData: FormData }).formData;
          filesRef.current?.forEach((file) => formData.append(name, file, file.name));
        }
      : undefined,
  );
  const resetRef = useFormReset<HTMLFieldSetElement>(onReset);

  return useMergeRefs(formDataRef, resetRef);
};
