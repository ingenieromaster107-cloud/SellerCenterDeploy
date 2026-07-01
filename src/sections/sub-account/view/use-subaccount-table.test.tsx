import { renderHook } from '@testing-library/react';

import { useSubAccountTable } from './use-subaccount-table';

const mockUseGetSubAccounts = jest.fn();
jest.mock('src/actions/account/use-get-subaccounts', () => ({
  useGetSubAccounts: (...args: any[]) => mockUseGetSubAccounts(...args),
}));

jest.mock('src/components/table', () => ({
  useTable: () => ({
    order: 'asc',
    orderBy: 'createdAt',
    onSort: jest.fn(),
    onResetPage: jest.fn(),
    onChangeDense: jest.fn(),
    dense: false,
    page: 0,
    rowsPerPage: 10,
    selected: [],
    onSelectRow: jest.fn(),
    onSelectAllRows: jest.fn(),
    onChangePage: jest.fn(),
    onChangeRowsPerPage: jest.fn(),
  }),
  getComparator: () => () => 0,
}));

jest.mock('minimal-shared/hooks', () => ({
  useBoolean: () => ({
    value: false,
    onTrue: jest.fn(),
    onFalse: jest.fn(),
  }),
  useSetState: (initial: any) => {
    let state = { ...initial };
    const setState = jest.fn((update: any) => { state = { ...state, ...update }; });
    return { state, setState };
  },
}));

const baseAccount: any = {
  entity_id: 1,
  firstname: 'Juan',
  email: 'juan@test.com',
  permissions: [{ orders: true }],
};

describe('useSubAccountTable', () => {
  beforeEach(() => {
    mockUseGetSubAccounts.mockReturnValue({
      accounts: [baseAccount],
      isLoading: false,
    });
  });

  it('returns table data from useGetSubAccounts', () => {
    const { result } = renderHook(() => useSubAccountTable());
    expect(result.current.tableData).toEqual([baseAccount]);
  });

  it('returns isLoading state', () => {
    mockUseGetSubAccounts.mockReturnValue({ accounts: [], isLoading: true });
    const { result } = renderHook(() => useSubAccountTable());
    expect(result.current.isLoading).toBe(true);
  });

  it('returns initial filters with name="" and permission="all"', () => {
    const { result } = renderHook(() => useSubAccountTable());
    expect(result.current.currentFilters.name).toBe('');
    expect(result.current.currentFilters.permission).toBe('all');
  });

  it('canReset is false with default filters', () => {
    const { result } = renderHook(() => useSubAccountTable());
    expect(result.current.canReset).toBe(false);
  });

  it('returns confirmDialog boolean helpers', () => {
    const { result } = renderHook(() => useSubAccountTable());
    expect(result.current.confirmDialog).toBeDefined();
    expect(typeof result.current.confirmDialog.onTrue).toBe('function');
  });

  it('exposes handleFilterPermission function', () => {
    const { result } = renderHook(() => useSubAccountTable());
    expect(typeof result.current.handleFilterPermission).toBe('function');
  });

  it('returns dataFiltered array', () => {
    const { result } = renderHook(() => useSubAccountTable());
    expect(Array.isArray(result.current.dataFiltered)).toBe(true);
  });
});
