import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ContentTransition } from './ContentTransition/ContentTransition';
import { ActionMotion } from './ActionMotion/ActionMotion';
import { CollapseTransition } from './CollapseTransition/CollapseTransition';
import { OverlayTransition } from './OverlayTransition/OverlayTransition';
import { PathDrawTransition } from './PathDrawTransition/PathDrawTransition';
import { RevealTransition } from './RevealTransition/RevealTransition';
import { ReorderTransition } from './ReorderTransition/ReorderTransition';
import { ListTransition } from './ListTransition/ListTransition';
import { LayoutTransition } from './LayoutTransition/LayoutTransition';
import { StaggerTransition } from './StaggerTransition/StaggerTransition';
import { SelectionTransition } from './SelectionTransition/SelectionTransition';
import { TextRevealTransition } from './TextRevealTransition/TextRevealTransition';

describe('animation SSR output', () => {
  it('keeps initially rendered content visible without motion-only initial styles', () => {
    const markup = renderToStaticMarkup(
      <>
        <ContentTransition transitionKey="content">Content</ContentTransition>
        <ActionMotion customData={{ staggerChildren: 1 }}>Action</ActionMotion>
        <CollapseTransition isOpen>Collapse</CollapseTransition>
        <OverlayTransition isVisible>Overlay</OverlayTransition>
        <RevealTransition>Reveal</RevealTransition>
        <TextRevealTransition>Headline</TextRevealTransition>
        <StaggerTransition>
          <StaggerTransition.Item>Stagger item</StaggerTransition.Item>
        </StaggerTransition>
        <ReorderTransition>
          <ReorderTransition.Item>Reorder item</ReorderTransition.Item>
        </ReorderTransition>
        <ListTransition>
          <ListTransition.Item>List item</ListTransition.Item>
        </ListTransition>
        <LayoutTransition>Layout item</LayoutTransition>
        <SelectionTransition isSelected>Selection</SelectionTransition>
        <PathDrawTransition viewBox="0 0 24 24">
          <PathDrawTransition.Path d="M4 12l5 5 11-11" />
        </PathDrawTransition>
      </>,
    );

    expect(markup).toContain('Content');
    expect(markup).toContain('Action');
    expect(markup).toContain('Collapse');
    expect(markup).toContain('Overlay');
    expect(markup).toContain('Reveal');
    expect(markup).toContain('Headline');
    expect(markup).toContain('Stagger item');
    expect(markup).toContain('Reorder item');
    expect(markup).toContain('List item');
    expect(markup).toContain('Layout item');
    expect(markup).toContain('Selection');
    expect(markup).toContain('M4 12l5 5 11-11');
    expect(markup).not.toContain('opacity:0');
    expect(markup).not.toContain('pathLength:0');
  });
});
