import { renderHook } from '@testing-library/react';

import { useCarouselProgress } from './use-carousel-progress';

type MockApi = {
  scrollProgress: jest.Mock<number, []>;
  on: jest.Mock<MockApi, [string, (api: MockApi) => void]>;
};

function makeMockApi(progress = 0.5): MockApi {
  const listeners: Record<string, Array<(api: MockApi) => void>> = {};
  const api: MockApi = {
    scrollProgress: jest.fn(() => progress),
    on: jest.fn((event: string, handler: (api: MockApi) => void) => {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(handler);
      return api;
    }),
  };
  return api;
}

describe('useCarouselProgress', () => {
  it('returns 0 when no api', () => {
    const { result } = renderHook(() => useCarouselProgress());
    expect(result.current.value).toBe(0);
  });

  it('returns progress as percentage', () => {
    const api = makeMockApi(0.75) as any;
    const { result } = renderHook(() => useCarouselProgress(api));
    expect(result.current.value).toBe(75);
  });

  it('clamps progress to 0-100', () => {
    const apiOver = makeMockApi(1.5) as any;
    const { result: r1 } = renderHook(() => useCarouselProgress(apiOver));
    expect(r1.current.value).toBe(100);

    const apiUnder = makeMockApi(-0.5) as any;
    const { result: r2 } = renderHook(() => useCarouselProgress(apiUnder));
    expect(r2.current.value).toBe(0);
  });
});
