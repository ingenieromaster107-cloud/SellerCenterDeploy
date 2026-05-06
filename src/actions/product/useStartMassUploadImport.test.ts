import React from 'react';
import { waitFor, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useStartMassUploadImport } from './useStartMassUploadImport';

const mockRequest = jest.fn();

jest.mock('src/lib/graphql-client', () => ({
  GraphQLService: { getInstance: () => ({ request: mockRequest }) },
}));

const wrapper = () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: qc }, children);
};

describe('useStartMassUploadImport', () => {
  beforeEach(() => mockRequest.mockReset());

  it('runs the mutation and adapts the response', async () => {
    mockRequest.mockResolvedValue({
      startMassUploadImport: {
        success: true,
        message: 'Done',
        profile_id: 1,
        summary: { total_rows: 1, processed_rows: 1, success_rows: 1, failed_rows: 0 },
        results: [],
      },
    });

    const { result } = renderHook(() => useStartMassUploadImport(), { wrapper: wrapper() });

    await result.current.mutateAsync({ profileId: 1, importMode: 'CREATE' });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockRequest).toHaveBeenCalled();
    expect(result.current.data?.startMassUploadImport.success).toBe(true);
  });

  it('propagates errors', async () => {
    mockRequest.mockRejectedValue(new Error('boom'));
    const { result } = renderHook(() => useStartMassUploadImport(), { wrapper: wrapper() });

    await expect(
      result.current.mutateAsync({ profileId: 1, importMode: 'CREATE' })
    ).rejects.toThrow('boom');
  });
});
