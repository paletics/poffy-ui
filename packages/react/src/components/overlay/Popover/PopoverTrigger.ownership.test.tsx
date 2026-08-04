import { fireEvent, render, screen } from '@testing-library/react';
import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from './index';

describe('PopoverTrigger ownership', () => {
  it('clears delegated custom-button state when the trigger is enabled', () => {
    const CustomButton = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<'button'>>(
      (props, ref) => <button ref={ref} {...props} />,
    );
    CustomButton.displayName = 'CustomButton';

    render(
      <Popover>
        <PopoverTrigger asChild>
          <CustomButton disabled aria-disabled="true" tabIndex={-1}>
            Open details
          </CustomButton>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Details</PopoverTitle>
        </PopoverContent>
      </Popover>,
    );

    const trigger = screen.getByRole('button', { name: 'Open details' });
    expect(trigger).not.toBeDisabled();
    expect(trigger).not.toHaveAttribute('aria-disabled');
    expect(trigger).toHaveAttribute('tabindex', '0');
    fireEvent.click(trigger);
    expect(screen.getByRole('dialog', { name: 'Details' })).toBeInTheDocument();
  });

  it('preserves a rejected custom trigger accessible name on its fallback button', () => {
    const CustomLink = forwardRef<
      HTMLAnchorElement,
      Omit<ComponentPropsWithoutRef<'a'>, 'href'> & { to?: string }
    >(({ to, ...props }, ref) => <a ref={ref} href={to} {...props} />);
    CustomLink.displayName = 'CustomLink';

    render(
      <Popover>
        <PopoverTrigger asChild>
          <CustomLink to="/details" aria-label="Named details" />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Details</PopoverTitle>
        </PopoverContent>
      </Popover>,
    );

    const trigger = screen.getByRole('button', { name: 'Named details' });
    expect(trigger).toBeEmptyDOMElement();
    fireEvent.click(trigger);
    expect(screen.getByRole('dialog', { name: 'Details' })).toBeInTheDocument();
  });

  it('preserves an external labelledby name on a rejected custom trigger', () => {
    const CustomLink = forwardRef<
      HTMLAnchorElement,
      Omit<ComponentPropsWithoutRef<'a'>, 'href'> & { to?: string }
    >(({ to, ...props }, ref) => <a ref={ref} href={to} {...props} />);
    CustomLink.displayName = 'CustomLink';

    render(
      <>
        <span id="external-popover-name">External details</span>
        <Popover>
          <PopoverTrigger asChild>
            <CustomLink to="/details" aria-labelledby="external-popover-name" />
          </PopoverTrigger>
          <PopoverContent>
            <PopoverTitle>Details</PopoverTitle>
          </PopoverContent>
        </Popover>
      </>,
    );

    const trigger = screen.getByRole('button', { name: 'External details' });
    expect(trigger).toHaveAttribute('aria-labelledby', 'external-popover-name');
    expect(trigger).not.toHaveAttribute('aria-label');
  });
});
