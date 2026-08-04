import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Input } from './Input';
import { FormControl, FormErrorMessage, FormHelperText, FormLabel } from '../FormControl';

const CustomInput = forwardRef<HTMLInputElement, ComponentPropsWithoutRef<'input'>>(
  function CustomInput(props, ref) {
    return <input ref={ref} {...props} />;
  },
);

/**

 * ### Test Strategy
 * - **Focus**: The Input component must render correctly, handle variants/states, and maintain accessibility standards.
 * - **Design Verification**: Verifies that Silver Ratio based sizing and semantic border tokens are applied correctly.
 */
describe('Atoms / Input', () => {
  it('should pass accessibility compliance', async () => {
    const { container } = render(<Input aria-label="Test input" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders correctly', () => {
    render(<Input placeholder="test input" />);
    expect(screen.getByPlaceholderText('test input')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = { current: null };
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('supports disabled state', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('forwards disabled state to a slotted input', async () => {
    const user = userEvent.setup();
    render(
      <Input asChild disabled>
        <input aria-label="Slotted input" defaultValue="fixed" />
      </Input>,
    );
    const input = screen.getByRole('textbox', { name: 'Slotted input' });
    await user.type(input, ' value');
    expect(input).toBeDisabled();
    expect(input).toHaveValue('fixed');
  });

  it('blocks interaction with a disabled slotted input', () => {
    const onChildClick = vi.fn();
    render(
      <Input asChild disabled>
        <input aria-label="Edit value" onClick={onChildClick} />
      </Input>,
    );
    const input = screen.getByRole('textbox', { name: 'Edit value' });
    fireEvent.click(input);
    expect(onChildClick).not.toHaveBeenCalled();
    expect(input).toBeDisabled();
  });

  it('blocks change handlers on a disabled custom slotted input', () => {
    const onChange = vi.fn();
    render(
      <Input asChild disabled>
        <CustomInput aria-label="Custom input" onChange={onChange} />
      </Input>,
    );

    fireEvent.change(screen.getByRole('textbox', { name: 'Custom input' }), {
      target: { value: 'changed' },
    });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('blocks disabled slotted child capture handlers before they run', () => {
    const onChildClickCapture = vi.fn();
    const onChildPointerDownCapture = vi.fn();
    const onChildKeyDownCapture = vi.fn();
    render(
      <Input asChild disabled>
        <input
          aria-label="Edit value"
          onClickCapture={onChildClickCapture}
          onPointerDownCapture={onChildPointerDownCapture}
          onKeyDownCapture={onChildKeyDownCapture}
        />
      </Input>,
    );

    const input = screen.getByRole('textbox', { name: 'Edit value' });
    fireEvent.click(input);
    fireEvent.pointerDown(input);
    fireEvent.keyDown(input, { key: 'a' });
    expect(input).toHaveAttribute('aria-disabled', 'true');
    expect(onChildClickCapture).not.toHaveBeenCalled();
    expect(onChildPointerDownCapture).not.toHaveBeenCalled();
    expect(onChildKeyDownCapture).not.toHaveBeenCalled();
  });

  it('falls back to a native input for incompatible asChild hosts', () => {
    render(
      <Input asChild aria-label="Fallback input">
        <a href="/edit">Edit value</a>
      </Input>,
    );

    expect(screen.getByRole('textbox', { name: 'Fallback input' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Edit value' })).not.toBeInTheDocument();
  });

  it('keeps custom input components that forward the input contract', () => {
    const ref = { current: null as HTMLInputElement | null };
    render(
      <Input asChild ref={ref} aria-label="Masked input" defaultValue="12">
        <CustomInput />
      </Input>,
    );

    expect(screen.getByRole('textbox', { name: 'Masked input' })).toHaveValue('12');
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('owns FormControl state on a slotted input without replacing consumer value handlers', () => {
    const onChange = vi.fn();
    render(
      <Input asChild value="owned by consumer" onChange={onChange}>
        <input disabled readOnly required aria-disabled="true" />
      </Input>,
    );

    const input = screen.getByRole('textbox');
    expect(input).not.toBeDisabled();
    expect(input).not.toHaveAttribute('readonly');
    expect(input).not.toBeRequired();
    expect(input).not.toHaveAttribute('aria-disabled');
    expect(input).toHaveValue('owned by consumer');

    fireEvent.change(input, { target: { value: 'next' } });
    expect(onChange).toHaveBeenCalledOnce();
  });

  it('supports error state', () => {
    render(<Input error />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('does not set aria-invalid when error is false', () => {
    render(<Input error={false} />);
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid');
  });

  it('supports readOnly state', () => {
    render(<Input readOnly value="fixed value" aria-label="read only field" />);
    const el = screen.getByRole('textbox');
    expect(el).toHaveAttribute('readonly');
    expect(el).toHaveValue('fixed value');
  });

  it('renders startElement with wrapper', () => {
    render(<Input aria-label="search" startElement={<span data-testid="start-icon" />} />);
    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders endElement with wrapper', () => {
    render(<Input aria-label="date" endElement={<span data-testid="end-icon" />} />);
    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('keeps non-interactive adornments decorative and inert', () => {
    render(
      <Input
        aria-label="search"
        startElement={<span data-testid="decorative-start" />}
        endElement={<button type="button">Unsafe action</button>}
      />,
    );

    for (const testId of ['decorative-start']) {
      const wrapper = screen.getByTestId(testId).closest('[data-input-group-element]');
      expect(wrapper).toHaveAttribute('aria-hidden', 'true');
      expect(wrapper).toHaveAttribute('inert');
    }
    expect(screen.queryByRole('button', { name: 'Unsafe action' })).not.toBeInTheDocument();
  });

  it('keeps interactive adornments available to assistive technology', async () => {
    const { container } = render(
      <Input
        aria-label="Search"
        endElement={<button type="button" aria-label="Clear search" />}
        endElementInteractive
      />,
    );

    const clearButton = screen.getByRole('button', { name: 'Clear search' });
    expect(clearButton.closest('[aria-hidden="true"]')).toBeNull();
    expect(clearButton.closest('[data-interactive]')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it('forwards ref with adornments', () => {
    const ref = { current: null };
    render(<Input ref={ref} startElement={<span />} endElement={<span />} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('passes a11y with adornments', async () => {
    const { container } = render(
      <Input aria-label="search" startElement={<span>🔍</span>} endElement={<span>✕</span>} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('uses FormControl context when explicit input props are omitted', () => {
    render(
      <FormControl id="email" isInvalid isRequired isDisabled>
        <FormLabel>Email</FormLabel>
        <Input />
        <FormHelperText>Use your work email.</FormHelperText>
        <FormErrorMessage>Email is required.</FormErrorMessage>
      </FormControl>,
    );

    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input).toHaveAttribute('id', 'email');
    expect(input).toBeDisabled();
    expect(input).toBeRequired();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    const describedBy = input.getAttribute('aria-describedby')?.split(' ') ?? [];
    expect(describedBy).toHaveLength(2);
    describedBy.forEach((id) => expect(document.getElementById(id)).toBeInTheDocument());
    expect(input).toHaveAttribute('aria-errormessage', describedBy[1]);
  });

  it('associates FormControl errors when aria-invalid is explicitly true', () => {
    render(
      <FormControl id="email" isInvalid>
        <FormLabel>Email</FormLabel>
        <Input error={false} aria-invalid />
        <FormErrorMessage>Email is required.</FormErrorMessage>
      </FormControl>,
    );

    const input = screen.getByRole('textbox', { name: 'Email' });
    const error = screen.getByText('Email is required.');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-errormessage', error.id);
  });

  it.each(['grammar', 'spelling'] as const)(
    'associates FormControl errors when aria-invalid is %s',
    (ariaInvalid) => {
      render(
        <FormControl id="email" isInvalid>
          <FormLabel>Email</FormLabel>
          <Input error={false} aria-invalid={ariaInvalid} />
          <FormErrorMessage>Email needs attention.</FormErrorMessage>
        </FormControl>,
      );

      const input = screen.getByRole('textbox', { name: 'Email' });
      expect(input).toHaveAttribute('aria-invalid', ariaInvalid);
      expect(input).toHaveAttribute(
        'aria-errormessage',
        screen.getByText('Email needs attention.').id,
      );
    },
  );
});
