import { renderHook } from '@testing-library/react';

import { useListTemplates } from './use-list-templates';

const mockUseGetTemplates = jest.fn();
jest.mock('src/actions/chat-templates/use-get-templates', () => ({
  useGetTemplates: (...args: any[]) => mockUseGetTemplates(...args),
}));

describe('useListTemplates', () => {
  it('returns data from useGetTemplates', () => {
    const templates = [{ id: 1, name: 'Template 1' }];
    mockUseGetTemplates.mockReturnValue({ data: templates, isLoading: false, isError: false });
    const { result } = renderHook(() => useListTemplates());
    expect(result.current.data).toEqual(templates);
  });

  it('returns undefined data when loading', () => {
    mockUseGetTemplates.mockReturnValue({ data: undefined, isLoading: true, isError: false });
    const { result } = renderHook(() => useListTemplates());
    expect(result.current.data).toBeUndefined();
  });

  it('returns undefined data on error', () => {
    mockUseGetTemplates.mockReturnValue({ data: undefined, isLoading: false, isError: true });
    const { result } = renderHook(() => useListTemplates());
    expect(result.current.data).toBeUndefined();
  });

  it('returns empty array when templates list is empty', () => {
    mockUseGetTemplates.mockReturnValue({ data: [], isLoading: false, isError: false });
    const { result } = renderHook(() => useListTemplates());
    expect(result.current.data).toEqual([]);
  });
});
