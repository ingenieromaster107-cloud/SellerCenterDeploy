import { renderHook } from '@testing-library/react';

import { useMessagesScroll } from './use-messages-scroll';

describe('useMessagesScroll', () => {
  it('returns a messagesEndRef', () => {
    const { result } = renderHook(() => useMessagesScroll([]));
    expect(result.current.messagesEndRef).toBeDefined();
    expect(typeof result.current.messagesEndRef).toBe('object');
  });

  it('ref is initially null (no DOM attached)', () => {
    const { result } = renderHook(() => useMessagesScroll([]));
    expect(result.current.messagesEndRef.current).toBeNull();
  });

  it('re-runs without error when messages change', () => {
    const msgs: any[] = [{ id: '1', body: 'hello' }];
    const { rerender } = renderHook(({ messages }) => useMessagesScroll(messages), {
      initialProps: { messages: msgs },
    });
    expect(() =>
      rerender({ messages: [{ id: '2', body: 'world' }] })
    ).not.toThrow();
  });

  it('handles null/empty messages array', () => {
    expect(() => renderHook(() => useMessagesScroll([]))).not.toThrow();
  });
});
