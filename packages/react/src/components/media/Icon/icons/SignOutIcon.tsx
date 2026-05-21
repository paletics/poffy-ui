import { forwardRef } from 'react';
import { Icon } from '../Icon';
import type { IconProps } from '../Icon.types';

/**
 * SignOutIcon
 * Icon component for SignOut.
 */
export const SignOutIcon = forwardRef<SVGSVGElement, Omit<IconProps, 'variant'>>((props, ref) => (
  <Icon {...props} ref={ref} viewBox="0 0 16.649 20" variant="filled">
    <path d="M4.43 19.979.191 18.333A.3.3 0 0 1 0 18.054V2.276c0-.116.067-.222.173-.271L4.412.028a.299.299 0 0 1 .425.271v19.402a.3.3 0 0 1-.407.279Z" />
    <rect width="4.652" height="1.38" x="8.994" y="9.31" rx=".292" ry=".292" />
    <path d="m16.55 9.773-.003-.003-.383-.383-2.543-2.543a.309.309 0 0 0-.436 0l-.486.486a.309.309 0 0 0 0 .436l2.244 2.244-2.213 2.213a.341.341 0 0 0 0 .482l.441.441a.341.341 0 0 0 .482 0l2.431-2.431.463-.463.003-.003a.336.336 0 0 0 0-.476ZM12.099 11.65h-.275a.116.116 0 0 0-.116.116v5.588c0 .12-.097.217-.217.217H5.89a.116.116 0 0 0-.116.116v.281c0 .064.052.116.116.116h6.04a.286.286 0 0 0 .286-.286v-6.034a.116.116 0 0 0-.116-.116ZM12.099 8.35h-.275a.116.116 0 0 1-.116-.116V2.645a.217.217 0 0 0-.217-.217H5.89a.116.116 0 0 1-.116-.116v-.281c0-.064.052-.116.116-.116h6.04c.158 0 .286.128.286.286v6.034a.116.116 0 0 1-.116.116Z" />
  </Icon>
));

SignOutIcon.displayName = 'SignOutIcon';
