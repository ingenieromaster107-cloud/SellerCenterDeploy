import React from 'react';
import { waitFor, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { TranslateProvider } from 'src/locales/langs/i18n';

import { useQueueMassUploadImport } from './use-queue-mass-upload-import';

jest.mock('src/auth/context', () => ({
  getSession: () => 'TEST_TOKEN',
}));

const wrapper = () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: qc }, React.createElement(TranslateProvider, null, children));
};

const okBody = {
  success: true,
  message: 'Import queued successfully.',
  profile_id: 1,
  job_id: 7,
  status: 'pending',
  import_mode: 'CREATE',
  images_zip_path: '/var/www/html/pub/media/tmp/catalog/product/1/zip/imgs.zip',
};

const mockFetch = jest.fn();

beforeAll(() => {
  (global as any).fetch = mockFetch;
});

beforeEach(() => mockFetch.mockReset());

const csv = () => new File(['sku,name\nA,B'], 'data.csv', { type: 'text/csv' });
const zip = () => new File(['zip-bytes'], 'imgs.zip', { type: 'application/zip' });

describe('useQueueMassUploadImport (REST)', () => {
  it('POSTs multipart with csv_file + images_zip_file and returns the parsed body', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => okBody,
    });

    const { result } = renderHook(() => useQueueMassUploadImport(), { wrapper: wrapper() });

    const data = await result.current.mutateAsync({
      profileId: 1,
      importMode: 'CREATE',
      csvFile: csv(),
      imagesZipFile: zip(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, init] = mockFetch.mock.calls[0];
    expect(String(url)).toMatch(/\/api\/magento\/rest\/V1\/import\/products(\?.*)?$/);
    expect(init.method).toBe('POST');
    expect(init.headers.Authorization).toBe('Bearer TEST_TOKEN');

    const form = init.body as FormData;
    expect(form.get('profile_id')).toBe('1');
    expect(form.get('import_mode')).toBe('CREATE');
    expect(form.get('csv_file')).toBeInstanceOf(File);
    expect(form.get('images_zip_file')).toBeInstanceOf(File);

    expect(data.job_id).toBe(7);
    expect(data.success).toBe(true);
  });

  it('omits images_zip_file when no ZIP is provided', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: async () => okBody });

    const { result } = renderHook(() => useQueueMassUploadImport(), { wrapper: wrapper() });

    await result.current.mutateAsync({
      profileId: 2,
      importMode: 'UPDATE',
      csvFile: csv(),
      imagesZipFile: null,
    });

    const form = mockFetch.mock.calls[0][1].body as FormData;
    expect(form.get('images_zip_file')).toBeNull();
    expect(form.get('import_mode')).toBe('UPDATE');
    expect(form.get('profile_id')).toBe('2');
  });

  it('throws with backend message on non-OK response', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 413,
      json: async () => ({ message: 'Payload too large' }),
    });

    const { result } = renderHook(() => useQueueMassUploadImport(), { wrapper: wrapper() });

    await expect(
      result.current.mutateAsync({ profileId: 1, importMode: 'CREATE', csvFile: csv() })
    ).rejects.toThrow('Payload too large');
  });

  it('throws with status when response body is not JSON', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => {
        throw new Error('not json');
      },
    });

    const { result } = renderHook(() => useQueueMassUploadImport(), { wrapper: wrapper() });

    await expect(
      result.current.mutateAsync({ profileId: 1, importMode: 'CREATE', csvFile: csv() })
    ).rejects.toThrow('Could not queue the import');
  });
});






