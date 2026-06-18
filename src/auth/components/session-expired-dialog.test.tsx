import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('src/locales', () => ({
  useTranslate: () => ({ translate: (key: string) => key }),
}));

import { SessionExpiredDialog } from './session-expired-dialog';

describe('SessionExpiredDialog', () => {
  it('shows the inactivity message when reason is "idle"', () => {
    render(<SessionExpiredDialog open reason="idle" onConfirm={jest.fn()} />);

    expect(screen.getByText('session.expiredByInactivityTitle')).toBeInTheDocument();
    expect(screen.getByText('session.expiredByInactivityMessage')).toBeInTheDocument();
  });

  it('shows the unauthorized message when reason is "unauthorized"', () => {
    render(<SessionExpiredDialog open reason="unauthorized" onConfirm={jest.fn()} />);

    expect(screen.getByText('session.expiredTitle')).toBeInTheDocument();
    expect(screen.getByText('session.expiredMessage')).toBeInTheDocument();
  });

  it('does not render content when closed', () => {
    render(<SessionExpiredDialog open={false} reason="idle" onConfirm={jest.fn()} />);

    expect(screen.queryByText('session.expiredByInactivityTitle')).not.toBeInTheDocument();
  });

  it('calls onConfirm when the action button is clicked', () => {
    const onConfirm = jest.fn();
    render(<SessionExpiredDialog open reason="idle" onConfirm={onConfirm} />);

    fireEvent.click(screen.getByRole('button', { name: 'session.goToLogin' }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
