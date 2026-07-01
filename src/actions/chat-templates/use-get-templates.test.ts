import { renderHook } from '@testing-library/react';

const mockUseQuery = jest.fn();
const mockGetInstance = jest.fn();

jest.mock('@tanstack/react-query', () => ({
  useQuery: (...args: any[]) => mockUseQuery(...args),
}));

jest.mock('src/lib/graphql-client', () => ({
  GraphQLService: { getInstance: () => mockGetInstance() },
}));

jest.mock('./graphql/queries/get-templates-list', () => ({
  GET_TEMPLATES_LIST: 'GET_TEMPLATES_LIST',
}));

import { useGetTemplates } from './use-get-templates';

const mockGraphql = { request: jest.fn() };

describe('useGetTemplates', () => {
  beforeEach(() => {
    mockGetInstance.mockReturnValue(mockGraphql);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns data undefined initially', () => {
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: false, isError: false, error: null });
    const { result } = renderHook(() => useGetTemplates());
    expect(result.current.data).toBeUndefined();
  });

  it('returns isLoading flag', () => {
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: true, isError: false, error: null });
    const { result } = renderHook(() => useGetTemplates());
    expect(result.current.isLoading).toBe(true);
  });

  it('returns isError and error', () => {
    const err = new Error('fetch failed');
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: false, isError: true, error: err });
    const { result } = renderHook(() => useGetTemplates());
    expect(result.current.isError).toBe(true);
    expect(result.current.error).toBe(err);
  });

  it('returns data when query resolves', () => {
    const templates = { interSellersResponseTemplates: [{ entity_id: 1, title: 'Template 1' }] };
    mockUseQuery.mockReturnValue({ data: templates, isLoading: false, isError: false, error: null });
    const { result } = renderHook(() => useGetTemplates());
    expect(result.current.data).toBe(templates);
  });

  it('uses correct queryKey', () => {
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: false, isError: false, error: null });
    renderHook(() => useGetTemplates());
    const opts = mockUseQuery.mock.calls[0][0];
    expect(opts.queryKey).toEqual(['getTemplatesList']);
  });
});
