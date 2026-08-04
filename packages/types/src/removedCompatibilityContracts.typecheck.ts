// @ts-expect-error FixedSemanticProps was removed in favor of NativeProps.
import type { FixedSemanticProps } from './index';

declare const removedFixedSemanticProps: FixedSemanticProps<'div'>;
void removedFixedSemanticProps;
