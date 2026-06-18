import { render } from '@testing-library/react';

const mockUseIdleTimer = jest.fn();

jest.mock('react-idle-timer', () => ({
  useIdleTimer: (opts: unknown) => mockUseIdleTimer(opts),
}));

import { IdleTimer } from './idle-timer';

describe('IdleTimer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('forwards timeout and onIdle to react-idle-timer and renders nothing', () => {
    const onIdle = jest.fn();
    const { container } = render(<IdleTimer timeout={5000} onIdle={onIdle} />);

    expect(container).toBeEmptyDOMElement();
    expect(mockUseIdleTimer).toHaveBeenCalledTimes(1);

    const opts = mockUseIdleTimer.mock.calls[0][0];
    expect(opts.timeout).toBe(5000);
    expect(opts.onIdle).toBe(onIdle);
    expect(opts.throttle).toBe(1000);
  });
});
