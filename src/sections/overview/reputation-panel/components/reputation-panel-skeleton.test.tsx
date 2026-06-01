import { render } from '@testing-library/react';

import { ReputationPanelSkeleton } from './reputation-panel-skeleton';

describe('ReputationPanelSkeleton', () => {
  it('renders multiple skeleton placeholders without crashing', () => {
    const { container } = render(<ReputationPanelSkeleton />);
    expect(container.querySelectorAll('.MuiSkeleton-root').length).toBeGreaterThan(0);
  });
});
