import { fireEvent, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { StrictMode, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { InputGroup, InputStartAddon } from './index';
import * as inputGroupExports from './index';

describe('InputGroup', () => {
  it('does not expose physical-direction named or compound slots', () => {
    expect(inputGroupExports).not.toHaveProperty('InputLeftAddon');
    expect(inputGroupExports).not.toHaveProperty('InputRightAddon');
    expect(inputGroupExports).not.toHaveProperty('InputLeftElement');
    expect(inputGroupExports).not.toHaveProperty('InputRightElement');
    expect(InputGroup).not.toHaveProperty('LeftAddon');
    expect(InputGroup).not.toHaveProperty('RightAddon');
    expect(InputGroup).not.toHaveProperty('LeftElement');
    expect(InputGroup).not.toHaveProperty('RightElement');
  });

  it('provides logical compound slots and state markers', () => {
    render(
      <InputGroup dir="rtl">
        <InputGroup.StartAddon>₪</InputGroup.StartAddon>
        <InputGroup.StartElement aria-hidden="true">@</InputGroup.StartElement>
        <InputGroup.Input aria-label="Amount" />
        <InputGroup.EndElement aria-hidden="true">kg</InputGroup.EndElement>
        <InputGroup.EndAddon>ILS</InputGroup.EndAddon>
      </InputGroup>,
    );

    const input = screen.getByLabelText('Amount');
    expect(input).toHaveAttribute('data-has-start-addon');
    expect(input).toHaveAttribute('data-has-end-addon');
    expect(input).not.toHaveAttribute('data-has-left-addon');
    expect(input).not.toHaveAttribute('data-has-right-addon');
    expect(screen.getByText('₪')).toHaveAttribute('data-placement', 'start');
    expect(screen.getByText('ILS')).toHaveAttribute('data-placement', 'end');
  });
  it('replays generated slots during StrictMode rendering', () => {
    function* slots() {
      yield <InputGroup.StartAddon key="addon">https://</InputGroup.StartAddon>;
      yield <InputGroup.Input key="input" aria-label="Website" />;
    }

    render(
      <StrictMode>
        <InputGroup>{slots()}</InputGroup>
      </StrictMode>,
    );

    expect(screen.getByText('https://')).toBeInTheDocument();
    expect(screen.getByLabelText('Website')).toBeInTheDocument();
  });

  it.each([
    ['img', <img key="img" alt="Artwork" />],
    ['input', <input key="input" aria-label="Nested field" />],
    ['Fragment', <>Fragment content</>],
    ['text', 'Text content'],
    ['multiple children', [<span key="a">First</span>, <span key="b">Second</span>]],
  ] as [string, ReactNode][])(
    'falls back to one div without Slot errors for %s asChild content',
    (_name, children) => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
      const { container } = render(
        <InputGroup asChild data-testid="fallback-group">
          {children}
        </InputGroup>,
      );

      expect(screen.getByTestId('fallback-group').tagName).toBe('DIV');
      expect(container.childElementCount).toBe(1);
      if (_name === 'img')
        expect(screen.queryByRole('img', { name: 'Artwork' })).not.toBeInTheDocument();
      if (_name === 'input')
        expect(screen.queryByRole('textbox', { name: 'Nested field' })).not.toBeInTheDocument();
      if (_name === 'Fragment') expect(container).toHaveTextContent('Fragment content');
      if (_name === 'text') expect(container).toHaveTextContent('Text content');
      if (_name === 'multiple children') expect(container).toHaveTextContent('FirstSecond');
      expect(consoleError).not.toHaveBeenCalled();
      consoleError.mockRestore();
    },
  );

  it('keeps asChild host selection deterministic during server rendering', () => {
    const validMarkup = renderToString(
      <InputGroup asChild>
        <section>
          <InputGroup.Input aria-label="Server field" />
        </section>
      </InputGroup>,
    );
    const fallbackMarkup = renderToString(
      <InputGroup asChild>
        <img alt="Server artwork" />
      </InputGroup>,
    );

    expect(validMarkup).toContain('<section');
    expect(fallbackMarkup).toContain('<div');
    expect(fallbackMarkup).not.toContain('<img');
  });

  it('has no accessibility violations for compound slots', async () => {
    const { container } = render(
      <InputGroup>
        <InputGroup.StartAddon>https://</InputGroup.StartAddon>
        <InputGroup.Input aria-label="Website" />
        <InputGroup.EndAddon>USD</InputGroup.EndAddon>
      </InputGroup>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it('keeps the group size as the source of truth for InputGroup.Input', () => {
    render(
      <>
        <InputGroup size="lg">
          <InputStartAddon>https://</InputStartAddon>
          <InputGroup.Input data-testid="baseline" aria-label="Baseline input" />
        </InputGroup>
        <InputGroup size="lg">
          <InputStartAddon>https://</InputStartAddon>
          <InputGroup.Input
            data-testid="override"
            aria-label="Override input"
            {...({ size: 'sm' } as never)}
          />
        </InputGroup>
      </>,
    );

    expect(screen.getByTestId('override').className).toBe(screen.getByTestId('baseline').className);
  });

  it('discards a legacy size override when InputGroup.Input is rendered without a root', () => {
    render(
      <>
        <InputGroup.Input data-testid="baseline" aria-label="Baseline input" />
        <InputGroup.Input
          {...({ size: 'lg' } as never)}
          data-testid="override"
          aria-label="Override input"
        />
      </>,
    );

    expect(screen.getByTestId('override').className).toBe(screen.getByTestId('baseline').className);
  });

  it('supports static compound slot components', () => {
    render(
      <InputGroup>
        <InputGroup.StartAddon>https://</InputGroup.StartAddon>
        <InputGroup.StartElement>@</InputGroup.StartElement>
        <InputGroup.Input aria-label="Website" />
        <InputGroup.EndElement>.com</InputGroup.EndElement>
        <InputGroup.EndAddon>USD</InputGroup.EndAddon>
      </InputGroup>,
    );

    expect(screen.getByText('https://')).toBeInTheDocument();
    expect(screen.getByText('@')).toBeInTheDocument();
    expect(screen.getByLabelText('Website')).toHaveAttribute('data-has-start-addon');
    expect(screen.getByText('.com')).toBeInTheDocument();
    expect(screen.getByText('USD')).toBeInTheDocument();
  });

  it('recognizes slots nested in fragments', () => {
    render(
      <InputGroup>
        <>
          {false}
          <>
            <InputGroup.StartAddon>https://</InputGroup.StartAddon>
            <InputGroup.Input aria-label="Website" />
          </>
        </>
      </InputGroup>,
    );

    expect(screen.getByLabelText('Website')).toHaveAttribute('data-has-start-addon');
    expect(screen.getByText('https://').parentElement).not.toBe(
      screen.getByLabelText('Website').parentElement,
    );
  });

  it('merges root props into an asChild host that contains slots', () => {
    render(
      <InputGroup asChild data-testid="group">
        <section className="host-class">
          <InputGroup.StartAddon>https://</InputGroup.StartAddon>
          <InputGroup.Input aria-label="Website" />
        </section>
      </InputGroup>,
    );

    expect(screen.getByTestId('group').tagName).toBe('SECTION');
    expect(screen.getByTestId('group')).toHaveClass('host-class');
    expect(screen.getByLabelText('Website')).toHaveAttribute('data-has-start-addon');
  });

  it.each([
    ['button', <button key="button" type="button" data-testid="invalid-host" />],
    ['paragraph', <p key="paragraph" data-testid="invalid-host" />],
    [
      'label',
      <label key="label" data-testid="invalid-host" htmlFor="nonexistent-control">
        Invalid host
      </label>,
    ],
  ])('falls back from an invalid %s asChild host before composing input parts', (_name, host) => {
    render(
      <InputGroup asChild>
        {host}
        <InputGroup.Input aria-label="Website" />
      </InputGroup>,
    );

    expect(screen.queryByTestId('invalid-host')).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Website' })).toBeInTheDocument();
    expect(document.querySelector('button input, p div, label div')).toBeNull();
  });

  it('composes asChild host handlers and refs with InputGroup props', () => {
    const hostMouseEnter = vi.fn();
    let groupEventTarget: EventTarget | null = null;
    const groupMouseEnter = vi.fn((event: React.MouseEvent<Element>) => {
      groupEventTarget = event.currentTarget;
    });
    const hostRef = { current: null as HTMLElement | null };
    const groupRef = { current: null as Element | null };
    render(
      <InputGroup asChild ref={groupRef} onMouseEnter={groupMouseEnter}>
        <section ref={hostRef} onMouseEnter={hostMouseEnter} data-testid="group">
          <InputGroup.Input aria-label="Website" />
        </section>
      </InputGroup>,
    );

    const group = screen.getByTestId('group');
    fireEvent.mouseEnter(group);
    expect(hostMouseEnter).toHaveBeenCalledTimes(1);
    expect(groupMouseEnter).toHaveBeenCalledTimes(1);
    expect(groupEventTarget).toBe(group);
    expect(hostRef.current).toBe(group);
    expect(groupRef.current).toBe(group);
  });

  it('delivers delegated addon and element callbacks from their rendered hosts', () => {
    let addonTarget: EventTarget | null = null;
    let elementTarget: EventTarget | null = null;

    render(
      <InputGroup>
        <InputGroup.StartAddon
          asChild
          onClick={(event) => {
            addonTarget = event.currentTarget;
          }}
        >
          <span>Prefix</span>
        </InputGroup.StartAddon>
        <InputGroup.Input aria-label="Website" />
        <InputGroup.EndElement
          asChild
          interactive
          onClick={(event) => {
            elementTarget = event.currentTarget;
          }}
        >
          <span>Suffix</span>
        </InputGroup.EndElement>
      </InputGroup>,
    );

    const addon = screen.getByText('Prefix');
    const element = screen.getByText('Suffix');
    fireEvent.click(addon);
    fireEvent.click(element);

    expect(addonTarget).toBe(addon);
    expect(addon.tagName).toBe('SPAN');
    expect(elementTarget).toBe(element);
    expect(element.tagName).toBe('SPAN');
  });

  it('enables pointer interaction for opted-in element slots', () => {
    render(
      <InputGroup>
        <InputGroup.Input aria-label="Search" />
        <InputGroup.EndElement interactive>
          <button type="button">Clear</button>
        </InputGroup.EndElement>
      </InputGroup>,
    );

    expect(screen.getByRole('button', { name: 'Clear' }).parentElement).toHaveAttribute(
      'data-interactive',
    );
  });
});
