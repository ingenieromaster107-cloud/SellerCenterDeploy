import {
  today,
  fDateTime,
  fDate,
  fToNow,
  fTimestamp,
  fTime,
  fSub,
  fIsSame,
  fDateRangeShortLabel,
  fAdd,
  DurationProps,
} from 'src/utils/format-time';

describe('today', () => {
  it("should return today's date in the default format", () => {
    const result = today();
    const expected = new Date().toISOString().split('T')[0] + ' 00:00:00';
    expect(result).toBe(expected);
  });
});

describe('fDateTime', () => {
  it('should format a valid date-time string correctly', () => {
    const result = fDateTime('2022-04-17T00:00:00');
    expect(result).toBe('17 Apr 2022 12:00 am');
  });
  it('should format an invalid date-time string invalid', () => {
    const result = fDateTime('invalid-date-time');
    expect(result).toBe('Invalid');
  });
    it('should format an invalid date-time string invalid', () => {
    const result = fDateTime(undefined);
    expect(result).toBe('');
  });
});

describe('fDate', () => {
  it('should format a valid date string correctly', () => {
    const result = fDate('2022-04-17');
    expect(result).toBe('17 Apr 2022');
  });
});

describe('fToNow', () => {
  it('should return a relative time string for a past datae', () => {
    const pastDate = new Date(Date.now() - 60 * 1000);
    const result = fToNow(pastDate);
    expect(result).toBe('a minute ago');
  });
});

describe('fTime', () => {
  it('should format a valid time string correctly', () => {
    const result = fTime('2022-04-17T00:00:00');
    expect(result).toBe('12:00 am');
  });
});

describe('fSub', () => {
  it('should subtract the specified amount of time from the given date', () => {
    const objectResolve: DurationProps = {
      years: 2,
      months: 1,
      days: 1,
      hours: 2,
      minutes: 30,
      seconds: 15,
      milliseconds: 500,
    };
    const result = fSub(objectResolve);
    expect(result).toBe('16 Apr 2022 12:00 am');
  });
});

describe('fTimestamp', () => {
  it('should convert a valid date string to a timestamp', () => {
    const result = fTimestamp('2022-04-17');
    expect(result).toBe(1650153600000);
  });
});

describe('fIsSame', () => {
  it('should return true for the same date', () => {
    const result = fIsSame('2022-04-17', '2022-04-17');
    expect(result).toBe(true);
  });
  it('should return a short label when both the end and initial dates are invalid', () => {
    const result = fIsSame('2024-04-01', '2023-05-01', 'year');
    expect(result).toBe(false);
  });
});

describe('fDateRangeShortLabel', () => {
  it('should return a short label for a date range', () => {
    const result = fDateRangeShortLabel('2022-04-17', '2022-04-20');
    expect(result).toBe('17 - 20 Apr 2022');
  });
  it('should return a short label when any input is invalid', () => {
    const result = fDateRangeShortLabel('invalid-date', '2022-04-20');
    expect(result).toBe('Invalid');
  });
  it('should return a short label when the value initial is true', () => {
    const result = fDateRangeShortLabel('2022-04-17', '2022-04-20', true);
    expect(result).toBe('17 Apr 2022 - 20 Apr 2022');
  });
  it('should return a short label when the dates are same', () => {
    const result = fDateRangeShortLabel('2022-04-17', '2022-04-17');
    expect(result).toBe('17 Apr 2022');
  });
  it('should return a short label when the years are same', () => {
    const result = fDateRangeShortLabel('2024-04-25', '2024-05-26');
    expect(result).toBe('25 Apr - 26 May 2024');
  });
  it('should return a short label when the years are same', () => {
    const result = fDateRangeShortLabel('2022-04-17', '2022-04-20');
    expect(result).toBe('17 Apr 2022 - 20 Apr 2022');
  });
  it('should return a short label when both the end and initial dates are invalid', () => {
    const result = fDateRangeShortLabel('2026-13-40', '2026-13-40');
    expect(result).toBe('Invalid');
  });
});

describe('fAdd', () => {
  it('should add the specified amount of time to the given date', () => {
    const objectResolve: DurationProps = {
      years: 2,
      months: 1,
      days: 1,
      hours: 2,
      minutes: 30,
      seconds: 15,
      milliseconds: 500,
    };
    const result = fAdd(objectResolve);
    expect(result).toBe('17 Apr 2022 12:00 am');
  });
});
