import React from 'react';
import { waitFor, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useQueueMassUploadImport } from './useQueueMassUploadImport';

const mockRequest = jest.fn();

jest.mock('src/lib/graphql-client', () => ({
  GraphQLService: { getInstance: () => ({ request: mockRequest }) },
}));

const wrapper = () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: qc }, children);
};

describe('useQueueMassUploadImport', () => {
  beforeEach(() => mockRequest.mockReset());

  it('runs the mutation and adapts the response', async () => {
    mockRequest.mockResolvedValue({
      queueMassUploadImport: {
        success: true,
        message: 'Import queued successfully.',
        profile_id: 1,
        job_id: 7,
        status: 'pending',
        import_mode: 'CREATE',
      },
    });

    const { result } = renderHook(() => useQueueMassUploadImport(), { wrapper: wrapper() });

    await result.current.mutateAsync({
      profileId: 1,
      importMode: 'CREATE',
      imagesZipPath: null,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.queueMassUploadImport.job_id).toBe(7);
    expect(result.current.data?.queueMassUploadImport.success).toBe(true);
  });

  it('passes imagesZipPath along to the request', async () => {
    mockRequest.mockResolvedValue({
      queueMassUploadImport: {
        success: true,
        message: 'ok',
        profile_id: 1,
        job_id: 1,
        status: 'pending',
        import_mode: 'UPDATE',
      },
    });

    const { result } = renderHook(() => useQueueMassUploadImport(), { wrapper: wrapper() });

    await result.current.mutateAsync({
      profileId: 1,
      importMode: 'UPDATE',
      imagesZipPath: 'BASE64ZIP',
    });

    expect(mockRequest).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ profileId: 1, importMode: 'UPDATE', imagesZipPath: 'BASE64ZIP' })
    );
  });

  it('propagates errors', async () => {
    mockRequest.mockRejectedValue(new Error('boom'));
    const { result } = renderHook(() => useQueueMassUploadImport(), { wrapper: wrapper() });

    await expect(
      result.current.mutateAsync({ profileId: 1, importMode: 'CREATE' })
    ).rejects.toThrow('boom');
  });
});
