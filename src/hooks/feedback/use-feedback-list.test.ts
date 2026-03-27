import React from 'react';
import { act, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useFeedbackList } from './use-feedback-list';

jest.mock('src/actions/feedback/useGetFeedback', () => ({
  useGetFeedback: jest.fn(),
}));

jest.mock('src/locales', () => ({
  useTranslate: () => ({
    translate: (ns: string, key?: string) => (key ? `${ns}.${key}` : ns),
    currentLang: 'es',
  }),
}));

import { useGetFeedback } from 'src/actions/feedback/useGetFeedback';

const mockFeedbackData = {
  feedbackListAdapter: [
    {
      created_at: '2024-01-01',
      image: '/img.jpg',
      nickname: 'user1',
      ratings_breakdown: [
        { name: 'Price', value: '4' },
        { name: 'Value', value: '5' },
        { name: 'Quality', value: '3' },
      ],
      name: 'Product A',
      sku: 'SKU-001',
      status: 'APPROVED',
      text: 'Great!',
      summary: 'Good summary',
    },
  ],
};

const createWrapper = () => {
  const qc = new QueryClient();
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: qc }, children);
};

describe('useFeedbackList', () => {
  beforeEach(() => {
    (useGetFeedback as jest.Mock).mockReturnValue({
      reviews: mockFeedbackData,
      isError: false,
      isLoading: false,
    });
  });

  it('returns reviewsList with formatted items', () => {
    const { result } = renderHook(() => useFeedbackList(), { wrapper: createWrapper() });
    expect(result.current.reviewsList).toHaveLength(1);
    expect(result.current.reviewsList[0].sku).toBe('SKU-001');
    expect(result.current.reviewsList[0].price).toBe('4');
    expect(result.current.reviewsList[0].value).toBe('5');
    expect(result.current.reviewsList[0].quality).toBe('3');
  });

  it('returns N/A when rating not found in breakdown', () => {
    (useGetFeedback as jest.Mock).mockReturnValue({
      reviews: {
        feedbackListAdapter: [
          {
            ...mockFeedbackData.feedbackListAdapter[0],
            ratings_breakdown: [],
          },
        ],
      },
      isError: false,
      isLoading: false,
    });
    const { result } = renderHook(() => useFeedbackList(), { wrapper: createWrapper() });
    expect(result.current.reviewsList[0].price).toBe('N/A');
    expect(result.current.reviewsList[0].value).toBe('N/A');
    expect(result.current.reviewsList[0].quality).toBe('N/A');
  });

  it('returns tableHead with expected columns', () => {
    const { result } = renderHook(() => useFeedbackList(), { wrapper: createWrapper() });
    expect(result.current.tableHead.length).toBeGreaterThan(0);
    expect(result.current.tableHead.some((h: any) => h.id === 'sku')).toBe(true);
  });

  it('returns handleFilterClick function', () => {
    const { result } = renderHook(() => useFeedbackList(), { wrapper: createWrapper() });
    expect(typeof result.current.handleFilterClick).toBe('function');
  });

  it('handleFilterClick updates filter state', () => {
    const { result } = renderHook(() => useFeedbackList(), { wrapper: createWrapper() });
    act(() => {
      result.current.handleFilterClick('5');
    });
    expect(useGetFeedback).toHaveBeenCalled();
  });

  it('returns isLoading and isError from underlying hook', () => {
    (useGetFeedback as jest.Mock).mockReturnValue({
      reviews: { feedbackListAdapter: [] },
      isError: true,
      isLoading: false,
    });
    const { result } = renderHook(() => useFeedbackList(), { wrapper: createWrapper() });
    expect(result.current.isError).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });
});
