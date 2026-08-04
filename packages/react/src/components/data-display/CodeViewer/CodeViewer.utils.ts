import { Children, Fragment, isValidElement, type ReactNode } from 'react';

interface CaptionElementProps {
  children?: ReactNode;
  alt?: string;
  hidden?: boolean;
  'aria-hidden'?: boolean | 'true' | 'false';
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

/** Returns whether a caption can contribute an accessible name without rendering it. */
export const hasAccessibleCaptionContent = (caption: ReactNode): boolean =>
  Children.toArray(caption).some((child) => {
    if (typeof child === 'string') return child.trim().length > 0;
    if (typeof child === 'number') return true;
    if (!isValidElement<CaptionElementProps>(child)) return false;

    if (child.type === Fragment) {
      return hasAccessibleCaptionContent(child.props.children);
    }
    if (typeof child.type === 'string') {
      if (
        child.props.hidden === true ||
        child.props['aria-hidden'] === true ||
        child.props['aria-hidden'] === 'true'
      )
        return false;
      if (child.props['aria-label']?.trim() || child.props['aria-labelledby']?.trim()) return true;
      if (child.type === 'img') return (child.props.alt?.trim().length ?? 0) > 0;
      return hasAccessibleCaptionContent(child.props.children);
    }

    // A custom component's rendered output and prop forwarding are opaque at this boundary.
    // Treat it as unnamed so the focusable region retains its stable fallback label during SSR.
    return false;
  });
