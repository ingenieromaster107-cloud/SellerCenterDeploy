import { renderHook } from '@testing-library/react';

const mockUseQuery = jest.fn();
const mockGetInstance = jest.fn();
const mockCountriesAdapter = jest.fn();

jest.mock('@tanstack/react-query', () => ({ useQuery: (...a: any[]) => mockUseQuery(...a) }));
jest.mock('src/lib/graphql-client', () => ({ GraphQLService: { getInstance: () => mockGetInstance() } }));
jest.mock('./graphql/queries/get-countries', () => ({ GET_COUNTRIES: 'GET_COUNTRIES' }));
jest.mock('./adapters/countries-adapter', () => ({ CountriesAdapter: (...a: any[]) => mockCountriesAdapter(...a) }));

import { useGetCountries } from './use-countries';

const mockGraphql = { request: jest.fn() };

describe('useGetCountries', () => {
  beforeEach(() => {
    mockGetInstance.mockReturnValue(mockGraphql);
    mockCountriesAdapter.mockReturnValue([]);
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: false, isError: false });
  });
  afterEach(() => jest.clearAllMocks());

  it('returns countries array', () => {
    const { result } = renderHook(() => useGetCountries());
    expect(Array.isArray(result.current.countries)).toBe(true);
  });

  it('returns isLoading flag', () => {
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: true, isError: false });
    const { result } = renderHook(() => useGetCountries());
    expect(result.current.isLoading).toBe(true);
  });

  it('returns isError flag', () => {
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: false, isError: true });
    const { result } = renderHook(() => useGetCountries());
    expect(result.current.isError).toBe(true);
  });

  it('maps data through CountriesAdapter', () => {
    const countries = [{ value: 'CO', label: 'Colombia' }];
    mockCountriesAdapter.mockReturnValue(countries);
    mockUseQuery.mockReturnValue({ data: { countries: [] }, isLoading: false, isError: false });
    const { result } = renderHook(() => useGetCountries());
    expect(result.current.countries).toBe(countries);
  });

  it('uses correct queryKey', () => {
    renderHook(() => useGetCountries());
    expect(mockUseQuery.mock.calls[0][0].queryKey).toEqual(['getCountries']);
  });
});
