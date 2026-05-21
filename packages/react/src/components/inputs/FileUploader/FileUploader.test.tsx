import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { FileUploader } from './FileUploader';

/**
 * ### Test Strategy: FileUploader
 * - **Focus**: Drop zone rendering, file selection via hidden input, file list rendering,
 *   remove button functionality, and `onChange` callback.
 * - **DON'T**: Do not assert CSS class names or visual styles — use Storybook for visual regression.
 * - **Note**: `fireEvent.change` is used intentionally for the hidden file `<input>` — JSDOM does not
 *   support real file dialog interactions, and `userEvent.upload` requires a visible input.
 */
describe('FileUploader', () => {
  it('renders the drop zone with helper text', () => {
    render(<FileUploader />);
    expect(screen.getByText('Drag & drop files here, or click to select')).toBeInTheDocument();
  });

  it('labels the hidden input and exposes the drop zone as a keyboard trigger', () => {
    render(<FileUploader />);
    const input = screen.getByLabelText('Select files');
    const clickSpy = vi.spyOn(input, 'click').mockImplementation(() => undefined);
    const dropZone = screen.getByRole('button', {
      name: 'Drag & drop files here, or click to select',
    });

    fireEvent.keyDown(dropZone, { key: 'Enter' });
    fireEvent.keyDown(dropZone, { key: ' ' });

    expect(clickSpy).toHaveBeenCalledTimes(2);
  });

  it('preserves file picker behavior when zone handlers are provided', () => {
    render(
      <FileUploader.Root>
        <FileUploader.Zone
          helperText="Upload"
          className="custom-zone"
          onClick={vi.fn()}
          onKeyDown={vi.fn()}
        />
      </FileUploader.Root>,
    );
    const input = screen.getByLabelText('Select files');
    const clickSpy = vi.spyOn(input, 'click').mockImplementation(() => undefined);
    const dropZone = screen.getByRole('button', { name: 'Upload' });

    expect(dropZone).toHaveClass('custom-zone');

    fireEvent.click(dropZone);
    fireEvent.keyDown(dropZone, { key: 'Enter' });

    expect(clickSpy).toHaveBeenCalledTimes(2);
  });

  it('allows zone handlers to cancel internal behavior', () => {
    render(
      <FileUploader.Root>
        <FileUploader.Zone
          helperText="Upload"
          onClick={(e) => e.preventDefault()}
          onKeyDown={(e) => e.preventDefault()}
          onDrop={(e) => e.preventDefault()}
        />
      </FileUploader.Root>,
    );
    const input = screen.getByLabelText('Select files');
    const clickSpy = vi.spyOn(input, 'click').mockImplementation(() => undefined);
    const dropZone = screen.getByRole('button', { name: 'Upload' });
    const file = new File(['content'], 'drop.pdf', { type: 'application/pdf' });

    fireEvent.click(dropZone);
    fireEvent.keyDown(dropZone, { key: 'Enter' });
    fireEvent.drop(dropZone, { dataTransfer: { files: [file] } });

    expect(clickSpy).not.toHaveBeenCalled();
    expect(screen.queryByText('drop.pdf')).not.toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<FileUploader />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders with custom helper text', () => {
    render(<FileUploader helperText="Drop PDF here" />);
    expect(screen.getByText('Drop PDF here')).toBeInTheDocument();
  });

  it('calls onChange and shows file name when a file is selected', () => {
    const handleChange = vi.fn();
    render(<FileUploader onChange={handleChange} />);

    const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });
    fireEvent.change(screen.getByTestId('file-input'), { target: { files: [file] } });

    expect(handleChange).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ name: 'document.pdf' })]),
    );
    expect(screen.getByText('document.pdf')).toBeInTheDocument();
  });

  it('accepts dropped files and exposes drag-active state', () => {
    const handleChange = vi.fn();
    render(<FileUploader onChange={handleChange} />);

    const dropZone = screen.getByRole('button', {
      name: 'Drag & drop files here, or click to select',
    });
    const file = new File(['content'], 'drop.pdf', { type: 'application/pdf' });

    fireEvent.dragOver(dropZone);
    expect(dropZone).toHaveAttribute('data-drag');

    fireEvent.drop(dropZone, { dataTransfer: { files: [file] } });

    expect(dropZone).not.toHaveAttribute('data-drag');
    expect(handleChange).toHaveBeenCalledWith([file]);
    expect(screen.getByText('drop.pdf')).toBeInTheDocument();
  });

  it('filters files by accept and maxSize for programmatic selection', () => {
    const handleChange = vi.fn();
    render(<FileUploader accept="image/png" maxSize={5} onChange={handleChange} />);

    const pdf = new File(['content'], 'document.pdf', { type: 'application/pdf' });
    const largePng = new File(['too-large'], 'large.png', { type: 'image/png' });
    const smallPng = new File(['ok'], 'small.png', { type: 'image/png' });

    fireEvent.change(screen.getByTestId('file-input'), {
      target: { files: [pdf, largePng, smallPng] },
    });

    expect(handleChange).toHaveBeenCalledWith([smallPng]);
    expect(screen.getByText('small.png')).toBeInTheDocument();
    expect(screen.queryByText('document.pdf')).not.toBeInTheDocument();
    expect(screen.queryByText('large.png')).not.toBeInTheDocument();
  });

  it('removes a file when the remove button is clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<FileUploader onChange={handleChange} />);

    const file = new File(['content'], 'report.pdf', { type: 'application/pdf' });
    fireEvent.change(screen.getByTestId('file-input'), { target: { files: [file] } });
    expect(screen.getByText('report.pdf')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Remove file' }));
    expect(screen.queryByText('report.pdf')).not.toBeInTheDocument();
    expect(handleChange).toHaveBeenLastCalledWith([]);
  });

  it('does not show file list when no files are selected', () => {
    render(<FileUploader />);
    expect(screen.queryByRole('button', { name: 'Remove file' })).not.toBeInTheDocument();
  });
});
