import React from 'react';
import { render, screen } from '@testing-library/react';

import { FloatingScrollbar } from './floating-scrollbar';

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
});

describe('FloatingScrollbar', () => {
  it('renders its children', () => {
    render(
      <FloatingScrollbar scrollerSelector=".test-scroller">
        <div className="test-scroller">content</div>
      </FloatingScrollbar>
    );

    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('renders children even when the scroller selector does not match', () => {
    render(
      <FloatingScrollbar scrollerSelector=".missing">
        <div>plain content</div>
      </FloatingScrollbar>
    );

    expect(screen.getByText('plain content')).toBeInTheDocument();
  });
});
