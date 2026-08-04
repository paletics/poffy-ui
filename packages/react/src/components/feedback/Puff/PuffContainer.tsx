'use client';

import { LayoutGroup } from 'motion/react';
import { ViewportPortal } from '@/components/overlay/Portal/Portal';
import { ManagedPuff } from './Puff';
import { PuffContainerProps } from './Puff.types';
import { PuffDisplayContainer } from './PuffDisplayContainer';

export const PuffContainer = ({
  point,
  puffs,
  removePuff,
  finalizePuffRemoval,
  portalContainer,
  ownerDocument,
}: PuffContainerProps) => {
  return (
    <ViewportPortal
      container={portalContainer}
      ownerDocument={ownerDocument}
      scopeProviders
      viewportOwnerName="Puff"
    >
      <PuffDisplayContainer point={point} puffs={puffs}>
        <LayoutGroup>
          {puffs.map(({ puffId, isVisible, ...puff }) => (
            <ManagedPuff
              key={puffId}
              {...puff}
              puffId={puffId}
              isVisible={isVisible}
              removePuff={removePuff}
              onExitComplete={finalizePuffRemoval}
            />
          ))}
        </LayoutGroup>
      </PuffDisplayContainer>
    </ViewportPortal>
  );
};
