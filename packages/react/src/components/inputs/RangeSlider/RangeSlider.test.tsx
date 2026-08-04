import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { FormControl, FormErrorMessage, FormHelperText, FormLabel } from '../FormControl';
import { RangeSlider } from './RangeSlider';
import { LocaleProvider } from '@/providers/LocaleProvider';
import { useLayoutEffect, useRef } from 'react';

const ParentLayoutResetRangeSlider = ({
  defaultValue,
  resetVersion,
  step,
}: {
  defaultValue: [number, number];
  resetVersion: number;
  step: number;
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  useLayoutEffect(() => {
    if (resetVersion > 0) formRef.current?.reset();
  }, [resetVersion]);

  return (
    <form ref={formRef}>
      <RangeSlider defaultValue={defaultValue} step={step} />
    </form>
  );
};

/**
 * ### Test Strategy: RangeSlider
 * - **Focus**: Multi-thumb slider semantics, value normalization, keyboard
 *   changes, hidden form values, and WAI-ARIA compliance via `axe`.
 * - **DON'T**: Do not assert visual geometry; Storybook visual specs cover the
 *   track, selected range, and thumb placement.
 */
describe('RangeSlider', () => {
  it('owns its group role and derived disabled and read-only semantics', () => {
    render(
      <RangeSlider
        aria-label="Price range"
        disabled
        readOnly
        {...({
          role: 'button',
          'aria-disabled': false,
          'aria-readonly': false,
        } as never)}
      />,
    );

    const group = screen.getByRole('group', { name: 'Price range' });
    expect(group).toHaveAttribute('aria-disabled', 'true');
    expect(group).not.toHaveAttribute('aria-readonly');
    screen.getAllByRole('slider').forEach((thumb) => {
      expect(thumb).toHaveAttribute('aria-readonly', 'true');
    });
  });

  it('renders two named slider thumbs in stable order', () => {
    render(<RangeSlider defaultValue={[20, 80]}>Price range</RangeSlider>);

    const sliders = screen.getAllByRole('slider');
    expect(sliders).toHaveLength(2);
    expect(sliders[0]).toHaveAccessibleName('Price range Minimum value');
    expect(sliders[1]).toHaveAccessibleName('Price range Maximum value');
    expect(sliders[0]).toHaveAttribute('aria-valuenow', '20');
    expect(sliders[1]).toHaveAttribute('aria-valuenow', '80');
  });

  it('includes external and FormControl labels in each thumb name', () => {
    const { rerender } = render(
      <>
        <span id="price-label">Price range</span>
        <RangeSlider aria-labelledby="price-label" defaultValue={[20, 80]} />
      </>,
    );

    expect(screen.getByRole('slider', { name: 'Price range Minimum value' })).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: 'Price range Maximum value' })).toBeInTheDocument();

    rerender(
      <FormControl labelTarget="group">
        <FormLabel>Discount range</FormLabel>
        <RangeSlider defaultValue={[20, 80]} />
      </FormControl>,
    );
    expect(
      screen.getByRole('slider', { name: 'Discount range Minimum value' }),
    ).toBeInTheDocument();
  });

  it('uses the composite label contract and focuses the lower thumb from its FormLabel', () => {
    render(
      <FormControl id="discount-range" labelTarget="group">
        <FormLabel>Discount range</FormLabel>
        <RangeSlider defaultValue={[20, 80]} />
      </FormControl>,
    );

    const label = screen.getByText('Discount range').closest('label');
    const group = screen.getByRole('group', { name: 'Discount range' });
    expect(label).not.toHaveAttribute('for');
    expect(group).toHaveAttribute('id', 'discount-range');
    expect(group).toHaveAttribute('aria-labelledby', 'discount-range-label');

    fireEvent.click(label!);
    expect(screen.getByRole('slider', { name: 'Discount range Minimum value' })).toHaveFocus();
  });

  it('updates dependent aria bounds when the lower thumb changes', () => {
    render(<RangeSlider defaultValue={[20, 80]} />);

    fireEvent.keyDown(screen.getByRole('slider', { name: 'Minimum value' }), {
      key: 'ArrowRight',
    });

    expect(screen.getByRole('slider', { name: 'Maximum value' })).toHaveAttribute(
      'aria-valuemin',
      '21',
    );
  });

  it('announces bounds that include the minimum thumb gap', () => {
    render(<RangeSlider defaultValue={[20, 80]} step={5} minStepsBetweenThumbs={2} />);

    const lower = screen.getByRole('slider', { name: 'Minimum value' });
    const upper = screen.getByRole('slider', { name: 'Maximum value' });
    expect(lower).toHaveAttribute('aria-valuemax', '70');
    expect(upper).toHaveAttribute('aria-valuemin', '30');

    fireEvent.keyDown(lower, { key: 'ArrowRight' });
    expect(upper).toHaveAttribute('aria-valuemin', '35');
  });

  it('keeps decimal minimum-gap bounds consistent with the selected thumb value', () => {
    render(
      <RangeSlider min={0} max={1} step={0.1} defaultValue={[0, 0.3]} minStepsBetweenThumbs={3} />,
    );

    const upper = screen.getByRole('slider', { name: 'Maximum value' });
    expect(upper).toHaveAttribute('aria-valuenow', '0.3');
    expect(upper).toHaveAttribute('aria-valuemin', '0.3');

    fireEvent.keyDown(upper, { key: 'ArrowLeft' });
    expect(upper).toHaveAttribute('aria-valuenow', '0.3');
    expect(upper).toHaveAttribute('aria-valuemin', '0.3');
  });

  it('calls onValueChange from keyboard interactions', () => {
    const handleChange = vi.fn();
    render(<RangeSlider defaultValue={[20, 80]} step={5} onValueChange={handleChange} />);

    fireEvent.keyDown(screen.getByRole('slider', { name: 'Maximum value' }), {
      key: 'ArrowLeft',
    });

    expect(handleChange).toHaveBeenCalledWith([20, 75], 'upper');
  });

  it('commits the last changed keyboard value only after interaction', () => {
    const handleCommit = vi.fn();
    render(<RangeSlider defaultValue={[20, 80]} step={5} onValueCommit={handleCommit} />);
    const lowerThumb = screen.getByRole('slider', { name: 'Minimum value' });

    fireEvent.keyUp(lowerThumb, { key: 'Tab' });
    expect(handleCommit).not.toHaveBeenCalled();

    fireEvent.keyDown(lowerThumb, { key: 'ArrowRight' });
    fireEvent.keyUp(lowerThumb, { key: 'ArrowRight' });

    expect(handleCommit).toHaveBeenCalledWith([25, 80], 'lower');
  });

  it('commits on blur and ignores unrelated key-up events', () => {
    const handleCommit = vi.fn();
    render(<RangeSlider defaultValue={[20, 80]} onValueCommit={handleCommit} />);
    const lowerThumb = screen.getByRole('slider', { name: 'Minimum value' });

    fireEvent.keyDown(lowerThumb, { key: 'ArrowRight' });
    fireEvent.keyUp(lowerThumb, { key: 'Shift' });
    expect(handleCommit).not.toHaveBeenCalled();

    fireEvent.blur(lowerThumb);
    expect(handleCommit).toHaveBeenCalledWith([21, 80], 'lower');
  });

  it.each(['disabled', 'readOnly'] as const)(
    'does not commit a pending keyboard interaction after becoming %s',
    (state) => {
      const handleCommit = vi.fn();
      const { rerender } = render(
        <RangeSlider defaultValue={[20, 80]} onValueCommit={handleCommit} />,
      );
      const lowerThumb = screen.getByRole('slider', { name: 'Minimum value' });

      fireEvent.keyDown(lowerThumb, { key: 'ArrowRight' });
      rerender(
        <RangeSlider defaultValue={[20, 80]} onValueCommit={handleCommit} {...{ [state]: true }} />,
      );
      fireEvent.keyUp(lowerThumb, { key: 'ArrowRight' });
      fireEvent.blur(lowerThumb);

      expect(handleCommit).not.toHaveBeenCalled();
    },
  );

  it('normalizes a pending interaction against bounds changed before commit', () => {
    const handleCommit = vi.fn();
    const { rerender } = render(
      <RangeSlider defaultValue={[20, 80]} max={100} onValueCommit={handleCommit} />,
    );
    const upperThumb = screen.getByRole('slider', { name: 'Maximum value' });

    fireEvent.keyDown(upperThumb, { key: 'ArrowRight' });
    rerender(<RangeSlider defaultValue={[20, 80]} max={50} onValueCommit={handleCommit} />);
    fireEvent.keyUp(upperThumb, { key: 'ArrowRight' });

    expect(handleCommit).toHaveBeenCalledWith([20, 50], 'upper');
  });

  it('keeps controlled values stable until parent updates', () => {
    const handleChange = vi.fn();
    render(<RangeSlider value={[20, 80]} onValueChange={handleChange} />);

    fireEvent.keyDown(screen.getByRole('slider', { name: 'Minimum value' }), {
      key: 'ArrowRight',
    });

    expect(handleChange).toHaveBeenCalledWith([21, 80], 'lower');
    expect(screen.getByRole('slider', { name: 'Minimum value' })).toHaveAttribute(
      'aria-valuenow',
      '20',
    );
  });

  it('keeps the latest controlled value when becoming uncontrolled', () => {
    const { rerender, container } = render(<RangeSlider value={[20, 80]} name="price" />);

    rerender(<RangeSlider value={[40, 60]} name="price" />);
    rerender(<RangeSlider name="price" />);

    expect(screen.getByRole('slider', { name: 'Minimum value' })).toHaveAttribute(
      'aria-valuenow',
      '40',
    );
    expect(screen.getByRole('slider', { name: 'Maximum value' })).toHaveAttribute(
      'aria-valuenow',
      '60',
    );
    expect(container.querySelector('input[name="priceMin"]')).toHaveValue('40');
    expect(container.querySelector('input[name="priceMax"]')).toHaveValue('60');
  });

  it('hands off a semantically equal controlled tuple without resetting to the default', () => {
    const { rerender } = render(<RangeSlider value={[20, 80]} defaultValue={[0, 100]} />);

    rerender(<RangeSlider value={[20, 80]} defaultValue={[0, 100]} />);
    rerender(<RangeSlider defaultValue={[0, 100]} />);

    expect(screen.getByRole('slider', { name: 'Minimum value' })).toHaveAttribute(
      'aria-valuenow',
      '20',
    );
    expect(screen.getByRole('slider', { name: 'Maximum value' })).toHaveAttribute(
      'aria-valuenow',
      '80',
    );
  });

  it('normalizes an uncontrolled tuple for current bounds without overwriting it', () => {
    const { rerender } = render(<RangeSlider defaultValue={[20, 80]} max={100} />);

    rerender(<RangeSlider defaultValue={[20, 80]} max={50} />);
    expect(screen.getByRole('slider', { name: 'Maximum value' })).toHaveAttribute(
      'aria-valuenow',
      '50',
    );

    rerender(<RangeSlider defaultValue={[20, 80]} max={100} />);
    expect(screen.getByRole('slider', { name: 'Maximum value' })).toHaveAttribute(
      'aria-valuenow',
      '80',
    );
  });

  it('renders hidden form inputs for range values', () => {
    const { container } = render(<RangeSlider name="price" defaultValue={[10, 90]} />);

    expect(container.querySelector('input[name="priceMin"]')).toHaveValue('10');
    expect(container.querySelector('input[name="priceMax"]')).toHaveValue('90');
  });

  it('synchronizes an uncontrolled value with form reset', async () => {
    const { container } = render(
      <form>
        <RangeSlider name="price" defaultValue={[20, 80]} />
      </form>,
    );
    const lowerThumb = screen.getByRole('slider', { name: 'Minimum value' });

    fireEvent.keyDown(lowerThumb, { key: 'ArrowRight' });
    expect(lowerThumb).toHaveAttribute('aria-valuenow', '21');

    await act(async () => {
      (container.querySelector('form') as HTMLFormElement).reset();
      await Promise.resolve();
    });
    expect(lowerThumb).toHaveAttribute('aria-valuenow', '20');
  });

  it('submits and resets through an externally associated form', async () => {
    const { container } = render(
      <>
        <form id="price-form" />
        <RangeSlider form="price-form" name="price" defaultValue={[20, 80]} />
      </>,
    );
    const lowerThumb = screen.getByRole('slider', { name: 'Minimum value' });
    const form = container.querySelector('form') as HTMLFormElement;

    expect(Array.from(new FormData(form).entries())).toEqual([
      ['priceMin', '20'],
      ['priceMax', '80'],
    ]);

    fireEvent.keyDown(lowerThumb, { key: 'ArrowRight' });
    await act(async () => {
      form.reset();
      await Promise.resolve();
    });

    expect(lowerThumb).toHaveAttribute('aria-valuenow', '20');
  });

  it('resets through a late external form and a same-id replacement without rerendering', async () => {
    const { container } = render(
      <RangeSlider form="price-form" name="price" defaultValue={[20, 80]} />,
    );
    const lowerThumb = screen.getByRole('slider', { name: 'Minimum value' });
    fireEvent.keyDown(lowerThumb, { key: 'ArrowRight' });

    const firstForm = document.createElement('form');
    firstForm.id = 'price-form';
    container.prepend(firstForm);
    await act(async () => {
      firstForm.reset();
      await Promise.resolve();
    });
    expect(lowerThumb).toHaveAttribute('aria-valuenow', '20');

    fireEvent.keyDown(lowerThumb, { key: 'ArrowRight' });
    firstForm.remove();
    const secondForm = document.createElement('form');
    secondForm.id = 'price-form';
    container.prepend(secondForm);

    await act(async () => {
      firstForm.reset();
      await Promise.resolve();
    });
    expect(lowerThumb).toHaveAttribute('aria-valuenow', '21');

    await act(async () => {
      secondForm.reset();
      await Promise.resolve();
    });
    expect(lowerThumb).toHaveAttribute('aria-valuenow', '20');
  });

  it('uses the latest default and options for a parent layout reset in the update commit', async () => {
    const { rerender } = render(
      <ParentLayoutResetRangeSlider defaultValue={[20, 80]} resetVersion={0} step={1} />,
    );
    const lowerThumb = screen.getByRole('slider', { name: 'Minimum value' });
    fireEvent.keyDown(lowerThumb, { key: 'ArrowRight' });

    rerender(<ParentLayoutResetRangeSlider defaultValue={[34, 76]} resetVersion={1} step={10} />);

    await waitFor(() => expect(lowerThumb).toHaveAttribute('aria-valuenow', '30'));
    expect(screen.getByRole('slider', { name: 'Maximum value' })).toHaveAttribute(
      'aria-valuenow',
      '80',
    );
  });

  it('associates explicit invalid state with each slider thumb', () => {
    render(
      <FormControl id="price" isInvalid>
        <FormLabel>Price</FormLabel>
        <RangeSlider error={false} aria-invalid aria-errormessage="custom-price-error" />
        <FormHelperText id="price-help">Select a price range.</FormHelperText>
        <FormErrorMessage id="price-error">Price is invalid.</FormErrorMessage>
      </FormControl>,
    );

    screen.getAllByRole('slider').forEach((thumb) => {
      expect(thumb).toHaveAttribute('aria-invalid', 'true');
      expect(thumb).toHaveAttribute('aria-describedby', 'price-help price-error');
      expect(thumb).toHaveAttribute('aria-errormessage', 'custom-price-error');
    });
  });

  it('keeps a non-step-aligned maximum reachable and accurately announced', () => {
    render(<RangeSlider defaultValue={[0, 10]} min={0} max={10} step={3} />);

    const upperThumb = screen.getByRole('slider', { name: 'Maximum value' });
    expect(upperThumb).toHaveAttribute('aria-valuenow', '10');
    expect(upperThumb).toHaveAttribute('aria-valuemax', '10');

    fireEvent.keyDown(upperThumb, { key: 'End' });
    expect(upperThumb).toHaveAttribute('aria-valuenow', '10');
  });

  it('does not update disabled or read-only sliders', () => {
    const handleChange = vi.fn();
    const { rerender } = render(
      <RangeSlider disabled defaultValue={[20, 80]} onValueChange={handleChange} />,
    );

    fireEvent.keyDown(screen.getByRole('slider', { name: 'Minimum value' }), {
      key: 'ArrowRight',
    });
    expect(handleChange).not.toHaveBeenCalled();

    rerender(<RangeSlider readOnly defaultValue={[20, 80]} onValueChange={handleChange} />);
    fireEvent.keyDown(screen.getByRole('slider', { name: 'Minimum value' }), {
      key: 'ArrowRight',
    });
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('follows disabled fieldset participation for interaction and form submission', async () => {
    const renderSlider = (fieldsetDisabled: boolean) => (
      <form>
        <fieldset disabled={fieldsetDisabled}>
          <RangeSlider name="price" defaultValue={[20, 80]} />
        </fieldset>
      </form>
    );
    const { container, rerender } = render(renderSlider(true));
    const group = container.querySelector<HTMLElement>('[role="group"]')!;
    const lowerThumb = screen.getByRole('slider', { name: 'Minimum value' });
    const track = container.querySelector<HTMLElement>('[data-range-slider-track]')!;
    Object.defineProperty(track, 'getBoundingClientRect', {
      value: () => ({ left: 0, width: 100 }),
    });
    Object.defineProperty(track, 'setPointerCapture', { value: vi.fn() });

    await waitFor(() => expect(group).toHaveAttribute('aria-disabled', 'true'));
    fireEvent.keyDown(lowerThumb, { key: 'ArrowRight' });
    fireEvent.pointerDown(track, {
      button: 0,
      isPrimary: true,
      clientX: 50,
      pointerId: 1,
    });

    expect(lowerThumb).toHaveAttribute('aria-valuenow', '20');
    expect(
      Array.from(new FormData(container.querySelector('form') as HTMLFormElement).entries()),
    ).toEqual([]);

    rerender(renderSlider(false));
    await waitFor(() => expect(group).not.toHaveAttribute('aria-disabled'));
    fireEvent.keyDown(lowerThumb, { key: 'ArrowRight' });
    expect(lowerThumb).toHaveAttribute('aria-valuenow', '21');
  });

  it('does not interact when a capture handler has already prevented the event', () => {
    const handleChange = vi.fn();
    const { container } = render(
      <RangeSlider
        defaultValue={[20, 80]}
        onValueChange={handleChange}
        onKeyDownCapture={(event) => event.preventDefault()}
        onPointerDownCapture={(event) => event.preventDefault()}
      />,
    );
    const lowerThumb = screen.getByRole('slider', { name: 'Minimum value' });
    const track = container.querySelector<HTMLElement>('[data-range-slider-track]')!;
    Object.defineProperty(track, 'getBoundingClientRect', {
      value: () => ({ left: 0, width: 100 }),
    });
    Object.defineProperty(track, 'setPointerCapture', { value: vi.fn() });

    fireEvent.keyDown(lowerThumb, { key: 'ArrowRight' });
    fireEvent.pointerDown(track, {
      button: 0,
      isPrimary: true,
      clientX: 50,
      pointerId: 1,
    });

    expect(handleChange).not.toHaveBeenCalled();
    expect(lowerThumb).toHaveAttribute('aria-valuenow', '20');
  });

  it('cancels an active drag when disabled during the interaction', () => {
    const handleCommit = vi.fn();
    const { container, rerender } = render(
      <RangeSlider defaultValue={[20, 80]} onValueCommit={handleCommit} />,
    );
    const track = container.querySelector<HTMLElement>('[data-range-slider-track]');
    expect(track).not.toBeNull();
    Object.defineProperty(track, 'setPointerCapture', { value: vi.fn() });
    Object.defineProperty(track, 'hasPointerCapture', { value: vi.fn(() => false) });

    fireEvent.pointerDown(track!, { button: 0, isPrimary: true, clientX: 0, pointerId: 1 });
    rerender(<RangeSlider disabled defaultValue={[20, 80]} onValueCommit={handleCommit} />);
    fireEvent.pointerUp(track!, { pointerId: 1 });

    expect(handleCommit).not.toHaveBeenCalled();
  });

  it('updates the targeted thumb during a drag and commits its final value once', () => {
    const handleChange = vi.fn();
    const handleCommit = vi.fn();
    const { container } = render(
      <RangeSlider
        defaultValue={[20, 80]}
        onValueChange={handleChange}
        onValueCommit={handleCommit}
      />,
    );
    const track = container.querySelector<HTMLElement>('[data-range-slider-track]');
    expect(track).not.toBeNull();
    Object.defineProperty(track, 'getBoundingClientRect', {
      value: () => ({ left: 0, width: 100 }),
    });
    Object.defineProperty(track, 'setPointerCapture', { value: vi.fn() });
    Object.defineProperty(track, 'hasPointerCapture', { value: vi.fn(() => true) });
    Object.defineProperty(track, 'releasePointerCapture', { value: vi.fn() });

    fireEvent.pointerDown(track!, { button: 0, isPrimary: true, clientX: 30, pointerId: 1 });
    fireEvent.pointerMove(track!, { clientX: 50, pointerId: 1 });
    fireEvent.pointerUp(track!, { pointerId: 1 });
    fireEvent.lostPointerCapture(track!, { pointerId: 1 });

    expect(handleChange).toHaveBeenNthCalledWith(1, [30, 80], 'lower');
    expect(handleChange).toHaveBeenNthCalledWith(2, [50, 80], 'lower');
    expect(handleCommit).toHaveBeenCalledTimes(1);
    expect(handleCommit).toHaveBeenCalledWith([50, 80], 'lower');
    expect(screen.getByRole('slider', { name: 'Minimum value' })).toHaveFocus();
  });

  it('preserves commit transactions when a pointer moves focus between thumbs', () => {
    const handleCommit = vi.fn();
    const { container } = render(
      <RangeSlider defaultValue={[20, 80]} onValueCommit={handleCommit} />,
    );
    const track = container.querySelector<HTMLElement>('[data-range-slider-track]')!;
    const lower = screen.getByRole('slider', { name: 'Minimum value' });
    Object.defineProperty(track, 'getBoundingClientRect', {
      value: () => ({ left: 0, width: 100 }),
    });
    Object.defineProperty(track, 'setPointerCapture', { value: vi.fn() });
    Object.defineProperty(track, 'hasPointerCapture', { value: vi.fn(() => true) });
    Object.defineProperty(track, 'releasePointerCapture', { value: vi.fn() });

    lower.focus();
    fireEvent.keyDown(lower, { key: 'ArrowRight' });
    fireEvent.pointerDown(track, {
      button: 0,
      isPrimary: true,
      clientX: 90,
      pointerId: 1,
    });
    fireEvent.pointerUp(track, { pointerId: 1 });

    expect(handleCommit).toHaveBeenNthCalledWith(1, [21, 80], 'lower');
    expect(handleCommit).toHaveBeenNthCalledWith(2, [21, 90], 'upper');
  });

  it('cancels a pointer transaction without committing its final value', () => {
    const handleChange = vi.fn();
    const handleCommit = vi.fn();
    const { container } = render(
      <RangeSlider
        defaultValue={[20, 80]}
        onValueChange={handleChange}
        onValueCommit={handleCommit}
      />,
    );
    const track = container.querySelector<HTMLElement>('[data-range-slider-track]');
    expect(track).not.toBeNull();
    Object.defineProperty(track, 'getBoundingClientRect', {
      value: () => ({ left: 0, width: 100 }),
    });
    Object.defineProperty(track, 'setPointerCapture', { value: vi.fn() });
    Object.defineProperty(track, 'hasPointerCapture', { value: vi.fn(() => true) });
    Object.defineProperty(track, 'releasePointerCapture', { value: vi.fn() });

    fireEvent.pointerDown(track!, { button: 0, isPrimary: true, clientX: 30, pointerId: 1 });
    fireEvent.pointerMove(track!, { clientX: 50, pointerId: 1 });
    fireEvent.pointerCancel(track!, { pointerId: 1 });
    fireEvent.lostPointerCapture(track!, { pointerId: 1 });

    expect(handleChange).toHaveBeenLastCalledWith([50, 80], 'lower');
    expect(handleCommit).not.toHaveBeenCalled();
    expect(screen.getByRole('slider', { name: 'Minimum value' })).toHaveAttribute(
      'aria-valuenow',
      '50',
    );
  });

  it('does not notify consumers when a thumb is already at its bound', () => {
    const handleChange = vi.fn();
    const handleCommit = vi.fn();
    render(
      <RangeSlider
        defaultValue={[0, 100]}
        onValueChange={handleChange}
        onValueCommit={handleCommit}
      />,
    );
    const lowerThumb = screen.getByRole('slider', { name: 'Minimum value' });

    fireEvent.keyDown(lowerThumb, { key: 'ArrowLeft' });
    fireEvent.keyUp(lowerThumb, { key: 'ArrowLeft' });

    expect(handleChange).not.toHaveBeenCalled();
    expect(handleCommit).not.toHaveBeenCalled();
  });

  it('ignores non-primary pointer presses', () => {
    const { container } = render(<RangeSlider defaultValue={[20, 80]} />);
    const track = container.querySelector<HTMLElement>('[data-range-slider-track]');
    expect(track).not.toBeNull();

    fireEvent.pointerDown(track!, { button: 2, isPrimary: true, clientX: 0, pointerId: 1 });

    expect(screen.getByRole('slider', { name: 'Minimum value' })).toHaveAttribute(
      'aria-valuenow',
      '20',
    );
  });

  it('maps pointer coordinates and geometry from the inline start in RTL', () => {
    const { container } = render(<RangeSlider dir="rtl" defaultValue={[20, 80]} />);
    const track = container.querySelector<HTMLElement>('[data-range-slider-track]');
    expect(track).not.toBeNull();
    Object.defineProperty(track, 'getBoundingClientRect', {
      value: () => ({ left: 0, width: 100 }),
    });
    Object.defineProperty(track, 'setPointerCapture', { value: vi.fn() });

    fireEvent.pointerDown(track!, { button: 0, isPrimary: true, clientX: 100, pointerId: 1 });

    expect(screen.getByRole('slider', { name: 'Minimum value' })).toHaveAttribute(
      'aria-valuenow',
      '0',
    );
    expect(screen.getByRole('slider', { name: 'Minimum value' })).toHaveStyle(
      'inset-inline-start: 0%',
    );
    expect(screen.getByRole('slider', { name: 'Maximum value' })).toHaveStyle(
      'inset-inline-start: 80%',
    );
  });

  it('reverses only horizontal keyboard direction in RTL', () => {
    render(<RangeSlider dir="rtl" defaultValue={[20, 80]} />);
    const lower = screen.getByRole('slider', { name: 'Minimum value' });

    fireEvent.keyDown(lower, { key: 'ArrowLeft' });
    expect(lower).toHaveAttribute('aria-valuenow', '21');
    fireEvent.keyDown(lower, { key: 'ArrowRight' });
    expect(lower).toHaveAttribute('aria-valuenow', '20');
    fireEvent.keyDown(lower, { key: 'ArrowUp' });
    expect(lower).toHaveAttribute('aria-valuenow', '21');
  });

  it('localizes thumb labels while explicit labels remain highest priority', () => {
    render(
      <LocaleProvider defaultLocale="ja-JP" global={false}>
        <RangeSlider lowerAriaLabel="Lower override" />
      </LocaleProvider>,
    );

    expect(screen.getByRole('slider', { name: 'Lower override' })).toBeInTheDocument();
    expect(screen.getByRole('slider', { name: '最大値' })).toBeInTheDocument();
  });

  it('sanitizes non-finite bounds', () => {
    render(<RangeSlider min={Number.NaN} max={Number.POSITIVE_INFINITY} defaultValue={[20, 80]} />);
    expect(screen.getByRole('slider', { name: 'Minimum value' })).toHaveAttribute(
      'aria-valuemin',
      '0',
    );
  });

  it('has no a11y violations', async () => {
    const { container } = render(<RangeSlider defaultValue={[20, 80]}>Price range</RangeSlider>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
