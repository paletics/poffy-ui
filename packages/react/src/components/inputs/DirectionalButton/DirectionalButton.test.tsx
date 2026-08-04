import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { createElement, createRef, forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ComponentType, FormEvent, ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { DirectionalButton } from './DirectionalButton';
import { DirectionalButtonGroup } from './DirectionalButtonGroup';
import { LocaleProvider } from '@/providers/LocaleProvider';

const RuntimeDirectionalButton = DirectionalButton as unknown as ComponentType<
  Record<string, unknown> & { children?: ReactNode }
>;

const CustomLink = forwardRef<HTMLAnchorElement, ComponentPropsWithoutRef<'a'>>(function CustomLink(
  { children, ...props },
  ref,
) {
  return (
    <a ref={ref} {...props}>
      {children}
    </a>
  );
});
const CustomButton = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<'button'>>(
  function CustomButton(props, ref) {
    return <button ref={ref} {...props} />;
  },
);
const DecorativeIcon = () => <svg aria-hidden="true" />;

describe('DirectionalButton', () => {
  it('renders a standalone directional button', () => {
    render(<DirectionalButton direction="left" aria-label="Previous" />);
    expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument();
  });

  it('provides a direction-based fallback accessible label', () => {
    render(<DirectionalButton direction="left" />);
    expect(screen.getByRole('button', { name: 'Move left' })).toBeInTheDocument();
  });

  it('localizes the fallback accessible label and preserves an explicit label', () => {
    render(
      <LocaleProvider defaultLocale="ja-JP" global={false}>
        <DirectionalButton direction="up" />
        <DirectionalButton direction="down" />
        <DirectionalButton direction="left" />
        <DirectionalButton direction="right" aria-label="次の月" />
      </LocaleProvider>,
    );

    expect(screen.getByRole('button', { name: '上へ移動' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '下へ移動' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '左へ移動' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '次の月' })).toBeInTheDocument();
  });

  it('retains children for a native button', () => {
    render(<DirectionalButton aria-label="Next">Next item</DirectionalButton>);
    expect(screen.getByRole('button', { name: 'Next' })).toHaveTextContent('Next item');
  });

  it('uses explicit, host, visible, then localized fallback accessible names', () => {
    render(
      <>
        <DirectionalButton aria-label="Explicit name">Visible name</DirectionalButton>
        <DirectionalButton>
          <span>Visible child name</span>
        </DirectionalButton>
        <DirectionalButton asChild>
          <a href="/next" aria-label="Host name">
            Ignored host text
          </a>
        </DirectionalButton>
        <DirectionalButton direction="left" />
      </>,
    );

    expect(screen.getByRole('button', { name: 'Explicit name' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Visible child name' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Host name' })).toHaveAttribute('href', '/next');
    expect(screen.getByRole('button', { name: 'Move left' })).toBeInTheDocument();
  });

  it('reuses nested one-shot iterable children for naming and rendering', () => {
    function* label() {
      yield 'Generated next item';
    }

    render(
      <DirectionalButton>
        <span>{label()}</span>
      </DirectionalButton>,
    );

    expect(screen.getByRole('button', { name: 'Generated next item' })).toHaveTextContent(
      'Generated next item',
    );
  });

  it('falls back to the localized name when children have no accessible content', () => {
    render(<DirectionalButton direction="down"> </DirectionalButton>);

    expect(screen.getByRole('button', { name: 'Move down' })).toBeInTheDocument();
  });

  it('does not infer accessible content through an opaque custom component', () => {
    const OpaqueLabel = (_props: { children?: ReactNode }) => null;

    render(
      <DirectionalButton direction="left">
        <OpaqueLabel>Suppressed label</OpaqueLabel>
      </DirectionalButton>,
    );

    expect(screen.getByRole('button', { name: 'Move left' })).toBeInTheDocument();
  });

  it('uses the localized fallback name for an opaque decorative component', () => {
    render(
      <DirectionalButton direction="down">
        <DecorativeIcon />
      </DirectionalButton>,
    );

    expect(screen.getByRole('button', { name: 'Move down' })).toBeInTheDocument();
  });

  it('preserves active capture handlers', () => {
    const onClickCapture = vi.fn();
    const onPointerDownCapture = vi.fn();
    const onKeyDownCapture = vi.fn();
    render(
      <DirectionalButton
        aria-label="Next"
        onClickCapture={onClickCapture}
        onPointerDownCapture={onPointerDownCapture}
        onKeyDownCapture={onKeyDownCapture}
      />,
    );

    const button = screen.getByRole('button', { name: 'Next' });
    fireEvent.click(button);
    fireEvent.pointerDown(button);
    fireEvent.keyDown(button, { key: 'Enter' });

    expect(onClickCapture).toHaveBeenCalledTimes(1);
    expect(onPointerDownCapture).toHaveBeenCalledTimes(1);
    expect(onKeyDownCapture).toHaveBeenCalledTimes(1);
  });

  it('never submits an owning form when callers provide a conflicting type', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: FormEvent) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <DirectionalButton type="submit" aria-label="Next" />
      </form>,
    );

    const button = screen.getByRole('button', { name: 'Next' });
    expect(button).toHaveAttribute('type', 'button');
    await user.click(button);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('supports asChild without leaking native disabled to non-button elements', () => {
    render(
      <DirectionalButton asChild direction="right" aria-label="Next page" disabled>
        <a href="/next">Next</a>
      </DirectionalButton>,
    );

    const link = screen.getByRole('link', { name: 'Next page' });
    expect(link).not.toHaveAttribute('disabled');
    expect(link).toHaveAttribute('aria-disabled', 'true');
  });

  it('does not emit a list-key warning while composing slotted content', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    try {
      render(
        <>
          <DirectionalButton asChild direction="right" aria-label="Next page link">
            <a href="/next">Next</a>
          </DirectionalButton>
          <DirectionalButton asChild direction="right" aria-label="Next page button">
            <button>Next</button>
          </DirectionalButton>
          <DirectionalButton asChild direction="right" aria-label="Next page custom">
            <div>Next</div>
          </DirectionalButton>
        </>,
      );

      expect(screen.getByRole('link', { name: 'Next page link' })).toHaveAttribute('href', '/next');
      expect(screen.getByRole('button', { name: 'Next page button' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Next page custom' })).toBeInTheDocument();
      expect(consoleError.mock.calls.flat().join(' ')).not.toContain(
        'Each child in a list should have a unique "key" prop',
      );
    } finally {
      consoleError.mockRestore();
    }
  });

  it('does not delegate wrapper-owned native button attributes at runtime', () => {
    render(
      <RuntimeDirectionalButton
        asChild
        aria-label="Next page"
        form="settings"
        formAction="/save"
        formEncType="multipart/form-data"
        formMethod="post"
        formNoValidate
        formTarget="_blank"
        name="action"
        type="submit"
        value="save"
      >
        <a href="/next">Next</a>
      </RuntimeDirectionalButton>,
    );

    const link = screen.getByRole('link', { name: 'Next page' });
    for (const attribute of [
      'form',
      'formaction',
      'formenctype',
      'formmethod',
      'formnovalidate',
      'formtarget',
      'name',
      'type',
      'value',
    ]) {
      expect(link).not.toHaveAttribute(attribute);
    }
  });

  it('blocks asChild click and keyboard activation when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onChildClick = vi.fn();
    render(
      <DirectionalButton
        asChild
        direction="right"
        aria-label="Next page"
        disabled
        onClick={onClick}
      >
        <a href="/next" onClick={onChildClick}>
          Next
        </a>
      </DirectionalButton>,
    );

    const link = screen.getByRole('link', { name: 'Next page' });
    await user.click(link);
    expect(onClick).not.toHaveBeenCalled();
    expect(onChildClick).not.toHaveBeenCalled();

    link.focus();
    await user.keyboard('{Enter}');
    expect(onClick).not.toHaveBeenCalled();
    expect(onChildClick).not.toHaveBeenCalled();
  });

  it('preserves child and component non-activation keys once when disabled asChild', () => {
    const onChildKeyDown = vi.fn();
    const onDirectionalButtonKeyDown = vi.fn();
    render(
      <DirectionalButton
        asChild
        direction="right"
        aria-label="Next page"
        disabled
        onKeyDown={onDirectionalButtonKeyDown}
      >
        <a href="/next" onKeyDown={onChildKeyDown}>
          Next
        </a>
      </DirectionalButton>,
    );

    fireEvent.keyDown(screen.getByRole('link', { name: 'Next page' }), { key: 'Tab' });

    expect(onChildKeyDown).toHaveBeenCalledTimes(1);
    expect(onDirectionalButtonKeyDown).toHaveBeenCalledTimes(1);
  });

  it('blocks disabled slotted child capture handlers and owns slotted ARIA state', () => {
    const onChildClickCapture = vi.fn();
    const onChildPointerUpCapture = vi.fn();
    const onChildKeyUpCapture = vi.fn();
    render(
      <DirectionalButton asChild direction="right" aria-label="Next page" disabled>
        <a
          href="/next"
          aria-disabled="false"
          aria-label="Conflicting label"
          onClickCapture={onChildClickCapture}
          onPointerUpCapture={onChildPointerUpCapture}
          onKeyUpCapture={onChildKeyUpCapture}
        >
          Next
        </a>
      </DirectionalButton>,
    );

    const link = screen.getByRole('link', { name: 'Next page' });
    fireEvent.click(link);
    fireEvent.pointerUp(link);
    fireEvent.keyUp(link, { key: 'Enter' });

    expect(link).toHaveAttribute('aria-disabled', 'true');
    expect(onChildClickCapture).not.toHaveBeenCalled();
    expect(onChildPointerUpCapture).not.toHaveBeenCalled();
    expect(onChildKeyUpCapture).not.toHaveBeenCalled();
  });

  it('blocks disabled slotted auxiliary activation before child handlers run', () => {
    const onChildAuxClick = vi.fn();
    const onDirectionalButtonAuxClick = vi.fn();
    render(
      <DirectionalButton
        asChild
        direction="right"
        aria-label="Next page"
        disabled
        onAuxClick={onDirectionalButtonAuxClick}
      >
        <a href="/next" onAuxClick={onChildAuxClick}>
          Next
        </a>
      </DirectionalButton>,
    );

    const link = screen.getByRole('link', { name: 'Next page' });
    expect(
      link.dispatchEvent(
        new MouseEvent('auxclick', { bubbles: true, button: 1, cancelable: true }),
      ),
    ).toBe(false);
    expect(onChildAuxClick).not.toHaveBeenCalled();
    expect(onDirectionalButtonAuxClick).not.toHaveBeenCalled();
  });

  it('owns native button disabled and type semantics for asChild', () => {
    render(
      <DirectionalButton asChild direction="right" aria-label="Next page" disabled>
        <button type="submit">Next</button>
      </DirectionalButton>,
    );

    const button = screen.getByRole('button', { name: 'Next page' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('type', 'button');
  });

  it('forwards native button safeguards to a custom asChild button host', () => {
    const onSubmit = vi.fn((event: FormEvent) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <DirectionalButton asChild direction="right" aria-label="Next page" disabled>
          <CustomButton>Next</CustomButton>
        </DirectionalButton>
      </form>,
    );

    const button = screen.getByRole('button', { name: 'Next page' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('type', 'button');
    fireEvent.click(button);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('gives a non-native asChild host button semantics and keyboard activation', () => {
    const onClick = vi.fn();
    render(
      <DirectionalButton asChild direction="right" aria-label="Next page" onClick={onClick}>
        <div>Next</div>
      </DirectionalButton>,
    );

    const button = screen.getByRole('button', { name: 'Next page' });
    expect(button).toHaveAttribute('tabindex', '0');
    fireEvent.keyDown(button, { key: 'Enter' });
    fireEvent.keyDown(button, { key: ' ', code: 'Space' });
    fireEvent.keyUp(button, { key: ' ', code: 'Space' });
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('preserves activation semantics owned by custom asChild hosts', () => {
    const onLinkClick = vi.fn();
    const onDirectionalLinkClick = vi.fn();
    const onButtonClick = vi.fn();
    const onDirectionalButtonClick = vi.fn();
    render(
      <>
        <DirectionalButton asChild aria-label="Custom link" onClick={onDirectionalLinkClick}>
          <CustomLink href="#custom-link-target" onClick={onLinkClick}>
            Custom link
          </CustomLink>
        </DirectionalButton>
        <DirectionalButton asChild aria-label="Custom button" onClick={onDirectionalButtonClick}>
          <CustomButton onClick={onButtonClick}>Custom button</CustomButton>
        </DirectionalButton>
      </>,
    );

    const link = screen.getByRole('link', { name: 'Custom link' });
    const button = screen.getByRole('button', { name: 'Custom button' });
    expect(link).not.toHaveAttribute('disabled');
    expect(link).not.toHaveAttribute('type');
    expect(link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))).toBe(
      true,
    );
    expect(onLinkClick).toHaveBeenCalledTimes(1);
    expect(onDirectionalLinkClick).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(button, { key: 'Enter' });
    expect(onButtonClick).not.toHaveBeenCalled();
    expect(onDirectionalButtonClick).not.toHaveBeenCalled();
    fireEvent.click(button);
    expect(onButtonClick).toHaveBeenCalledTimes(1);
    expect(onDirectionalButtonClick).toHaveBeenCalledTimes(1);
  });

  it('emulates href-less anchors and falls back for incompatible interactive hosts', () => {
    const onAnchorClick = vi.fn();
    const onSummaryClick = vi.fn();
    const onDirectionalSummaryClick = vi.fn();
    render(
      <>
        <DirectionalButton asChild aria-label="Href-less anchor" onClick={onAnchorClick}>
          {createElement('a', null, 'Href-less anchor')}
        </DirectionalButton>
        <details>
          <DirectionalButton asChild aria-label="Summary" onClick={onDirectionalSummaryClick}>
            <summary onClick={onSummaryClick}>Summary</summary>
          </DirectionalButton>
        </details>
      </>,
    );

    const anchorButton = screen.getByRole('button', { name: 'Href-less anchor' });
    expect(anchorButton).toHaveAttribute('tabindex', '0');
    fireEvent.keyDown(anchorButton, { key: 'Enter' });
    fireEvent.keyDown(anchorButton, { key: ' ', code: 'Space' });
    fireEvent.keyUp(anchorButton, { key: ' ', code: 'Space' });
    expect(onAnchorClick).toHaveBeenCalledTimes(2);

    const summaryFallback = screen.getByRole('button', { name: 'Summary' });
    expect(screen.queryByText('Summary', { selector: 'summary' })).not.toBeInTheDocument();
    fireEvent.click(summaryFallback);
    expect(onSummaryClick).not.toHaveBeenCalled();
    expect(onDirectionalSummaryClick).toHaveBeenCalledTimes(1);
  });

  it('falls back to a native button for void asChild hosts', () => {
    render(
      <DirectionalButton asChild direction="right" aria-label="Next page">
        <img alt="Ignored" />
      </DirectionalButton>,
    );

    expect(screen.getByRole('button', { name: 'Next page' })).toBeInTheDocument();
    expect(screen.queryByRole('img', { name: 'Ignored' })).not.toBeInTheDocument();
  });

  it('renders a connected button group and triggers actions', async () => {
    const user = userEvent.setup();
    const onPrev = vi.fn();
    const onNext = vi.fn();

    render(
      <DirectionalButtonGroup
        startButton={{ direction: 'left', 'aria-label': 'Previous', onClick: onPrev }}
        endButton={{ direction: 'right', 'aria-label': 'Next', onClick: onNext }}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Previous' }));
    await user.click(screen.getByRole('button', { name: 'Next' }));

    expect(onPrev).toHaveBeenCalledTimes(1);
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('provides group semantics and supports an asChild group host', () => {
    const childMouseEnter = vi.fn();
    const groupMouseEnter = vi.fn();
    const ref = createRef<HTMLElement>();
    const { container } = render(
      <DirectionalButtonGroup
        ref={ref}
        asChild
        aria-label="Pagination"
        className="group-class"
        data-testid="pagination-group"
        onMouseEnter={groupMouseEnter}
        startButton={{ direction: 'left', 'aria-label': 'Previous' }}
        endButton={{ direction: 'right', 'aria-label': 'Next' }}
      >
        <section className="host-class" onMouseEnter={childMouseEnter} />
      </DirectionalButtonGroup>,
    );

    const group = screen.getByRole('group', { name: 'Pagination' });
    expect(group.tagName).toBe('SECTION');
    expect(group).toHaveClass('group-class', 'host-class');
    expect(ref.current).toBe(group);
    expect(container.childElementCount).toBe(1);
    fireEvent.mouseEnter(group);
    expect(childMouseEnter).toHaveBeenCalledOnce();
    expect(groupMouseEnter).toHaveBeenCalledOnce();
  });

  it('keeps multiple host children when an asChild group receives its directional buttons', () => {
    render(
      <DirectionalButtonGroup
        asChild
        aria-label="Pagination"
        startButton={{ direction: 'left', 'aria-label': 'Previous' }}
        endButton={{ direction: 'right', 'aria-label': 'Next' }}
      >
        <section>
          <span>First host child</span>
          <span>Second host child</span>
        </section>
      </DirectionalButtonGroup>,
    );

    const group = screen.getByRole('group', { name: 'Pagination' });
    expect(group.tagName).toBe('SECTION');
    expect(screen.getByText('First host child')).toBeInTheDocument();
    expect(screen.getByText('Second host child')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
  });

  it('falls back to a div for interactive asChild group hosts', () => {
    render(
      <DirectionalButtonGroup
        asChild
        aria-label="Pagination"
        startButton={{ direction: 'left', 'aria-label': 'Previous' }}
        endButton={{ direction: 'right', 'aria-label': 'Next' }}
      >
        <a href="/pages">Pagination</a>
      </DirectionalButtonGroup>,
    );

    const group = screen.getByRole('group', { name: 'Pagination' });
    expect(group.tagName).toBe('DIV');
    expect(screen.queryByRole('link', { name: 'Pagination' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
  });

  it('falls back when an otherwise passive group host has interactive attributes', () => {
    const onClick = vi.fn();
    render(
      <DirectionalButtonGroup
        asChild
        aria-label="Pagination"
        startButton={{ direction: 'left', 'aria-label': 'Previous' }}
        endButton={{ direction: 'right', 'aria-label': 'Next' }}
      >
        <section role="button" tabIndex={0} onClick={onClick} onKeyDown={() => undefined}>
          Unsafe group host
        </section>
      </DirectionalButtonGroup>,
    );

    const group = screen.getByRole('group', { name: 'Pagination' });
    expect(group.tagName).toBe('DIV');
    expect(group.querySelector('section')).toBeNull();
    fireEvent.click(screen.getByText('Unsafe group host'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it.each([
    ['img', <img key="img" alt="Artwork" />],
    ['input', <input key="input" aria-label="Nested field" />],
    ['Fragment', <>Fragment content</>],
    ['text', 'Text content'],
    ['multiple children', [<span key="a">First</span>, <span key="b">Second</span>]],
  ] as [string, ReactNode][])(
    'falls back to one div and retains both controls for %s asChild content',
    (_name, children) => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
      const { container } = render(
        <DirectionalButtonGroup
          asChild
          aria-label="Fallback pagination"
          startButton={{ direction: 'left', 'aria-label': 'Previous' }}
          endButton={{ direction: 'right', 'aria-label': 'Next' }}
        >
          {children}
        </DirectionalButtonGroup>,
      );

      const group = screen.getByRole('group', { name: 'Fallback pagination' });
      expect(group.tagName).toBe('DIV');
      expect(container.childElementCount).toBe(1);
      expect(screen.getByRole('button', { name: 'Previous' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
      if (_name === 'img') expect(screen.getByRole('img', { name: 'Artwork' })).toBeInTheDocument();
      if (_name === 'input')
        expect(screen.getByRole('textbox', { name: 'Nested field' })).toBeInTheDocument();
      if (_name === 'Fragment') expect(group).toHaveTextContent('Fragment content');
      if (_name === 'text') expect(group).toHaveTextContent('Text content');
      if (_name === 'multiple children') expect(group).toHaveTextContent('FirstSecond');
      expect(consoleError).not.toHaveBeenCalled();
      consoleError.mockRestore();
    },
  );

  it('keeps DirectionalButtonGroup host selection deterministic on the server', () => {
    const validMarkup = renderToString(
      <DirectionalButtonGroup
        asChild
        startButton={{ direction: 'left', 'aria-label': 'Previous' }}
        endButton={{ direction: 'right', 'aria-label': 'Next' }}
      >
        <section />
      </DirectionalButtonGroup>,
    );
    const fallbackMarkup = renderToString(
      <DirectionalButtonGroup
        asChild
        startButton={{ direction: 'left', 'aria-label': 'Previous' }}
        endButton={{ direction: 'right', 'aria-label': 'Next' }}
      >
        <input aria-label="Invalid group host" />
      </DirectionalButtonGroup>,
    );

    expect(validMarkup).toContain('<section');
    expect(fallbackMarkup).toContain('<div');
    expect(fallbackMarkup).toContain('Invalid group host');
  });

  it('has no obvious accessibility violations', async () => {
    const { container } = render(
      <DirectionalButtonGroup
        orientation="vertical"
        startButton={{ direction: 'up', 'aria-label': 'Increment' }}
        endButton={{ direction: 'down', 'aria-label': 'Decrement' }}
      />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
