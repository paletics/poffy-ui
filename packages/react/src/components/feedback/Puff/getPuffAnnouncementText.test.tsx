import { describe, expect, it } from 'vitest';
import { getPuffAnnouncementText } from './getPuffAnnouncementText';

/**
 * ### Test Strategy: getPuffAnnouncementText
 * - **Focus**: Explicit announcements, safe static title/body extraction, and opaque component
 *   exclusion.
 * - **DON'T**: Do not invoke consumer components or include visual action content.
 */
describe('getPuffAnnouncementText', () => {
  it('prefers and normalizes an explicit announcement', () => {
    expect(
      getPuffAnnouncementText({
        announcement: '  Saved\n successfully ',
        title: 'Ignored',
        children: 'Ignored',
      }),
    ).toBe('Saved successfully');
  });

  it('combines text from static title and body markup', () => {
    expect(
      getPuffAnnouncementText({
        title: <strong>Saved</strong>,
        children: (
          <>
            Project <span>Alpha</span>
          </>
        ),
      }),
    ).toBe('Saved Project Alpha');
  });

  it('does not render or infer text from opaque components', () => {
    const CustomContent = () => <span>Secret implementation text</span>;
    expect(getPuffAnnouncementText({ children: <CustomContent /> })).toBeUndefined();
  });

  it('excludes hidden, inert, and interactive visual content', () => {
    expect(
      getPuffAnnouncementText({
        children: (
          <>
            <span aria-hidden>Decorative check</span>
            Saved
            <span inert>Inactive detail</span>
            <button>Undo</button>
          </>
        ),
      }),
    ).toBe('Saved');
  });
});
