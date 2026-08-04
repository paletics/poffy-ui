import type { PathDrawPathProps } from '@/components/animations/PathDrawTransition/PathDrawTransition.types';
import type { MotionPrimitiveProps } from './motion';

type HasMotionDriver<T> = 'animate' extends keyof T ? true : false;

/** Compile-time public API regression guards for controlled motion wrappers. */
export const htmlControlledPropsExcludeAnimate: HasMotionDriver<MotionPrimitiveProps> = false;
export const svgControlledPropsExcludeAnimate: HasMotionDriver<PathDrawPathProps> = false;
