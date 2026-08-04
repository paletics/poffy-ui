import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useLayoutEffect, useRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Checkbox } from './Checkbox';
import { FormControl, FormErrorMessage, FormHelperText, FormLabel } from '../FormControl';

const ParentLayoutResetCheckbox = ({
  defaultChecked,
  resetVersion,
}: {
  defaultChecked: boolean;
  resetVersion: number;
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  useLayoutEffect(() => {
    if (resetVersion > 0) formRef.current?.reset();
  }, [resetVersion]);
  return (
    <form ref={formRef}>
      <Checkbox defaultChecked={defaultChecked}>Accept terms</Checkbox>
    </form>
  );
};

describe('Checkbox', () => {
  it('should pass accessibility compliance', async () => {
    const { container } = render(<Checkbox>Accessible Checkbox</Checkbox>);
    expect(await axe(container)).toHaveNoViolations();
  });
  it('renders correctly', () => {
    render(<Checkbox>Label</Checkbox>);
    expect(screen.getByLabelText('Label')).toBeInTheDocument();
  });

  it('falls back to a native label for an invalid Checkbox.Root asChild host', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Checkbox.Root asChild>
        <div>
          <Checkbox.Input />
          <Checkbox.Control>
            <Checkbox.Indicator />
          </Checkbox.Control>
          <Checkbox.Label>Accept terms</Checkbox.Label>
        </div>
      </Checkbox.Root>,
    );

    expect(container.firstElementChild?.tagName).toBe('LABEL');
    const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' });
    await user.click(screen.getByText('Accept terms'));
    expect(checkbox).toBeChecked();
  });

  it('falls back to a native label for Fragment Checkbox.Root asChild content', () => {
    const { container } = render(
      <Checkbox.Root asChild>
        <>
          <Checkbox.Input />
          <Checkbox.Label>Accept terms</Checkbox.Label>
        </>
      </Checkbox.Root>,
    );

    expect(container.firstElementChild?.tagName).toBe('LABEL');
    expect(screen.getByRole('checkbox', { name: 'Accept terms' })).toBeInTheDocument();
  });

  it('handles switching', async () => {
    const user = userEvent.setup();
    render(<Checkbox>Label</Checkbox>);
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).not.toBeChecked();
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('supports indeterminate state', () => {
    render(<Checkbox indeterminate>Label</Checkbox>);
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.indeterminate).toBe(true);
  });

  it('keeps a controlled indeterminate state after interaction', async () => {
    const user = userEvent.setup();
    render(<Checkbox indeterminate>Label</Checkbox>);

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    await user.click(checkbox);

    expect(checkbox.indeterminate).toBe(true);
  });

  it('supports controlled state', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Checkbox checked={false} onChange={onChange}>
        Label
      </Checkbox>,
    );
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
    await user.click(checkbox);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('retains the latest controlled checked state when becoming uncontrolled', () => {
    const { rerender } = render(<Checkbox checked={false}>Label</Checkbox>);

    rerender(<Checkbox checked>Label</Checkbox>);
    rerender(<Checkbox>Label</Checkbox>);

    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('is disabled when disabled prop is passed', () => {
    render(<Checkbox disabled>Label</Checkbox>);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('does not change when readOnly is passed', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onClickCapture = vi.fn();
    render(
      <Checkbox readOnly onChange={onChange} onClickCapture={onClickCapture}>
        Read-only terms
      </Checkbox>,
    );

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(onChange).not.toHaveBeenCalled();
    expect(onClickCapture).toHaveBeenCalledTimes(1);

    await user.click(checkbox);
    await user.keyboard(' ');
    expect(checkbox).not.toBeChecked();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('suspends native required validation while read-only and restores it when writable', () => {
    const { container, rerender } = render(
      <form>
        <Checkbox name="terms" required readOnly>
          Accept terms
        </Checkbox>
      </form>,
    );
    const form = container.querySelector('form') as HTMLFormElement;
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).not.toHaveAttribute('required');
    expect(checkbox).toHaveAttribute('aria-required', 'true');
    expect(form.checkValidity()).toBe(true);

    rerender(
      <form>
        <Checkbox name="terms" required>
          Accept terms
        </Checkbox>
      </form>,
    );

    expect(screen.getByRole('checkbox')).toBeRequired();
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-required', 'true');
    expect(form.checkValidity()).toBe(false);
  });

  it('sets aria-invalid when error prop is passed', () => {
    render(<Checkbox error>Label</Checkbox>);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('keeps FormControl invalid state when aria-invalid is explicitly false', () => {
    render(
      <FormControl isInvalid>
        <Checkbox aria-invalid={false}>Accept terms</Checkbox>
      </FormControl>,
    );

    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('associates FormControl errors when aria-invalid is explicitly true', () => {
    render(
      <FormControl isInvalid>
        <Checkbox error={false} aria-invalid>
          Accept terms
        </Checkbox>
        <FormHelperText id="terms-help">Required to continue</FormHelperText>
        <FormErrorMessage id="terms-error">Accept the terms</FormErrorMessage>
      </FormControl>,
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-describedby', 'terms-help terms-error');
    expect(checkbox).toHaveAttribute('aria-errormessage', 'terms-error');
  });

  it.each(['grammar', 'spelling'] as const)(
    'associates FormControl errors when aria-invalid is %s',
    (ariaInvalid) => {
      render(
        <FormControl isInvalid>
          <Checkbox error={false} aria-invalid={ariaInvalid}>
            Accept terms
          </Checkbox>
          <FormErrorMessage id="terms-error">Accept the terms</FormErrorMessage>
        </FormControl>,
      );

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-invalid', ariaInvalid);
      expect(checkbox).toHaveAttribute('aria-errormessage', 'terms-error');
    },
  );

  it('synchronizes an uncontrolled checkbox with form reset', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <form>
        <Checkbox defaultChecked>Accept terms</Checkbox>
      </form>,
    );
    const checkbox = screen.getByRole('checkbox');

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
    await act(async () => {
      (container.querySelector('form') as HTMLFormElement).reset();
      await Promise.resolve();
    });
    expect(checkbox).toBeChecked();
  });

  it('uses the latest default for a parent layout reset in the update commit', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <ParentLayoutResetCheckbox defaultChecked={false} resetVersion={0} />,
    );
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    rerender(<ParentLayoutResetCheckbox defaultChecked resetVersion={1} />);

    await act(async () => Promise.resolve());
    expect(checkbox).toBeChecked();
  });

  it('rebinds form reset handling when its external form changes', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <>
        <form id="first-form" />
        <form id="second-form" />
        <Checkbox defaultChecked form="first-form">
          Accept terms
        </Checkbox>
      </>,
    );
    const checkbox = screen.getByRole('checkbox');

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();

    rerender(
      <>
        <form id="first-form" />
        <form id="second-form" />
        <Checkbox defaultChecked form="second-form">
          Accept terms
        </Checkbox>
      </>,
    );

    await act(async () => {
      (document.getElementById('second-form') as HTMLFormElement).reset();
      await Promise.resolve();
    });
    expect(checkbox).toBeChecked();
  });

  it('inherits FormControl state and associations for a standalone checkbox', async () => {
    const user = userEvent.setup();
    render(
      <FormControl id="terms" isInvalid isRequired isDisabled isReadOnly>
        <FormLabel>Terms</FormLabel>
        <Checkbox>Accept terms</Checkbox>
        <FormHelperText>Required to continue</FormHelperText>
        <FormErrorMessage>Accept the terms</FormErrorMessage>
      </FormControl>,
    );

    const checkbox = screen.getByRole('checkbox', { name: 'Terms' });
    const helperTextId = screen.getByText('Required to continue').getAttribute('id');
    const errorMessageId = screen.getByText('Accept the terms').getAttribute('id');
    expect(checkbox).toHaveAttribute('id', 'terms');
    expect(checkbox).toBeDisabled();
    expect(checkbox).toBeRequired();
    expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    expect(checkbox).toHaveAttribute('aria-describedby', `${helperTextId} ${errorMessageId}`);
    expect(checkbox).toHaveAttribute('aria-errormessage', errorMessageId);
    expect(checkbox).toHaveAttribute('aria-readonly', 'true');

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('preserves an explicit aria-errormessage over the FormControl error ID', () => {
    render(
      <FormControl isInvalid>
        <Checkbox aria-errormessage="custom-terms-error">Accept terms</Checkbox>
        <FormErrorMessage>Accept the terms</FormErrorMessage>
      </FormControl>,
    );

    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-errormessage', 'custom-terms-error');
  });

  it('keeps group requirements on its validation proxy rather than every child checkbox', () => {
    render(
      <FormControl isRequired label="Options" labelTarget="group">
        <Checkbox.Group>
          <Checkbox value="a">Option A</Checkbox>
        </Checkbox.Group>
      </FormControl>,
    );

    const label = screen.getByText('Options').closest('label');
    const group = screen.getByRole('group', { name: 'Options' });
    expect(label).not.toHaveAttribute('for');
    expect(group).toHaveAttribute('aria-labelledby');
    expect(document.querySelector('[data-checkbox-group-validation-proxy]')).toBeRequired();
    expect(screen.getByRole('checkbox')).not.toBeRequired();
  });

  it('applies group disabled state to child inputs', () => {
    render(
      <Checkbox.Group disabled>
        <Checkbox value="a">Option A</Checkbox>
      </Checkbox.Group>,
    );

    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('does not allow a child to re-enable a disabled group', () => {
    render(
      <Checkbox.Group disabled>
        <Checkbox disabled={false} value="a">
          Option A
        </Checkbox>
      </Checkbox.Group>,
    );

    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('preserves the input value for native form integration', () => {
    render(<Checkbox value="terms">Accept terms</Checkbox>);

    expect(screen.getByRole('checkbox')).toHaveAttribute('value', 'terms');
  });

  it('preserves checkbox semantics when conflicting runtime props are provided', () => {
    render(<Checkbox {...({ type: 'text' } as never)}>Accept terms</Checkbox>);

    expect(screen.getByRole('checkbox')).toHaveAttribute('type', 'checkbox');
  });

  it('keeps the root value when Checkbox.Input receives a conflicting value', () => {
    render(
      <Checkbox value="terms">
        <Checkbox.Input {...({ value: 'conflicting' } as never)} />
        <Checkbox.Label>Accept terms</Checkbox.Label>
      </Checkbox>,
    );

    screen.getAllByRole('checkbox').forEach((input) => {
      expect(input).toHaveAttribute('value', 'terms');
    });
  });

  it('keeps native checkbox semantics when Checkbox.Input receives conflicting ARIA', () => {
    render(
      <Checkbox>
        <Checkbox.Input
          {...({ 'aria-checked': true, 'aria-disabled': true, role: 'button' } as never)}
        />
        <Checkbox.Label>Accept terms</Checkbox.Label>
      </Checkbox>,
    );

    const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' });
    expect(checkbox).not.toHaveAttribute('aria-checked');
    expect(checkbox).not.toHaveAttribute('aria-disabled');
  });

  it('does not duplicate values in checkbox groups', async () => {
    const user = userEvent.setup();

    const TestComponent = () => {
      const [value, setValue] = useState<string[]>([]);

      return (
        <>
          <Checkbox.Group value={value} onChange={setValue}>
            <Checkbox value="a">Option A</Checkbox>
          </Checkbox.Group>
          <output data-testid="value">{value.join(',')}</output>
        </>
      );
    };

    render(<TestComponent />);

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);
    await user.click(checkbox);
    await user.click(checkbox);

    expect(screen.getByTestId('value')).toHaveTextContent('a');
  });
});
