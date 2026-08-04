import { useEffect, useLayoutEffect, useState } from 'react';
import type { RefObject } from 'react';

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Mirrors disabled-fieldset participation from a native form control to a custom
 * interactive surface. The native control remains the source of truth.
 */
export const useNativeFieldsetDisabled = <TControl extends HTMLElement>(
  controlRef: RefObject<TControl | null>,
): boolean => {
  const [isFieldsetDisabled, setIsFieldsetDisabled] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const control = controlRef.current;
    if (!control) return undefined;
    const observedControl = control;

    const update = () => {
      const disabledByFieldset =
        observedControl.matches(':disabled') && !observedControl.hasAttribute('disabled');
      setIsFieldsetDisabled((current) =>
        current === disabledByFieldset ? current : disabledByFieldset,
      );
    };
    update();

    const MutationObserverConstructor = observedControl.ownerDocument.defaultView?.MutationObserver;
    if (!MutationObserverConstructor) return undefined;
    const observer = new MutationObserverConstructor(() => {
      update();
      observeCurrentTopology();
    });
    function observeCurrentTopology() {
      observer.disconnect();
      observer.observe(observedControl, {
        attributes: true,
        attributeFilter: ['disabled'],
      });
      let ancestor = observedControl.parentElement;
      while (ancestor) {
        observer.observe(ancestor, {
          childList: true,
          ...(ancestor.tagName === 'FIELDSET'
            ? {
                attributes: true,
                attributeFilter: ['disabled'],
              }
            : {}),
        });
        ancestor = ancestor.parentElement;
      }
    }
    observeCurrentTopology();
    return () => observer.disconnect();
  }, [controlRef]);

  return isFieldsetDisabled;
};
