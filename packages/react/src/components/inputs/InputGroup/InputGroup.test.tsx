import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { InputGroup, InputLeftAddon } from './index';

describe('InputGroup', () => {
  it('has no accessibility violations for compound slots', async () => {
    const { container } = render(
      <InputGroup>
        <InputGroup.LeftAddon>https://</InputGroup.LeftAddon>
        <InputGroup.Input aria-label="Website" />
        <InputGroup.RightAddon>USD</InputGroup.RightAddon>
      </InputGroup>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it('keeps the group size as the source of truth for InputGroup.Input', () => {
    render(
      <>
        <InputGroup size="lg">
          <InputLeftAddon>https://</InputLeftAddon>
          <InputGroup.Input data-testid="baseline" aria-label="Baseline input" />
        </InputGroup>
        <InputGroup size="lg">
          <InputLeftAddon>https://</InputLeftAddon>
          <InputGroup.Input data-testid="override" aria-label="Override input" size="sm" />
        </InputGroup>
      </>,
    );

    expect(screen.getByTestId('override').className).toBe(screen.getByTestId('baseline').className);
  });

  it('supports static compound slot components', () => {
    render(
      <InputGroup>
        <InputGroup.LeftAddon>https://</InputGroup.LeftAddon>
        <InputGroup.LeftElement>@</InputGroup.LeftElement>
        <InputGroup.Input aria-label="Website" />
        <InputGroup.RightElement>.com</InputGroup.RightElement>
        <InputGroup.RightAddon>USD</InputGroup.RightAddon>
      </InputGroup>,
    );

    expect(screen.getByText('https://')).toBeInTheDocument();
    expect(screen.getByText('@')).toBeInTheDocument();
    expect(screen.getByLabelText('Website')).toHaveAttribute('data-has-left-addon');
    expect(screen.getByText('.com')).toBeInTheDocument();
    expect(screen.getByText('USD')).toBeInTheDocument();
  });
});
