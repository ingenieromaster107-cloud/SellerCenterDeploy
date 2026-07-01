import { getMessage } from './get-message';

const participants = [
  { id: 'user-1', name: 'John Doe' },
  { id: 'user-2', name: 'Jane Smith' },
] as any;

describe('getMessage', () => {
  describe('me flag', () => {
    it('returns me=true when procedence is SELLER', () => {
      const message = { procedence: 'SELLER', contentType: 'text' } as any;
      const result = getMessage({ message, participants, currentUserId: 'user-1' });
      expect(result.me).toBe(true);
    });

    it('returns me=false when procedence is not SELLER', () => {
      const message = { procedence: 'BUYER', contentType: 'text' } as any;
      const result = getMessage({ message, participants, currentUserId: 'user-1' });
      expect(result.me).toBe(false);
    });
  });

  describe('hasImage flag', () => {
    it('returns hasImage=true when contentType is image', () => {
      const message = { procedence: 'SELLER', contentType: 'image' } as any;
      const result = getMessage({ message, participants, currentUserId: 'user-1' });
      expect(result.hasImage).toBe(true);
    });

    it('returns hasImage=false when contentType is text', () => {
      const message = { procedence: 'SELLER', contentType: 'text' } as any;
      const result = getMessage({ message, participants, currentUserId: 'user-1' });
      expect(result.hasImage).toBe(false);
    });
  });

  describe('senderDetails', () => {
    it('returns senderDetails.type="me" when procedence is SELLER', () => {
      const message = { procedence: 'SELLER', contentType: 'text' } as any;
      const result = getMessage({ message, participants, currentUserId: 'user-1' });
      expect(result.senderDetails).toEqual({ type: 'me' });
    });

    it('returns senderDetails.firstName with participant name when procedence is not SELLER', () => {
      const message = { procedence: 'BUYER', contentType: 'text' } as any;
      const result = getMessage({ message, participants, currentUserId: 'user-1' });
      expect(result.senderDetails).toMatchObject({ firstName: ' John Doe' });
    });

    it('returns senderDetails.firstName as " Unknown" when participant is not found', () => {
      const message = { procedence: 'BUYER', contentType: 'text' } as any;
      const result = getMessage({ message, participants, currentUserId: 'user-999' });
      expect(result.senderDetails).toMatchObject({ firstName: ' Unknown' });
    });

    it('returns senderDetails.avatarUrl with participant name when procedence is not SELLER', () => {
      const message = { procedence: 'BUYER', contentType: 'text' } as any;
      const result = getMessage({ message, participants, currentUserId: 'user-2' });
      expect(result.senderDetails).toMatchObject({ avatarUrl: 'Jane Smith' });
    });
  });
});
