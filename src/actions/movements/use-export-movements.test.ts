import { renderHook } from '@testing-library/react';

const mockUseMutation = jest.fn();
const mockGetInstance = jest.fn();

jest.mock('@tanstack/react-query', () => ({ useMutation: (...a: any[]) => mockUseMutation(...a) }));
jest.mock('src/lib/graphql-client', () => ({ GraphQLService: { getInstance: () => mockGetInstance() } }));
jest.mock('./graphql/queries', () => ({ SELLER_MOVEMENTS_EXPORT_CSV_QUERY: 'SELLER_MOVEMENTS_EXPORT_CSV_QUERY' }));

import { useExportMovements } from './use-export-movements';

const mockGraphql = { request: jest.fn() };

describe('useExportMovements', () => {
  beforeEach(() => {
    mockGetInstance.mockReturnValue(mockGraphql);
    mockUseMutation.mockReturnValue({ mutate: jest.fn(), mutateAsync: jest.fn(), isPending: false });
  });
  afterEach(() => jest.clearAllMocks());

  it('returns mutation object with mutate and mutateAsync', () => {
    const { result } = renderHook(() => useExportMovements());
    expect(typeof result.current.mutate).toBe('function');
    expect(typeof result.current.mutateAsync).toBe('function');
  });

  it('uses correct mutationKey', () => {
    renderHook(() => useExportMovements());
    const opts = mockUseMutation.mock.calls[0][0];
    expect(opts.mutationKey).toEqual(['movements:export']);
  });
});
