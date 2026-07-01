import { renderHook } from '@testing-library/react';

const mockUseQuery = jest.fn();
const mockGetInstance = jest.fn();

jest.mock('@tanstack/react-query', () => ({
  useQuery: (...args: any[]) => mockUseQuery(...args),
}));

jest.mock('src/lib/graphql-client', () => ({
  GraphQLService: { getInstance: () => mockGetInstance() },
}));

jest.mock('./graphql', () => ({
  GET_CATEGORIES_QUERY: 'GET_CATEGORIES_QUERY',
}));

import { useCategories } from './use-categories';

const mockGraphql = { request: jest.fn() };

describe('useCategories', () => {
  beforeEach(() => {
    mockGetInstance.mockReturnValue(mockGraphql);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns empty categoryTree when no data', () => {
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: false, isError: false, error: null, isFetching: false });
    const { result } = renderHook(() => useCategories());
    expect(result.current.categoryTree).toEqual([]);
  });

  it('returns isLoading true while loading', () => {
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: true, isError: false, error: null, isFetching: true });
    const { result } = renderHook(() => useCategories());
    expect(result.current.categoriesLoading).toBe(true);
    expect(result.current.categoriesValidating).toBe(true);
  });

  it('returns categoriesError when isError is true', () => {
    const err = new Error('network error');
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: false, isError: true, error: err, isFetching: false });
    const { result } = renderHook(() => useCategories());
    expect(result.current.categoriesError).toBe(err);
  });

  it('returns null categoriesError when no error', () => {
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: false, isError: false, error: null, isFetching: false });
    const { result } = renderHook(() => useCategories());
    expect(result.current.categoriesError).toBeNull();
  });

  it('maps children from first category item', () => {
    const children = [
      { uid: 'a1', id: 1, name: 'Ropa', product_count: 10, children: [] },
      { uid: 'a2', id: 2, name: 'Zapatos', product_count: 5, children: [] },
    ];
    mockUseQuery.mockReturnValue({
      data: { categories: { items: [{ uid: 'root', children }] } },
      isLoading: false,
      isError: false,
      error: null,
      isFetching: false,
    });
    const { result } = renderHook(() => useCategories());
    expect(result.current.categoryTree).toHaveLength(2);
    expect(result.current.categoryTree[0].name).toBe('Ropa');
    expect(result.current.categoryTree[1].name).toBe('Zapatos');
  });

  it('returns raw data in categoriesRaw', () => {
    const raw = { categories: { items: [{ uid: 'root', children: [] }] } };
    mockUseQuery.mockReturnValue({ data: raw, isLoading: false, isError: false, error: null, isFetching: false });
    const { result } = renderHook(() => useCategories());
    expect(result.current.categoriesRaw).toBe(raw);
  });

  it('returns empty tree when root has no children array', () => {
    mockUseQuery.mockReturnValue({
      data: { categories: { items: [{ uid: 'root', children: null }] } },
      isLoading: false,
      isError: false,
      error: null,
      isFetching: false,
    });
    const { result } = renderHook(() => useCategories());
    expect(result.current.categoryTree).toEqual([]);
  });
});
