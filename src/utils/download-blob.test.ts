import { downloadCsvBlob } from './download-blob';

describe('downloadCsvBlob', () => {
  const createObjectURL = jest.fn(() => 'blob:mock-url');
  const revokeObjectURL = jest.fn();

  beforeAll(() => {
    Object.defineProperty(URL, 'createObjectURL', { value: createObjectURL, writable: true });
    Object.defineProperty(URL, 'revokeObjectURL', { value: revokeObjectURL, writable: true });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('triggers a download with the given file name', () => {
    const click = jest.fn();
    const setAttribute = jest.fn();
    const anchor = { href: '', setAttribute, click } as unknown as HTMLAnchorElement;

    const createElement = jest.spyOn(document, 'createElement').mockReturnValue(anchor);
    const appendChild = jest.spyOn(document.body, 'appendChild').mockImplementation((n) => n);
    const removeChild = jest.spyOn(document.body, 'removeChild').mockImplementation((n) => n);

    downloadCsvBlob('a,b,c', 'movimientos.csv');

    expect(createObjectURL).toHaveBeenCalledTimes(1);
    expect(setAttribute).toHaveBeenCalledWith('download', 'movimientos.csv');
    expect(anchor.href).toBe('blob:mock-url');
    expect(click).toHaveBeenCalledTimes(1);
    expect(appendChild).toHaveBeenCalledWith(anchor);
    expect(removeChild).toHaveBeenCalledWith(anchor);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');

    createElement.mockRestore();
    appendChild.mockRestore();
    removeChild.mockRestore();
  });
});
