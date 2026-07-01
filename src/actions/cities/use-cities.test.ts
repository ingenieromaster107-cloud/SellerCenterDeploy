import { renderHook } from '@testing-library/react';

const mockUseQuery = jest.fn();
const mockGetInstance = jest.fn();
const mockCitiesAdapter = jest.fn();

jest.mock('@tanstack/react-query', () => ({ useQuery: (...a: any[]) => mockUseQuery(...a) }));
jest.mock('src/lib/graphql-client', () => ({ GraphQLService: { getInstance: () => mockGetInstance() } }));
jest.mock('./graphql/queries/get-cities', () => ({ GET_CITIES: 'GET_CITIES' }));
jest.mock('./adapters/cities-adapter', () => ({ CitiesAdapter: (...a: any[]) => mockCitiesAdapter(...a) }));

import { useGetCities } from './use-cities';

const mockGraphql = { request: jest.fn() };

describe('useGetCities', () => {
  beforeEach(() => {
    mockGetInstance.mockReturnValue(mockGraphql);
    mockCitiesAdapter.mockReturnValue([{ value: '1', label: 'Bogotá' }]);
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: false, isError: false, error: null });
  });
  afterEach(() => jest.clearAllMocks());

  it('returns empty cities when regionId is 0', () => {
    const { result } = renderHook(() => useGetCities(0));
    expect(result.current.cities).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('returns empty cities when regionId is NaN', () => {
    const { result } = renderHook(() => useGetCities(NaN));
    expect(result.current.cities).toEqual([]);
  });

  it('passes enabled=false when regionId is 0', () => {
    renderHook(() => useGetCities(0));
    const opts = mockUseQuery.mock.calls[0][0];
    expect(opts.enabled).toBe(false);
  });

  it('passes enabled=true when regionId is valid', () => {
    renderHook(() => useGetCities(5));
    const opts = mockUseQuery.mock.calls[0][0];
    expect(opts.enabled).toBe(true);
  });

  it('maps data through CitiesAdapter when enabled', () => {
    const cities = [{ value: '1', label: 'Bogotá' }];
    mockCitiesAdapter.mockReturnValue(cities);
    mockUseQuery.mockReturnValue({ data: { availableRegions: [] }, isLoading: false, isError: false });
    const { result } = renderHook(() => useGetCities(5));
    expect(result.current.cities).toBe(cities);
  });

  it('returns empty array when no data and enabled', () => {
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: false, isError: false });
    const { result } = renderHook(() => useGetCities(5));
    expect(result.current.cities).toEqual([]);
  });

  it('returns error=null when disabled', () => {
    const { result } = renderHook(() => useGetCities(0));
    expect(result.current.error).toBeNull();
  });
});
