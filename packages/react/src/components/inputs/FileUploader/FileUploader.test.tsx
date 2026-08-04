import { act, render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { useLayoutEffect, useRef, useState, type ComponentProps } from 'react';
import { FileUploader } from './FileUploader';
import { FormControl, FormErrorMessage, FormHelperText, FormLabel } from '../FormControl';
import { LocaleProvider, useLocale } from '@/providers/LocaleProvider';

const LocaleSwitchingUploader = ({ onReject }: { onReject: ReturnType<typeof vi.fn> }) => {
  const { setLocale } = useLocale();
  return (
    <>
      <button type="button" onClick={() => setLocale('ja-JP')}>
        Japanese
      </button>
      <FileUploader accept="image/png" onReject={onReject} />
    </>
  );
};

const ParentLayoutFormDataUploader = ({
  file,
  onFormData,
}: {
  file: File;
  onFormData: (formData: FormData) => void;
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  useLayoutEffect(() => {
    const event = new Event('formdata');
    const formData = new FormData();
    Object.defineProperty(event, 'formData', { value: formData });
    formRef.current?.dispatchEvent(event);
    onFormData(formData);
  }, [onFormData]);

  return (
    <form ref={formRef}>
      <FileUploader name="attachments" defaultFiles={[file]} />
    </form>
  );
};

const ParentLayoutResetUploader = ({
  defaultFiles,
  onChange,
  resetVersion,
}: {
  defaultFiles: File[];
  onChange: (files: File[]) => void;
  resetVersion: number;
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  useLayoutEffect(() => {
    if (resetVersion > 0) formRef.current?.reset();
  }, [resetVersion]);

  return (
    <form ref={formRef}>
      <FileUploader defaultFiles={defaultFiles} onChange={onChange} />
    </form>
  );
};

/**
 * ### Test Strategy: FileUploader
 * - **Focus**: Drop zone rendering, file selection via hidden input, file list rendering,
 *   remove button functionality, and `onChange` callback.
 * - **DON'T**: Do not assert CSS class names or visual styles — use Storybook for visual regression.
 * - **Note**: `fireEvent.change` is used intentionally for the hidden file `<input>` — JSDOM does not
 *   support real file dialog interactions, and `userEvent.upload` requires a visible input.
 */
describe('FileUploader', () => {
  it('forwards a root aria-label to its interactive file controls', () => {
    const { container } = render(<FileUploader required aria-label="Add invoice files" />);

    expect(screen.getByRole('button', { name: 'Add invoice files' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add invoice files' })).toHaveAccessibleDescription(
      'Required',
    );
    expect(screen.getByTestId('file-input')).toHaveAttribute('aria-label', 'Add invoice files');
    expect(screen.getByTestId('file-input')).toHaveAccessibleDescription('Required');
    expect(
      container.querySelector<HTMLInputElement>('[data-file-uploader-validation-proxy]'),
    ).toHaveAttribute('aria-hidden', 'true');
  });

  it('forwards a root aria-labelledby to its interactive file controls', () => {
    const { container } = render(
      <>
        <span id="invoice-files-label">Add invoice files</span>
        <FileUploader required aria-labelledby="invoice-files-label" />
      </>,
    );

    expect(screen.getByRole('button', { name: 'Add invoice files' })).toHaveAttribute(
      'aria-labelledby',
      'invoice-files-label',
    );
    expect(screen.getByTestId('file-input')).toHaveAttribute(
      'aria-labelledby',
      'invoice-files-label',
    );
    expect(
      container.querySelector<HTMLInputElement>('[data-file-uploader-validation-proxy]'),
    ).toHaveAttribute('aria-hidden', 'true');
  });

  it('appends selected files to its associated form data', () => {
    const file = new File(['contents'], 'report.txt', { type: 'text/plain' });
    const { container } = render(
      <form>
        <FileUploader name="attachments" defaultFiles={[file]} />
      </form>,
    );
    const form = container.querySelector('form') as HTMLFormElement;
    const event = new Event('formdata');
    const formData = new FormData();
    Object.defineProperty(event, 'formData', { value: formData });

    form.dispatchEvent(event);

    expect(formData.getAll('attachments')).toEqual([file]);
  });

  it('subscribes before a parent layout effect creates form data', () => {
    const file = new File(['contents'], 'report.txt', { type: 'text/plain' });
    const onFormData = vi.fn();

    render(<ParentLayoutFormDataUploader file={file} onFormData={onFormData} />);

    expect(onFormData).toHaveBeenCalledOnce();
    expect(onFormData.mock.calls[0]?.[0].getAll('attachments')).toEqual([file]);
  });

  it('exposes a newly selected file to synchronous form data created from onChange', () => {
    const file = new File(['contents'], 'report.txt', { type: 'text/plain' });
    let submittedFormData: FormData | undefined;
    let form: HTMLFormElement | null = null;
    const onChange = () => {
      const event = new Event('formdata');
      submittedFormData = new FormData();
      Object.defineProperty(event, 'formData', { value: submittedFormData });
      form?.dispatchEvent(event);
    };
    const { container } = render(
      <form>
        <FileUploader name="attachments" onChange={onChange} />
      </form>,
    );
    form = container.querySelector('form')!;

    fireEvent.change(screen.getByTestId('file-input'), { target: { files: [file] } });

    expect(submittedFormData?.getAll('attachments')).toEqual([file]);
  });

  it('rebinds form data submission when an external form mounts late or is replaced', async () => {
    const file = new File(['contents'], 'report.txt', { type: 'text/plain' });
    const { container, rerender } = render(
      <FileUploader form="upload-form" name="attachments" defaultFiles={[file]} />,
    );

    rerender(
      <>
        <form id="upload-form" data-version="first" />
        <FileUploader form="upload-form" name="attachments" defaultFiles={[file]} />
      </>,
    );
    const anchor = container.querySelector<HTMLFieldSetElement>('[data-form-control-anchor]')!;
    await waitFor(() =>
      expect(anchor.form).toBe(container.querySelector('form[data-version="first"]')),
    );
    const firstForm = container.querySelector<HTMLFormElement>('form[data-version="first"]')!;

    rerender(
      <>
        <form key="replacement" id="upload-form" data-version="second" />
        <FileUploader form="upload-form" name="attachments" defaultFiles={[file]} />
      </>,
    );
    const secondForm = container.querySelector<HTMLFormElement>('form[data-version="second"]')!;
    await waitFor(() => expect(anchor.form).toBe(secondForm));

    const staleFormData = new FormData();
    const staleEvent = new Event('formdata');
    Object.defineProperty(staleEvent, 'formData', { value: staleFormData });
    firstForm.dispatchEvent(staleEvent);
    expect(staleFormData.getAll('attachments')).toEqual([]);

    const currentFormData = new FormData();
    const currentEvent = new Event('formdata');
    Object.defineProperty(currentEvent, 'formData', { value: currentFormData });
    secondForm.dispatchEvent(currentEvent);
    expect(currentFormData.getAll('attachments')).toEqual([file]);
  });

  it('inherits disabled fieldset behavior for interaction and form data', async () => {
    const file = new File(['contents'], 'report.txt', { type: 'text/plain' });
    const { container, rerender } = render(
      <form>
        <fieldset disabled>
          <FileUploader name="attachments" defaultFiles={[file]} />
        </fieldset>
      </form>,
    );
    const form = container.querySelector('form')!;

    await waitFor(() => expect(screen.getByTestId('file-input')).toBeDisabled());
    const disabledFormData = new FormData();
    const disabledEvent = new Event('formdata');
    Object.defineProperty(disabledEvent, 'formData', { value: disabledFormData });
    form.dispatchEvent(disabledEvent);
    expect(disabledFormData.getAll('attachments')).toEqual([]);

    rerender(
      <form>
        <fieldset>
          <FileUploader name="attachments" defaultFiles={[file]} />
        </fieldset>
      </form>,
    );
    await waitFor(() => expect(screen.getByTestId('file-input')).not.toBeDisabled());
    const enabledFormData = new FormData();
    const enabledEvent = new Event('formdata');
    Object.defineProperty(enabledEvent, 'formData', { value: enabledFormData });
    form.dispatchEvent(enabledEvent);
    expect(enabledFormData.getAll('attachments')).toEqual([file]);
  });

  it.each(['input selection', 'drop'] as const)(
    'blocks %s immediately when an ancestor fieldset becomes disabled',
    (interaction) => {
      const initial = new File(['initial'], 'initial.txt', { type: 'text/plain' });
      const attempted = new File(['attempted'], 'attempted.txt', { type: 'text/plain' });
      const onChange = vi.fn();
      const { container } = render(
        <form>
          <fieldset data-testid="ancestor-fieldset">
            <FileUploader
              multiple
              name="attachments"
              defaultFiles={[initial]}
              onChange={onChange}
            />
          </fieldset>
        </form>,
      );
      const ancestorFieldset = screen.getByTestId('ancestor-fieldset') as HTMLFieldSetElement;
      const input = screen.getByTestId('file-input');
      const zone = screen.getByRole('button', {
        name: 'Drag & drop files here, or click to select',
      });

      ancestorFieldset.disabled = true;
      if (interaction === 'input selection') {
        fireEvent.change(input, { target: { files: [attempted] } });
      } else {
        fireEvent.drop(zone, { dataTransfer: { files: [attempted] } });
      }

      expect(onChange).not.toHaveBeenCalled();
      expect(screen.getByText('initial.txt')).toBeInTheDocument();
      expect(screen.queryByText('attempted.txt')).not.toBeInTheDocument();

      ancestorFieldset.disabled = false;
      const formData = new FormData();
      const formDataEvent = new Event('formdata');
      Object.defineProperty(formDataEvent, 'formData', { value: formData });
      container.querySelector('form')?.dispatchEvent(formDataEvent);
      expect(formData.getAll('attachments')).toEqual([initial]);
    },
  );

  it.each([
    [
      'directly',
      <FileUploader
        key="directly"
        disabled
        name="attachments"
        defaultFiles={[new File(['x'], 'a.txt')]}
      />,
    ],
    [
      'through FormControl',
      <FormControl key="form-control" isDisabled>
        <FileUploader name="attachments" defaultFiles={[new File(['x'], 'a.txt')]} />
      </FormControl>,
    ],
  ])('does not append files to form data when disabled %s', (_source, uploader) => {
    const { container } = render(<form>{uploader}</form>);
    const form = container.querySelector('form') as HTMLFormElement;
    const event = new Event('formdata');
    const formData = new FormData();
    Object.defineProperty(event, 'formData', { value: formData });

    form.dispatchEvent(event);

    expect(formData.getAll('attachments')).toEqual([]);
  });

  it('locks file mutations while retaining existing files for read-only form submission', () => {
    const initialFile = new File(['initial'], 'initial.txt', { type: 'text/plain' });
    const replacementFile = new File(['replacement'], 'replacement.txt', { type: 'text/plain' });
    const onChange = vi.fn();
    const { container } = render(
      <form>
        <FileUploader
          readOnly
          multiple
          name="attachments"
          defaultFiles={[initialFile]}
          onChange={onChange}
        />
      </form>,
    );
    const zone = screen.getByRole('button', {
      name: 'Drag & drop files here, or click to select',
    });
    const input = screen.getByTestId('file-input');

    expect(input).toBeDisabled();
    expect(zone).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('button', { name: 'Remove initial.txt' })).toBeDisabled();
    fireEvent.change(input, { target: { files: [replacementFile] } });
    fireEvent.drop(zone, { dataTransfer: { files: [replacementFile] } });
    const blockedDrop = new Event('drop', { bubbles: true, cancelable: true });
    fireEvent(zone, blockedDrop);
    fireEvent.click(screen.getByRole('button', { name: 'Remove initial.txt' }));

    expect(blockedDrop.defaultPrevented).toBe(true);
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByText('initial.txt')).toBeInTheDocument();
    expect(screen.queryByText('replacement.txt')).not.toBeInTheDocument();

    const form = container.querySelector('form') as HTMLFormElement;
    const event = new Event('formdata');
    const formData = new FormData();
    Object.defineProperty(event, 'formData', { value: formData });
    form.dispatchEvent(event);

    expect(formData.getAll('attachments')).toEqual([initialFile]);
  });

  it('validates required selection through a form-associated proxy', () => {
    const file = new File(['contents'], 'report.txt', { type: 'text/plain' });
    const { container } = render(
      <form>
        <FileUploader required name="attachments" />
      </form>,
    );
    const nativeInput = screen.getByTestId('file-input');
    const proxy = container.querySelector<HTMLInputElement>(
      '[data-file-uploader-validation-proxy]',
    );

    expect(nativeInput).not.toBeRequired();
    expect(proxy).toBeRequired();
    expect(proxy).toBeInvalid();
    fireEvent.change(nativeInput, { target: { files: [file] } });
    expect(proxy).toBeValid();
    fireEvent.click(screen.getByRole('button', { name: 'Remove report.txt' }));
    expect(proxy).toBeInvalid();
  });

  it('associates required validation with an external form', () => {
    const { container } = render(
      <>
        <form id="upload-form" />
        <FileUploader required form="upload-form" />
      </>,
    );
    const form = container.querySelector<HTMLFormElement>('#upload-form');
    const proxy = container.querySelector<HTMLInputElement>(
      '[data-file-uploader-validation-proxy]',
    );

    expect(proxy?.form).toBe(form);
    expect(form?.checkValidity()).toBe(false);
  });

  it.each([
    ['directly', <FileUploader key="directly" readOnly required />],
    [
      'through FormControl',
      <FormControl key="form-control" isReadOnly isRequired>
        <FileUploader />
      </FormControl>,
    ],
  ])('excludes read-only required validation %s', (_source, uploader) => {
    const { container } = render(<form>{uploader}</form>);
    const form = container.querySelector('form') as HTMLFormElement;
    const proxy = container.querySelector<HTMLInputElement>(
      '[data-file-uploader-validation-proxy]',
    );

    expect(proxy).toBeDisabled();
    expect(form.checkValidity()).toBe(true);
  });

  it('allows an explicit readOnly false prop to override FormControl', () => {
    const { container } = render(
      <form>
        <FormControl isReadOnly isRequired>
          <FileUploader readOnly={false} />
        </FormControl>
      </form>,
    );
    const proxy = container.querySelector<HTMLInputElement>(
      '[data-file-uploader-validation-proxy]',
    );

    expect(screen.getByTestId('file-input')).not.toBeDisabled();
    expect(proxy).not.toBeDisabled();
    expect(proxy).toBeInvalid();
  });

  it('restores initial files and submitted form data when its form resets', async () => {
    const user = userEvent.setup();
    const initialFile = new File(['initial'], 'initial.txt', { type: 'text/plain' });
    const selectedFile = new File(['selected'], 'selected.txt', { type: 'text/plain' });
    const onChange = vi.fn();
    const { container } = render(
      <form>
        <FileUploader name="attachments" defaultFiles={[initialFile]} onChange={onChange} />
        <button type="reset">Reset</button>
      </form>,
    );
    const form = container.querySelector('form') as HTMLFormElement;

    fireEvent.change(screen.getByTestId('file-input'), { target: { files: [selectedFile] } });
    expect(screen.getByText('selected.txt')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(screen.getByText('initial.txt')).toBeInTheDocument();
    expect(onChange).toHaveBeenLastCalledWith([initialFile]);

    const event = new Event('formdata');
    const formData = new FormData();
    Object.defineProperty(event, 'formData', { value: formData });
    form.dispatchEvent(event);
    expect(formData.getAll('attachments')).toEqual([initialFile]);
  });
  it('respects cancelled form resets and latest normalized defaults', async () => {
    const initial = new File(['initial'], 'initial.txt', { type: 'text/plain' });
    const selected = new File(['selected'], 'selected.txt', { type: 'text/plain' });
    const onChange = vi.fn();
    const { container, rerender } = render(
      <form onReset={(event) => event.preventDefault()}>
        <FileUploader defaultFiles={[initial]} onChange={onChange} />
      </form>,
    );
    fireEvent.change(screen.getByTestId('file-input'), { target: { files: [selected] } });
    onChange.mockClear();
    await act(async () => {
      (container.querySelector('form') as HTMLFormElement).reset();
      await Promise.resolve();
    });
    expect(screen.getByText('selected.txt')).toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();

    const image = new File(['image'], 'image.png', { type: 'image/png' });
    rerender(
      <form>
        <FileUploader defaultFiles={[image]} accept="image/png" onChange={onChange} />
      </form>,
    );
    await act(async () => {
      (container.querySelector('form') as HTMLFormElement).reset();
      await Promise.resolve();
    });
    expect(screen.getByText('image.png')).toBeInTheDocument();
  });

  it('uses the latest normalized defaults for a parent layout reset in the update commit', async () => {
    const initial = new File(['initial'], 'initial.txt', { type: 'text/plain' });
    const selected = new File(['selected'], 'selected.txt', { type: 'text/plain' });
    const latest = new File(['latest'], 'latest.png', { type: 'image/png' });
    const onChange = vi.fn();
    const { rerender } = render(
      <ParentLayoutResetUploader defaultFiles={[initial]} onChange={onChange} resetVersion={0} />,
    );
    fireEvent.change(screen.getByTestId('file-input'), { target: { files: [selected] } });

    rerender(
      <ParentLayoutResetUploader defaultFiles={[latest]} onChange={onChange} resetVersion={1} />,
    );

    await waitFor(() => expect(screen.getByText('latest.png')).toBeInTheDocument());
    expect(onChange).toHaveBeenLastCalledWith([latest]);
  });

  it('finishes an accepted reset across subscription churn with the latest callback', async () => {
    const initial = new File(['initial'], 'initial.txt', { type: 'text/plain' });
    const selected = new File(['selected'], 'selected.txt', { type: 'text/plain' });
    const firstOnChange = vi.fn();
    const latestOnChange = vi.fn();
    const { container, rerender } = render(
      <form>
        <FileUploader name="attachments" defaultFiles={[initial]} onChange={firstOnChange} />
      </form>,
    );
    fireEvent.change(screen.getByTestId('file-input'), { target: { files: [selected] } });
    firstOnChange.mockClear();
    const form = container.querySelector('form') as HTMLFormElement;

    form.dispatchEvent(new Event('reset', { bubbles: true, cancelable: true }));
    rerender(
      <form>
        <FileUploader
          name="updated-attachments"
          defaultFiles={[initial]}
          onChange={latestOnChange}
        />
      </form>,
    );
    await act(async () => Promise.resolve());

    expect(screen.getByText('initial.txt')).toBeInTheDocument();
    expect(firstOnChange).not.toHaveBeenCalled();
    expect(latestOnChange).toHaveBeenCalledWith([initial]);
  });

  it('drops an accepted reset callback when the uploader unmounts during reset', async () => {
    const initial = new File(['initial'], 'initial.txt', { type: 'text/plain' });
    const onChange = vi.fn();
    const ResetUnmountHarness = () => {
      const [mounted, setMounted] = useState(true);
      return (
        <form onReset={() => setMounted(false)}>
          {mounted && <FileUploader defaultFiles={[initial]} onChange={onChange} />}
        </form>
      );
    };
    const { container } = render(<ResetUnmountHarness />);

    await act(async () => {
      (container.querySelector('form') as HTMLFormElement).reset();
      await Promise.resolve();
    });

    expect(screen.queryByTestId('file-input')).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('inherits FormControl state and error associations', async () => {
    const { container } = render(
      <FormControl id="attachment" isDisabled isInvalid isRequired>
        <FormLabel>Attachment</FormLabel>
        <FileUploader />
        <FormHelperText id="attachment-help">Upload a document.</FormHelperText>
        <FormErrorMessage id="attachment-error">Attachment is required.</FormErrorMessage>
      </FormControl>,
    );
    const zone = screen.getByRole('button', { name: 'Attachment' });
    const input = screen.getByTestId('file-input');
    expect(input).toBeDisabled();
    expect(zone).toHaveAttribute('aria-disabled', 'true');
    expect(zone.getAttribute('aria-describedby')?.split(' ')).toEqual(
      expect.arrayContaining(['attachment-help', 'attachment-error']),
    );
    expect(zone).toHaveAccessibleDescription('Upload a document. Attachment is required. Required');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input.getAttribute('aria-describedby')?.split(' ')).toEqual(
      expect.arrayContaining(['attachment-help', 'attachment-error']),
    );
    expect(input).toHaveAccessibleDescription(
      'Upload a document. Attachment is required. Required',
    );
    expect(input).toHaveAttribute('aria-errormessage', 'attachment-error');
    expect(input).not.toBeRequired();
    const validationProxy = document.querySelector('[data-file-uploader-validation-proxy]');
    expect(validationProxy).toBeRequired();
    expect(validationProxy).toHaveAttribute('aria-hidden', 'true');
    expect(validationProxy).not.toHaveAttribute('aria-label');
    expect(validationProxy).not.toHaveAttribute('aria-labelledby');
    expect(validationProxy).not.toHaveAttribute('aria-describedby');
    expect(validationProxy).not.toHaveAttribute('aria-errormessage');
    expect(validationProxy).not.toHaveAttribute('aria-invalid');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('shares one native input and validation proxy across multiple zones', async () => {
    const file = new File(['content'], 'report.pdf', { type: 'application/pdf' });
    const { container } = render(
      <form>
        <FileUploader.Root id="attachments" multiple required>
          <FileUploader.Zone aria-label="Primary upload" />
          <FileUploader.Zone aria-label="Secondary upload" />
          <FileUploader.List />
        </FileUploader.Root>
      </form>,
    );

    expect(container.querySelectorAll('input[type="file"]')).toHaveLength(1);
    expect(container.querySelectorAll('#attachments')).toHaveLength(1);
    expect(container.querySelectorAll('[data-file-uploader-validation-proxy]')).toHaveLength(1);
    expect(container.querySelector('form')?.reportValidity()).toBe(false);

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Primary upload' })).toHaveFocus(),
    );
    fireEvent.drop(screen.getByRole('button', { name: 'Secondary upload' }), {
      dataTransfer: { files: [file] },
    });

    expect(screen.getByText('report.pdf')).toBeInTheDocument();
  });
  it('renders the drop zone with helper text', () => {
    render(<FileUploader />);
    expect(screen.getByText('Drag & drop files here, or click to select')).toBeInTheDocument();
  });

  it('uses Japanese defaults from a case-insensitive explicit locale', () => {
    const file = new File(['content'], 'report.pdf', { type: 'application/pdf' });
    render(<FileUploader locale="JA-jp" defaultFiles={[file]} />);

    expect(screen.getByLabelText('ファイルを選択')).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: 'ファイルをドラッグ＆ドロップするか、クリックして選択',
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('list', { name: '選択したファイル' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'report.pdfを削除' })).toBeInTheDocument();
  });

  it('applies message and part overrides with documented precedence', () => {
    const file = new File(['content'], 'report.pdf', { type: 'application/pdf' });
    render(
      <FileUploader.Root
        locale="ja-JP"
        defaultFiles={[file]}
        messages={{
          helperText: 'Localized helper',
          selectFiles: 'Localized input',
          selectedFiles: 'Localized list',
          removeFile: (fileName) => `Delete ${fileName}`,
        }}
      >
        <FileUploader.Zone helperText="Explicit helper" aria-label="Explicit zone" />
        <FileUploader.List aria-label="Explicit list" />
      </FileUploader.Root>,
    );

    expect(screen.getByLabelText('Localized input')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Explicit zone' })).toHaveTextContent(
      'Explicit helper',
    );
    expect(screen.getByRole('list', { name: 'Explicit list' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Delete report.pdf' })).toBeInTheDocument();
  });

  it('merges root and zone-specific accessible descriptions', () => {
    render(
      <>
        <span id="root-help">Root help</span>
        <span id="zone-help">Zone help</span>
        <FileUploader.Root required aria-describedby="root-help">
          <FileUploader.Zone aria-describedby="zone-help" />
        </FileUploader.Root>
      </>,
    );

    const zone = screen.getByRole('button');
    expect(zone.getAttribute('aria-describedby')?.split(' ')).toEqual(
      expect.arrayContaining(['root-help', 'zone-help']),
    );
    expect(zone).toHaveAccessibleDescription('Root help Required Zone help');
  });

  it('localizes the required description on the focusable zone', () => {
    render(<FileUploader required locale="ja-JP" />);

    expect(
      screen.getByRole('button', {
        name: 'ファイルをドラッグ＆ドロップするか、クリックして選択',
      }),
    ).toHaveAccessibleDescription('必須');
  });

  it('prefers locale prop to LocaleProvider', () => {
    render(
      <LocaleProvider defaultLocale="ja-JP" global={false}>
        <FileUploader locale="en-US" />
      </LocaleProvider>,
    );

    expect(screen.getByLabelText('Select files')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Drag & drop files here, or click to select' }),
    ).toBeInTheDocument();
  });

  it('reformats existing rejection feedback when provider locale changes', async () => {
    const user = userEvent.setup();
    const onReject = vi.fn();
    render(
      <LocaleProvider defaultLocale="en-US" global={false}>
        <LocaleSwitchingUploader onReject={onReject} />
      </LocaleProvider>,
    );
    const file = new File(['content'], 'document.pdf', { type: 'application/pdf' });

    fireEvent.change(screen.getByTestId('file-input'), { target: { files: [file] } });
    expect(screen.getByRole('status')).toHaveTextContent('document.pdf was not added');

    await user.click(screen.getByRole('button', { name: 'Japanese' }));

    expect(screen.getByRole('status')).toHaveTextContent('document.pdfは追加されませんでした');
    expect(onReject).toHaveBeenCalledTimes(1);
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
    expect(clickSpy).toHaveBeenCalledTimes(1);
    fireEvent.keyUp(dropZone, { key: ' ' });

    expect(clickSpy).toHaveBeenCalledTimes(2);
  });

  it('blocks activation keys on a read-only drop zone without suppressing capture handlers', () => {
    const onKeyDownCapture = vi.fn();
    const onKeyUpCapture = vi.fn();
    render(
      <FileUploader.Root readOnly>
        <FileUploader.Zone
          helperText="Upload"
          onKeyDownCapture={onKeyDownCapture}
          onKeyUpCapture={onKeyUpCapture}
        />
      </FileUploader.Root>,
    );
    const zone = screen.getByRole('button', { name: 'Upload' });

    expect(fireEvent.keyDown(zone, { key: 'Unidentified', code: 'Space' })).toBe(false);
    expect(fireEvent.keyUp(zone, { key: 'Unidentified', code: 'Space' })).toBe(false);
    expect(onKeyDownCapture).toHaveBeenCalledTimes(1);
    expect(onKeyUpCapture).toHaveBeenCalledTimes(1);
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
    expect(dropZone).not.toHaveAttribute('data-drag');
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

  it('does not leak shorthand-only helper text through Root for untyped callers', () => {
    const legacyProps = {
      helperText: 'Legacy root helper',
    } as unknown as ComponentProps<typeof FileUploader.Root>;
    const { container } = render(
      <FileUploader.Root {...legacyProps}>
        <FileUploader.Zone />
      </FileUploader.Root>,
    );

    expect(container.firstElementChild).not.toHaveAttribute('helperText');
    expect(container.firstElementChild).not.toHaveAttribute('helpertext');
    expect(screen.queryByText('Legacy root helper')).not.toBeInTheDocument();
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

  it('reports rejected files and announces why they were rejected', () => {
    const onReject = vi.fn();
    render(<FileUploader accept="image/png" maxSize={5} onReject={onReject} />);

    const pdf = new File(['content'], 'document.pdf', { type: 'application/pdf' });
    const largePng = new File(['too-large'], 'large.png', { type: 'image/png' });
    fireEvent.change(screen.getByTestId('file-input'), { target: { files: [pdf, largePng] } });

    expect(onReject).toHaveBeenCalledWith([
      expect.objectContaining({ file: pdf, reasons: ['max-size', 'accept'] }),
      expect.objectContaining({ file: largePng, reasons: ['max-size'] }),
    ]);
    expect(screen.getByRole('status')).toHaveTextContent('document.pdf was not added');
  });

  it('keeps rejection feedback when accepted and rejected files are selected together', () => {
    const onReject = vi.fn();
    render(<FileUploader accept="image/png" onReject={onReject} />);

    const pdf = new File(['content'], 'document.pdf', { type: 'application/pdf' });
    const png = new File(['content'], 'image.png', { type: 'image/png' });
    fireEvent.change(screen.getByTestId('file-input'), { target: { files: [pdf, png] } });

    expect(screen.getByText('image.png')).toBeInTheDocument();
    expect(onReject).toHaveBeenCalledWith([expect.objectContaining({ file: pdf })]);
    expect(screen.getByRole('status')).toHaveTextContent('document.pdf was not added');
  });

  it('rejects additional valid files when single-file mode receives multiple files', () => {
    const onReject = vi.fn();
    render(<FileUploader onReject={onReject} />);

    const first = new File(['first'], 'first.txt', { type: 'text/plain' });
    const second = new File(['second'], 'second.txt', { type: 'text/plain' });
    fireEvent.drop(screen.getByRole('button'), { dataTransfer: { files: [first, second] } });

    expect(screen.getByText('first.txt')).toBeInTheDocument();
    expect(screen.queryByText('second.txt')).not.toBeInTheDocument();
    expect(onReject).toHaveBeenCalledWith([
      expect.objectContaining({ file: second, reasons: ['too-many-files'] }),
    ]);
  });

  it('applies upload constraints to default files', () => {
    const pdf = new File(['content'], 'document.pdf', { type: 'application/pdf' });
    const firstPng = new File(['ok'], 'first.png', { type: 'image/png' });
    const secondPng = new File(['ok'], 'second.png', { type: 'image/png' });
    render(<FileUploader accept="image/png" defaultFiles={[pdf, firstPng, secondPng]} />);

    expect(screen.getByText('first.png')).toBeInTheDocument();
    expect(screen.queryByText('document.pdf')).not.toBeInTheDocument();
    expect(screen.queryByText('second.png')).not.toBeInTheDocument();
  });

  it('revalidates selected files when constraints change', async () => {
    const onChange = vi.fn();
    const { rerender } = render(<FileUploader multiple onChange={onChange} />);
    const first = new File(['one'], 'first.txt', { type: 'text/plain' });
    const second = new File(['two'], 'second.txt', { type: 'text/plain' });

    fireEvent.change(screen.getByTestId('file-input'), { target: { files: [first, second] } });
    rerender(<FileUploader multiple maxSize={2} onChange={onChange} />);

    await waitFor(() => expect(screen.queryByText('first.txt')).not.toBeInTheDocument());
    expect(screen.queryByText('second.txt')).not.toBeInTheDocument();
    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  it('keeps drag state while moving to a child of the drop zone', () => {
    render(<FileUploader />);
    const dropZone = screen.getByRole('button', {
      name: 'Drag & drop files here, or click to select',
    });
    const child = screen.getByText('Drag & drop files here, or click to select');

    fireEvent.dragOver(dropZone);
    const innerDragLeave = new Event('dragleave', { bubbles: true, cancelable: true });
    Object.defineProperty(innerDragLeave, 'relatedTarget', { value: child });
    fireEvent(dropZone, innerDragLeave);
    expect(dropZone).toHaveAttribute('data-drag');

    const outerDragLeave = new Event('dragleave', { bubbles: true, cancelable: true });
    Object.defineProperty(outerDragLeave, 'relatedTarget', { value: document.body });
    fireEvent(dropZone, outerDragLeave);
    expect(dropZone).not.toHaveAttribute('data-drag');
  });

  it('keeps drag state for an internal transition in an iframe realm', () => {
    const iframe = document.createElement('iframe');
    document.body.appendChild(iframe);
    const ownerDocument = iframe.contentDocument as Document;
    const ownerWindow = iframe.contentWindow as Window;
    const { getByRole, getByText, unmount } = render(<FileUploader />, {
      container: ownerDocument.body,
      baseElement: ownerDocument.body,
    });
    const dropZone = getByRole('button', {
      name: 'Drag & drop files here, or click to select',
    });
    const child = getByText('Drag & drop files here, or click to select');

    fireEvent.dragOver(dropZone);
    const dragLeave = new ownerWindow.Event('dragleave', { bubbles: true, cancelable: true });
    Object.defineProperty(dragLeave, 'relatedTarget', { value: child });
    fireEvent(dropZone, dragLeave);

    expect(dropZone).toHaveAttribute('data-drag');
    unmount();
    iframe.remove();
  });

  it('keeps drag state for nested enter and leave events with no related target', () => {
    render(<FileUploader />);
    const dropZone = screen.getByRole('button', {
      name: 'Drag & drop files here, or click to select',
    });

    fireEvent.dragEnter(dropZone);
    fireEvent.dragEnter(dropZone);
    fireEvent.dragLeave(dropZone, { relatedTarget: null });
    expect(dropZone).toHaveAttribute('data-drag');
    fireEvent.dragLeave(dropZone, { relatedTarget: null });
    expect(dropZone).not.toHaveAttribute('data-drag');
  });

  it('removes a file when the remove button is clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<FileUploader onChange={handleChange} />);

    const file = new File(['content'], 'report.pdf', { type: 'application/pdf' });
    fireEvent.change(screen.getByTestId('file-input'), { target: { files: [file] } });
    expect(screen.getByText('report.pdf')).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Selected files' })).toHaveTextContent('report.pdf');
    expect(screen.getByRole('listitem')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Remove report.pdf' }));
    expect(screen.queryByText('report.pdf')).not.toBeInTheDocument();
    expect(handleChange).toHaveBeenLastCalledWith([]);
  });

  it('moves focus to an adjacent remove action or the zone after removal', async () => {
    const user = userEvent.setup();
    const first = new File(['first'], 'first.txt', { type: 'text/plain' });
    const second = new File(['second'], 'second.txt', { type: 'text/plain' });
    render(<FileUploader multiple defaultFiles={[first, second]} />);

    await user.click(screen.getByRole('button', { name: 'Remove first.txt' }));
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Remove second.txt' })).toHaveFocus(),
    );

    await user.click(screen.getByRole('button', { name: 'Remove second.txt' }));
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'Drag & drop files here, or click to select' }),
      ).toHaveFocus(),
    );
  });

  it('does not show file list when no files are selected', () => {
    render(<FileUploader />);
    expect(screen.queryByRole('button', { name: /Remove / })).not.toBeInTheDocument();
  });

  it('does not leak an unsupported asChild prop to the root element', () => {
    const { container } = render(<FileUploader {...({ asChild: true } as never)} />);
    expect(container.querySelector('[aschild]')).toBeNull();
  });
});
