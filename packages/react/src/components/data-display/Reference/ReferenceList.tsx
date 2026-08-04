import { Slot } from '@radix-ui/react-slot';
import { cx } from '@/styled-system/css';
import { reference } from '@/styled-system/recipes';
import { cloneElement, forwardRef } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { Reference } from './Reference';
import type { ReferenceListComponent, ReferenceListProps } from './Reference.types';
import { isReferenceListAsChildHost } from './Reference.utils';
import { useOptionalLocale } from '@/providers/LocaleProvider';
import { getReferenceMessages } from './Reference.locales';

interface ReferenceListHostProps {
  'aria-label'?: string;
  children?: ReactNode;
}

/**
 * Navigation container for a compact list of references.
 */
const ReferenceListImpl = forwardRef<HTMLElement, ReferenceListProps>(
  (
    {
      asChild,
      references,
      children,
      className,
      locale: localeProp,
      messages: messageOverrides,
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) => {
    const providerLocale = useOptionalLocale()?.locale;
    const messages = getReferenceMessages(localeProp ?? providerLocale, messageOverrides);
    const resolvedAriaLabel = ariaLabel?.trim() || messages.references;
    const classes = reference();
    const canUseAsChild = asChild && isReferenceListAsChildHost(children);
    const Component = canUseAsChild ? Slot : 'nav';
    const generatedReferences = references?.map((item, itemIndex) => {
      const referenceKey = item.id ?? `${item.href ?? 'reference'}-${itemIndex}`;
      const sharedProps = {
        index: item.index ?? itemIndex + 1,
        label: item.label,
        description: item.description,
        locale: localeProp ?? providerLocale,
        messages: messageOverrides,
      };
      return item.href !== undefined ? (
        <Reference
          key={referenceKey}
          {...sharedProps}
          href={item.href}
          external={item.external}
          target={item.target}
          rel={item.rel}
        />
      ) : (
        <Reference key={referenceKey} {...sharedProps} />
      );
    });
    const content = (
      <>
        {generatedReferences}
        {canUseAsChild
          ? (children as ReactElement<ReferenceListHostProps>).props.children
          : children}
      </>
    );
    const slottedChild = canUseAsChild
      ? cloneElement(children as ReactElement<ReferenceListHostProps>, {
          'aria-label': resolvedAriaLabel,
          children: content,
        })
      : null;

    return (
      <Component
        ref={ref}
        className={cx(classes.list, className)}
        aria-label={resolvedAriaLabel}
        {...rest}
      >
        {canUseAsChild ? slottedChild : content}
      </Component>
    );
  },
);

ReferenceListImpl.displayName = 'ReferenceList';

/**
 * Renders generated or composed references in a labelled `nav` region.
 *
 * `references` are emitted first in source order and receive an index starting
 * at one unless an item supplies one. Custom `children` follow them. The
 * region uses a localized “References” label unless overridden; `asChild`
 * delegates only to a native `nav`.
 */

export const ReferenceList = ReferenceListImpl as ReferenceListComponent;
