import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Avatar } from '@/components/data-display/Avatar';
import { Skeleton } from '@/components/feedback/Skeleton';
import { Button } from '@/components/inputs/Button';
import { ButtonPrimitive } from '@/components/inputs/ButtonPrimitive';
import { FormControl } from '@/components/inputs/FormControl';
import { PressablePrimitive } from '@/components/inputs/PressablePrimitive';
import { Navbar, NavbarBrand, NavbarLink } from '@/components/navigation/Navbar';
import { Link } from '@/components/typography/Link';

describe('constrained asChild host contracts', () => {
  it('owns the FormControl role and safely falls label delegation back to a div', () => {
    const delegatedRef = createRef<HTMLElement>();
    const { unmount } = render(
      <FormControl asChild ref={delegatedRef}>
        <section data-testid="field-group" role="presentation" />
      </FormControl>,
    );

    expect(delegatedRef.current).toBe(screen.getByTestId('field-group'));
    expect(delegatedRef.current).toHaveAttribute('role', 'group');

    unmount();
    render(
      <FormControl
        {...({
          asChild: true,
          label: 'Email',
          children: <section data-testid="labelled-field" />,
        } as never)}
      />,
    );

    const labelledField = screen.getByTestId('labelled-field');
    expect(labelledField.parentElement?.tagName).toBe('DIV');
    expect(labelledField.parentElement).toHaveAttribute('role', 'group');
    expect(screen.getByText('Email').tagName).toBe('LABEL');
  });

  it('forwards Avatar and Skeleton refs while retaining managed state', () => {
    const avatarRef = createRef<HTMLElement>();
    const skeletonRef = createRef<HTMLElement>();

    render(
      <>
        <Avatar.Root
          {...({
            asChild: true,
            ref: avatarRef,
            decorative: true,
            'data-status': 'error',
            children: <div data-testid="avatar-host" data-status="loaded" aria-hidden={false} />,
          } as never)}
        />
        <Skeleton asChild ref={skeletonRef}>
          <output data-testid="skeleton-host" aria-hidden={false} />
        </Skeleton>
      </>,
    );

    expect(avatarRef.current).toBe(screen.getByTestId('avatar-host'));
    expect(avatarRef.current).toHaveAttribute('data-status', 'loading');
    expect(avatarRef.current).toHaveAttribute('aria-hidden', 'true');
    expect(skeletonRef.current).toBe(screen.getByTestId('skeleton-host'));
    expect(skeletonRef.current).toHaveAttribute('aria-hidden', 'true');
    expect(skeletonRef.current).toHaveAttribute('inert');
  });

  it('forwards refs to each link host branch', () => {
    const anchorRef = createRef<HTMLAnchorElement>();
    const spanRef = createRef<HTMLSpanElement>();
    const routerRef = createRef<HTMLElement>();
    const brandSpanRef = createRef<HTMLSpanElement>();
    const navbarAnchorRef = createRef<HTMLAnchorElement>();

    render(
      <>
        <Link href="/docs" ref={anchorRef}>
          Docs
        </Link>
        <Link ref={spanRef}>Details</Link>
        <Link asChild ref={routerRef}>
          <a href="/router">Router</a>
        </Link>
        <Navbar>
          <NavbarBrand ref={brandSpanRef}>Poffy</NavbarBrand>
          <NavbarLink href="/home" ref={navbarAnchorRef}>
            Home
          </NavbarLink>
        </Navbar>
      </>,
    );

    expect(anchorRef.current).toBe(screen.getByRole('link', { name: 'Docs' }));
    expect(spanRef.current).toBe(screen.getByText('Details'));
    expect(routerRef.current).toBe(screen.getByRole('link', { name: 'Router' }));
    expect(brandSpanRef.current).toBe(screen.getByText('Poffy'));
    expect(navbarAnchorRef.current).toBe(screen.getByRole('link', { name: 'Home' }));
  });

  it('retargets action refs and composes each Slot click handler once', () => {
    const buttonRef = createRef<HTMLElement>();
    const primitiveRef = createRef<HTMLElement>();
    const pressableRef = createRef<HTMLElement>();
    const ownerClick = vi.fn();
    const childClick = vi.fn();

    render(
      <>
        <Button asChild ref={buttonRef} onClick={ownerClick}>
          <a href="/button" onClick={childClick}>
            Button link
          </a>
        </Button>
        <ButtonPrimitive asChild ref={primitiveRef}>
          <a href="/primitive">Primitive link</a>
        </ButtonPrimitive>
        <PressablePrimitive asChild ref={pressableRef}>
          <a href="/pressable">Pressable link</a>
        </PressablePrimitive>
      </>,
    );

    fireEvent.click(screen.getByRole('link', { name: 'Button link' }));

    expect(buttonRef.current).toBe(screen.getByRole('link', { name: 'Button link' }));
    expect(primitiveRef.current).toBe(screen.getByRole('link', { name: 'Primitive link' }));
    expect(pressableRef.current).toBe(screen.getByRole('link', { name: 'Pressable link' }));
    expect(ownerClick).toHaveBeenCalledTimes(1);
    expect(childClick).toHaveBeenCalledTimes(1);
  });
});
