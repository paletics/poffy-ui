import { Fragment, isValidElement } from 'react';
import type { ReactElement, ReactNode } from 'react';

interface LinkHostProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  children?: ReactNode;
  href?: string;
  rel?: string;
  target?: string;
  title?: string;
}

export const isLinkAsChildHost = (children: ReactNode): children is ReactElement<LinkHostProps> =>
  isValidElement<LinkHostProps>(children) &&
  children.type !== Fragment &&
  (typeof children.type !== 'string' ? true : children.type === 'a');

export const getLinkFallbackChildren = (children: ReactNode): ReactNode =>
  isValidElement<LinkHostProps>(children) ? children.props.children : children;

export const getLinkFallbackAttributes = (children: ReactNode) => {
  if (!isValidElement<LinkHostProps>(children)) return {};

  const { 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, title } = children.props;
  return {
    ...(ariaLabel !== undefined ? { 'aria-label': ariaLabel } : {}),
    ...(ariaLabelledBy !== undefined ? { 'aria-labelledby': ariaLabelledBy } : {}),
    ...(title !== undefined ? { title } : {}),
  };
};
