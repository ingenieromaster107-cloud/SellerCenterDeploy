import { PERMISSIONS, ACCOUNT_STATUS } from './status';

describe('sub-account/constants/status', () => {
  describe('PERMISSIONS', () => {
    it('is a non-empty array', () => {
      expect(Array.isArray(PERMISSIONS)).toBe(true);
      expect(PERMISSIONS.length).toBeGreaterThan(0);
    });

    it('each permission has value, label and color', () => {
      PERMISSIONS.forEach((perm) => {
        expect(typeof perm.value).toBe('string');
        expect(typeof perm.label).toBe('string');
        expect(typeof perm.color).toBe('string');
      });
    });

    it('includes Product list permission', () => {
      const perm = PERMISSIONS.find((p) => p.label === 'Product list');
      expect(perm).toBeDefined();
      expect(perm?.value).toBe('marketplace/product/draftproduct');
    });

    it('includes subaccount manage permission', () => {
      const perm = PERMISSIONS.find((p) => p.value === 'sellersubaccount/account/manage');
      expect(perm).toBeDefined();
    });

    it('has 19 permissions defined', () => {
      expect(PERMISSIONS).toHaveLength(19);
    });
  });

  describe('ACCOUNT_STATUS', () => {
    it('has ACTIVE status with success color', () => {
      const active = ACCOUNT_STATUS.find((s) => s.value === 'ACTIVE');
      expect(active).toBeDefined();
      expect(active?.color).toBe('success');
      expect(active?.label).toBe('Active');
    });

    it('has INACTIVE status with default color', () => {
      const inactive = ACCOUNT_STATUS.find((s) => s.value === 'INACTIVE');
      expect(inactive).toBeDefined();
      expect(inactive?.color).toBe('default');
      expect(inactive?.label).toBe('Inactive');
    });

    it('has exactly 2 statuses', () => {
      expect(ACCOUNT_STATUS).toHaveLength(2);
    });
  });
});
