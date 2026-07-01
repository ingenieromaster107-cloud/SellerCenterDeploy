import { renderHook } from '@testing-library/react';

const mockUseQuery = jest.fn();
const mockGetInstance = jest.fn();
const mockRegionAdapter = jest.fn();

jest.mock('@tanstack/react-query', () => ({ useQuery: (...a: any[]) => mockUseQuery(...a) }));
jest.mock('src/lib/graphql-client', () => ({ GraphQLService: { getInstance: () => mockGetInstance() } }));
jest.mock('./graphql/queries/get-regions', () => ({ GET_REGIONS: 'GET_REGIONS' }));
jest.mock('./adapters/regions-adapter', () => ({ RegionAdapter: (...a: any[]) => mockRegionAdapter(...a) }));

import { useGetRegions } from './use-regions';

const mockGraphql = { request: jest.fn() };

describe('useGetRegions', () => {
  beforeEach(() => {
    mockGetInstance.mockReturnValue(mockGraphql);
    mockRegionAdapter.mockReturnValue([]);
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: false, isError: false, error: null });
  });
  afterEach(() => jest.clearAllMocks());

  it('returns regions array', () => {
    const { result } = renderHook(() => useGetRegions());
    expect(Array.isArray(result.current.regions)).toBe(true);
  });

  it('defaults to CO country', () => {
    renderHook(() => useGetRegions());
    const opts = mockUseQuery.mock.calls[0][0];
    expect(opts.queryKey).toEqual(['getRegions', 'CO']);
  });

  it('uses provided countryId', () => {
    renderHook(() => useGetRegions('US'));
    const opts = mockUseQuery.mock.calls[0][0];
    expect(opts.queryKey).toEqual(['getRegions', 'US']);
  });

  it('returns isLoading flag', () => {
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: true, isError: false, error: null });
    const { result } = renderHook(() => useGetRegions());
    expect(result.current.isLoading).toBe(true);
  });

  it('maps data through RegionAdapter', () => {
    const regions = [{ value: '1', label: 'Cundinamarca' }];
    mockRegionAdapter.mockReturnValue(regions);
    mockUseQuery.mockReturnValue({ data: { country: {} }, isLoading: false, isError: false, error: null });
    const { result } = renderHook(() => useGetRegions('CO'));
    expect(result.current.regions).toBe(regions);
  });
});
