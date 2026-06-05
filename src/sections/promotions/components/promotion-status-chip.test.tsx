import { render, screen } from '@testing-library/react';

import { PromotionStatusChip } from './promotion-status-chip';

jest.mock('src/locales/langs/i18n', () => ({
  useTranslate: () => ({
    translate: (_ns: string, key?: string) => key ?? _ns,
    currentLang: 'es',
  }),
}));

jest.mock('src/components/label', () => ({
  Label: ({ children, color }: any) => (
    <span data-testid="label" data-color={color}>{children}</span>
  ),
}));

describe('PromotionStatusChip', () => {
  it('renders the translated status key for ACTIVE', () => {
    render(<PromotionStatusChip status="ACTIVE" />);
    expect(screen.getByTestId('label')).toHaveTextContent('promotionsModule.status.ACTIVE');
  });

  it('renders the translated status key for PAUSED', () => {
    render(<PromotionStatusChip status="PAUSED" />);
    expect(screen.getByTestId('label')).toHaveTextContent('promotionsModule.status.PAUSED');
  });

  it('renders the translated status key for PENDING_APPROVAL', () => {
    render(<PromotionStatusChip status="PENDING_APPROVAL" />);
    expect(screen.getByTestId('label')).toHaveTextContent('promotionsModule.status.PENDING_APPROVAL');
  });

  it('renders the translated status key for EXPIRED', () => {
    render(<PromotionStatusChip status="EXPIRED" />);
    expect(screen.getByTestId('label')).toHaveTextContent('promotionsModule.status.EXPIRED');
  });

  it('renders the translated status key for EXHAUSTED', () => {
    render(<PromotionStatusChip status="EXHAUSTED" />);
    expect(screen.getByTestId('label')).toHaveTextContent('promotionsModule.status.EXHAUSTED');
  });

  it('applies success color for ACTIVE status', () => {
    render(<PromotionStatusChip status="ACTIVE" />);
    expect(screen.getByTestId('label')).toHaveAttribute('data-color', 'success');
  });

  it('applies warning color for PENDING_APPROVAL status', () => {
    render(<PromotionStatusChip status="PENDING_APPROVAL" />);
    expect(screen.getByTestId('label')).toHaveAttribute('data-color', 'warning');
  });

  it('applies error color for EXPIRED status', () => {
    render(<PromotionStatusChip status="EXPIRED" />);
    expect(screen.getByTestId('label')).toHaveAttribute('data-color', 'error');
  });

  it('applies info color for EXHAUSTED status', () => {
    render(<PromotionStatusChip status="EXHAUSTED" />);
    expect(screen.getByTestId('label')).toHaveAttribute('data-color', 'info');
  });

  it('applies default color for PAUSED status', () => {
    render(<PromotionStatusChip status="PAUSED" />);
    expect(screen.getByTestId('label')).toHaveAttribute('data-color', 'default');
  });
});
