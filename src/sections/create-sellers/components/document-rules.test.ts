import {
  COUNTRY_USA,
  COMMON_DOCS,
  COUNTRY_CHINA,
  ALL_DOC_CODES,
  MAX_FILE_SIZE,
  ACCEPTED_MIME,
  PERSON_TYPE_LEGAL,
  getDocRequirements,
  PERSON_TYPE_NATURAL,
} from './document-rules';

describe('document-rules constants', () => {
  it('exports person type constants', () => {
    expect(PERSON_TYPE_NATURAL).toBe('natural_person');
    expect(PERSON_TYPE_LEGAL).toBe('legal_person');
  });

  it('exports country constants', () => {
    expect(COUNTRY_CHINA).toBe('CN');
    expect(COUNTRY_USA).toBe('US');
  });

  it('exports 3 common docs', () => {
    expect(COMMON_DOCS).toHaveLength(3);
    expect(COMMON_DOCS).toContain('national_id_document');
    expect(COMMON_DOCS).toContain('bank_account_document');
    expect(COMMON_DOCS).toContain('business_license_document');
  });

  it('exports MAX_FILE_SIZE as 5MB', () => {
    expect(MAX_FILE_SIZE).toBe(5 * 1024 * 1024);
  });

  it('exports ACCEPTED_MIME as PDF', () => {
    expect(ACCEPTED_MIME).toBe('application/pdf');
  });

  it('ALL_DOC_CODES includes common docs', () => {
    COMMON_DOCS.forEach((doc) => {
      expect(ALL_DOC_CODES).toContain(doc);
    });
  });
});

describe('getDocRequirements', () => {
  it('returns null for unknown country', () => {
    expect(getDocRequirements('XX', PERSON_TYPE_NATURAL)).toBeNull();
  });

  it('returns null for unknown person type', () => {
    expect(getDocRequirements(COUNTRY_CHINA, 'unknown_type')).toBeNull();
  });

  it('returns requirements for China legal', () => {
    const result = getDocRequirements(COUNTRY_CHINA, PERSON_TYPE_LEGAL);
    expect(result).not.toBeNull();
    expect(result!.required).toContain('uscc_document');
    expect(result!.required).toContain('export_license_document');
    COMMON_DOCS.forEach((doc) => expect(result!.required).toContain(doc));
  });

  it('returns requirements for China natural', () => {
    const result = getDocRequirements(COUNTRY_CHINA, PERSON_TYPE_NATURAL);
    expect(result).not.toBeNull();
    expect(result!.required).toContain('personal_tax_identification_document');
  });

  it('returns oneOf options for USA legal', () => {
    const result = getDocRequirements(COUNTRY_USA, PERSON_TYPE_LEGAL);
    expect(result).not.toBeNull();
    expect(result!.oneOf.length).toBeGreaterThan(0);
    const flatOneOf = result!.oneOf.flat();
    expect(flatOneOf).toContain('ssn_document');
    expect(flatOneOf).toContain('itin_document');
  });

  it('required list includes common docs for all valid combinations', () => {
    const combinations = [
      [COUNTRY_CHINA, PERSON_TYPE_LEGAL],
      [COUNTRY_CHINA, PERSON_TYPE_NATURAL],
      [COUNTRY_USA, PERSON_TYPE_LEGAL],
      [COUNTRY_USA, PERSON_TYPE_NATURAL],
    ];
    combinations.forEach(([country, personType]) => {
      const result = getDocRequirements(country, personType);
      expect(result).not.toBeNull();
      COMMON_DOCS.forEach((doc) => expect(result!.required).toContain(doc));
    });
  });
});
