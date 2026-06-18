import type { ProductPromotionInterface } from 'src/interfaces';

import { render, screen } from '@testing-library/react';

import { ProductPromotions } from './product-promotions';

jest.mock('src/locales', () => ({
  useTranslate: () => ({
    translate: (namespaceOrKey: string, key?: string) => key ?? namespaceOrKey,
    currentLang: 'es',
  }),
}));

jest.mock('src/utils/format-number', () => ({
  fCurrency: (v: number) => `$${v}`,
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid={`icon-${icon}`} />,
}));

const percentPromo: ProductPromotionInterface = {
  promotion_id: 1,
  name: 'Promo Porcentaje',
  discount_type: 'BY_PERCENT',
  apply_type: 'AUTOMATIC',
  discount_amount: 15,
  coupon_code: null,
};

const fixedCouponPromo: ProductPromotionInterface = {
  promotion_id: 2,
  name: 'Valor fijo',
  discount_type: 'BY_FIXED',
  apply_type: 'COUPON',
  discount_amount: 10000,
  coupon_code: 'AHORRA10',
};

describe('ProductPromotions', () => {
  it('renders nothing when there are no promotions', () => {
    const { container } = render(<ProductPromotions promotions={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the percent decorator for BY_PERCENT and hides coupon for AUTOMATIC', () => {
    render(<ProductPromotions promotions={[percentPromo]} />);

    expect(screen.getByText('Promo Porcentaje')).toBeInTheDocument();
    expect(screen.getByText(/15%/)).toBeInTheDocument();
    expect(screen.queryByText(/promotions\.coupon/)).not.toBeInTheDocument();
  });

  it('renders the money decorator for BY_FIXED and shows the coupon code for COUPON', () => {
    render(<ProductPromotions promotions={[fixedCouponPromo]} />);

    expect(screen.getByText('Valor fijo')).toBeInTheDocument();
    expect(screen.getByText(/\$10000/)).toBeInTheDocument();
    expect(screen.getByText(/AHORRA10/)).toBeInTheDocument();
  });
});
