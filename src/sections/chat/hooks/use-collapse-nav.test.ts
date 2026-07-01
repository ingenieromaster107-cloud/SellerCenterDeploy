import { act, renderHook } from '@testing-library/react';

import { useCollapseNav } from './use-collapse-nav';

describe('useCollapseNav', () => {
  it('returns initial state with desktop not collapsed and mobile closed', () => {
    const { result } = renderHook(() => useCollapseNav());
    expect(result.current.collapseDesktop).toBe(false);
    expect(result.current.openMobile).toBe(false);
  });

  it('toggles collapseDesktop when onCollapseDesktop is called', () => {
    const { result } = renderHook(() => useCollapseNav());
    act(() => result.current.onCollapseDesktop());
    expect(result.current.collapseDesktop).toBe(true);
    act(() => result.current.onCollapseDesktop());
    expect(result.current.collapseDesktop).toBe(false);
  });

  it('closes desktop when onCloseDesktop is called', () => {
    const { result } = renderHook(() => useCollapseNav());
    act(() => result.current.onCollapseDesktop());
    expect(result.current.collapseDesktop).toBe(true);
    act(() => result.current.onCloseDesktop());
    expect(result.current.collapseDesktop).toBe(false);
  });

  it('opens mobile when onOpenMobile is called', () => {
    const { result } = renderHook(() => useCollapseNav());
    act(() => result.current.onOpenMobile());
    expect(result.current.openMobile).toBe(true);
  });

  it('closes mobile when onCloseMobile is called', () => {
    const { result } = renderHook(() => useCollapseNav());
    act(() => result.current.onOpenMobile());
    act(() => result.current.onCloseMobile());
    expect(result.current.openMobile).toBe(false);
  });

  it('exposes all expected handler functions', () => {
    const { result } = renderHook(() => useCollapseNav());
    expect(typeof result.current.onCollapseDesktop).toBe('function');
    expect(typeof result.current.onCloseDesktop).toBe('function');
    expect(typeof result.current.onOpenMobile).toBe('function');
    expect(typeof result.current.onCloseMobile).toBe('function');
  });
});
