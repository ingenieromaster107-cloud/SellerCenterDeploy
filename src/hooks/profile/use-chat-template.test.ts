import { act, renderHook } from '@testing-library/react';

jest.mock('src/components', () => ({
  useTable: () => ({
    order: 'desc',
    orderBy: 'from_date',
    page: 0,
    rowsPerPage: 10,
  }),
}));

jest.mock('src/locales', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

jest.mock('src/actions/chat-templates/use-get-templates', () => ({
  useGetTemplates: () => ({ data: [] }),
}));

jest.mock('src/sections/account/components/template-table-toolbar', () => ({}));

import { useChatTemplate } from './use-chat-template';

describe('useChatTemplate', () => {
  it('returns TABLE_HEAD with 5 columns', () => {
    const { result } = renderHook(() => useChatTemplate());
    expect(result.current.TABLE_HEAD).toHaveLength(5);
  });

  it('TABLE_HEAD has correct ids', () => {
    const { result } = renderHook(() => useChatTemplate());
    const ids = result.current.TABLE_HEAD.map((h) => h.id);
    expect(ids).toContain('title');
    expect(ids).toContain('content');
    expect(ids).toContain('status');
    expect(ids).toContain('actions');
  });

  it('initializes searchValue as empty string', () => {
    const { result } = renderHook(() => useChatTemplate());
    expect(result.current.searchValue).toBe('');
  });

  it('initializes statusTab as "all"', () => {
    const { result } = renderHook(() => useChatTemplate());
    expect(result.current.statusTab).toBe('all');
  });

  it('initializes paginationModel with page 0 and pageSize 10', () => {
    const { result } = renderHook(() => useChatTemplate());
    expect(result.current.paginationModel).toEqual({ page: 0, pageSize: 10 });
  });

  it('setSearchValue updates searchValue', () => {
    const { result } = renderHook(() => useChatTemplate());
    act(() => {
      result.current.setSearchValue('test query');
    });
    expect(result.current.searchValue).toBe('test query');
  });

  it('setStatusTab updates statusTab', () => {
    const { result } = renderHook(() => useChatTemplate());
    act(() => {
      result.current.setStatusTab('ACTIVE');
    });
    expect(result.current.statusTab).toBe('ACTIVE');
  });

  it('returns data from useGetTemplates', () => {
    const { result } = renderHook(() => useChatTemplate());
    expect(result.current.data).toEqual([]);
  });
});
