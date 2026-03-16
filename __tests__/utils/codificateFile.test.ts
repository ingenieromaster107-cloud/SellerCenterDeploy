import { fileToBase64 } from 'src/utils/codificateFile';

describe('fileToBase64', () => {
  it('should convert a text file content to a valid base64 string', async () => {
    const content = 'hello world';
    const file = new File([content], 'test.csv', { type: 'text/csv' });

    const result = await fileToBase64(file);

    // btoa('hello world') === 'aGVsbG8gd29ybGQ='
    expect(result).toBe(btoa(content));
  });

  it('should return an empty string for an empty file', async () => {
    const file = new File([''], 'empty.csv', { type: 'text/csv' });

    const result = await fileToBase64(file);

    expect(result).toBe('');
  });

  it('should return the same base64 regardless of the file name or type', async () => {
    const content = 'same content';
    const csv = new File([content], 'data.csv', { type: 'text/csv' });
    const xml = new File([content], 'data.xml', { type: 'text/xml' });

    const resultCsv = await fileToBase64(csv);
    const resultXml = await fileToBase64(xml);

    expect(resultCsv).toBe(resultXml);
  });

  it('should handle a large file (multiple chunks)', async () => {
    // 0x8000 = 32768 bytes, so we need more than that to force chunking
    const largeContent = 'A'.repeat(100_000);
    const file = new File([largeContent], 'large.csv', { type: 'text/csv' });

    const result = await fileToBase64(file);

    // Verify the result decodes back to the original content
    expect(atob(result)).toBe(largeContent);
  });
});
