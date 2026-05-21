'use client';

import { LayoutGroup } from 'motion/react';
import { createPortal } from 'react-dom';
import { Puff } from './Puff';
import { PuffContainerProps } from './Puff.types';
import { PuffDisplayContainer } from './PuffDisplayContainer';

/**
 * ### AI Context & Architecture
 * Container component that manages the rendering of puff notifications using portals.
 * It maps over the list of active puffs and renders them within a PuffDisplayContainer.
 * Use AnimatePresence to handle exit animations.
 */
export const PuffContainer = ({
  point,
  puffs,
  removePuff,
  finalizePuffRemoval,
}: PuffContainerProps) => {
  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <PuffDisplayContainer point={point}>
      <LayoutGroup>
        {puffs.map((puff) => (
          <Puff
            key={puff.id}
            {...puff}
            removePuff={removePuff}
            onExitComplete={finalizePuffRemoval}
          />
        ))}
      </LayoutGroup>
    </PuffDisplayContainer>,
    document.body,
  );
};
