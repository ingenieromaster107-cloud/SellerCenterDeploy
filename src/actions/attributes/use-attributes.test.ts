import { renderHook } from '@testing-library/react';

const mockUseQuery = jest.fn();
const mockGetInstance = jest.fn();
const mockAttributesAdapter = jest.fn();

jest.mock('@tanstack/react-query', () => ({ useQuery: (...a: any[]) => mockUseQuery(...a) }));
jest.mock('src/lib/graphql-client', () => ({ GraphQLService: { getInstance: () => mockGetInstance() } }));
jest.mock('./graphql/queries/get-attributes', () => ({ GET_ATTRIBUTES: 'GET_ATTRIBUTES' }));
jest.mock('./adapters/attributes-adapter', () => ({ AttributesAdapter: (...a: any[]) => mockAttributesAdapter(...a) }));

import { useGetAttributes } from './use-attributes';

const mockGraphql = { request: jest.fn() };

describe('useGetAttributes', () => {
  beforeEach(() => {
    mockGetInstance.mockReturnValue(mockGraphql);
    mockAttributesAdapter.mockReturnValue([]);
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: false, isError: false, error: null });
  });
  afterEach(() => jest.clearAllMocks());

  it('returns empty attributes when no data', () => {
    const { result } = renderHook(() => useGetAttributes({ pageSize: 10, currentPage: 1 } as any));
    expect(result.current.attributes).toEqual([]);
  });

  it('returns isLoading flag', () => {
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: true, isError: false, error: null });
    const { result } = renderHook(() => useGetAttributes({ pageSize: 10, currentPage: 1 } as any));
    expect(result.current.isLoading).toBe(true);
  });

  it('returns isError and error', () => {
    const err = new Error('fail');
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: false, isError: true, error: err });
    const { result } = renderHook(() => useGetAttributes({ pageSize: 10 } as any));
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe(err);
  });

  it('uses correct queryKey with params', () => {
    const params = { pageSize: 5, currentPage: 2 } as any;
    renderHook(() => useGetAttributes(params));
    const opts = mockUseQuery.mock.calls[0][0];
    expect(opts.queryKey).toEqual(['getAttributes', params]);
  });

  it('maps data through AttributesAdapter', () => {
    const attrs = [{ id: '1', label: 'Color' }];
    mockAttributesAdapter.mockReturnValue(attrs);
    mockUseQuery.mockReturnValue({ data: { customAttributeMetadata: {} }, isLoading: false, isError: false, error: null });
    const { result } = renderHook(() => useGetAttributes({ pageSize: 10 } as any));
    expect(result.current.attributes).toBe(attrs);
  });
});
