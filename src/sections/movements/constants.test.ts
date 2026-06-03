import { MOVEMENT_CATEGORY, MOVEMENT_CATEGORY_COLOR } from './constants';

describe('movements constants', () => {
  it('exposes the backend category values', () => {
    expect(MOVEMENT_CATEGORY).toEqual({
      SALE: 'VENTA',
      COMMISSION: 'COMISION',
      REFUND: 'DEVOLUCION',
    });
  });

  it('maps every category to a label color', () => {
    expect(MOVEMENT_CATEGORY_COLOR[MOVEMENT_CATEGORY.SALE]).toBe('success');
    expect(MOVEMENT_CATEGORY_COLOR[MOVEMENT_CATEGORY.COMMISSION]).toBe('warning');
    expect(MOVEMENT_CATEGORY_COLOR[MOVEMENT_CATEGORY.REFUND]).toBe('error');
  });

  it('has a color entry for each category', () => {
    const categories = Object.values(MOVEMENT_CATEGORY);
    expect(Object.keys(MOVEMENT_CATEGORY_COLOR).sort()).toEqual([...categories].sort());
  });
});
