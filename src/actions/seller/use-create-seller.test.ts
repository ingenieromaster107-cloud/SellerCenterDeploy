import { renderHook } from '@testing-library/react';

const mockUseMutation = jest.fn();
const mockGetInstance = jest.fn();
const mockBuildMutation = jest.fn();
const mockGetDocVarBaseName = jest.fn();

jest.mock('@tanstack/react-query', () => ({ useMutation: (...a: any[]) => mockUseMutation(...a) }));
jest.mock('src/lib/graphql-client', () => ({ GraphQLService: { getInstance: () => mockGetInstance() } }));
jest.mock('./graphql/mutations/create-seller', () => ({
  buildCreateCustomerMutation: (...a: any[]) => mockBuildMutation(...a),
  getDocVarBaseName: (...a: any[]) => mockGetDocVarBaseName(...a),
}));

import { useCreateSeller } from './use-create-seller';

const mockGraphql = { request: jest.fn() };

describe('useCreateSeller', () => {
  beforeEach(() => {
    mockGetInstance.mockReturnValue(mockGraphql);
    mockBuildMutation.mockReturnValue('MUTATION_STRING');
    mockGetDocVarBaseName.mockImplementation((code: string) => code.replace(/[^a-zA-Z0-9]/g, ''));
    mockUseMutation.mockReturnValue({ mutate: jest.fn(), mutateAsync: jest.fn(), isPending: false });
  });
  afterEach(() => jest.clearAllMocks());

  it('returns mutation object with mutate and mutateAsync', () => {
    const { result } = renderHook(() => useCreateSeller());
    expect(typeof result.current.mutate).toBe('function');
    expect(typeof result.current.mutateAsync).toBe('function');
  });

  it('calls useMutation', () => {
    renderHook(() => useCreateSeller());
    expect(mockUseMutation).toHaveBeenCalled();
  });
});
