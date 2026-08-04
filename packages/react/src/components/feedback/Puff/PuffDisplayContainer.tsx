'use client';

import { css } from '@/styled-system/css';
import { puff } from '@/styled-system/recipes';
import { useEffect, useRef, useState } from 'react';
import { PuffDisplayContainerProps } from './Puff.types';
import { getPuffAnnouncementText } from './getPuffAnnouncementText';

export const PuffDisplayContainer = ({
  children,
  puffs = [],
  point = 'top-right',
}: PuffDisplayContainerProps) => {
  const classes = puff({ point });
  const [canAnnounce, setCanAnnounce] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ownerWindow = containerRef.current?.ownerDocument.defaultView;
    const timer = ownerWindow
      ? ownerWindow.setTimeout(() => setCanAnnounce(true), 0)
      : setTimeout(() => setCanAnnounce(true), 0);
    return () => {
      if (ownerWindow) ownerWindow.clearTimeout(timer);
      else clearTimeout(timer);
    };
  }, []);

  const getAnnouncements = (live: 'polite' | 'assertive') =>
    puffs.flatMap((item) => {
      if (!canAnnounce || !item.isVisible || (item.live ?? 'polite') !== live) return [];
      const text = getPuffAnnouncementText(item);
      return text ? [{ id: item.puffId, text }] : [];
    });

  return (
    <div ref={containerRef} className={classes.container}>
      {(['polite', 'assertive'] as const).map((live) => (
        <div
          key={live}
          className={css({ srOnly: true })}
          aria-live={live}
          aria-relevant="additions text"
          aria-atomic="false"
          data-puff-announcer={live}
        >
          {getAnnouncements(live).map(({ id, text }) => (
            <div key={id}>{text}</div>
          ))}
        </div>
      ))}
      <div className={classes.viewport}>{children}</div>
    </div>
  );
};
