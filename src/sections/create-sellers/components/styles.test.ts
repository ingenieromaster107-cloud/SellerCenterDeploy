import { darkFieldSx, FORM_MAX_WIDTH } from './styles';

describe('create-sellers styles', () => {
  it('exports FORM_MAX_WIDTH as 712', () => {
    expect(FORM_MAX_WIDTH).toBe(712);
  });

  it('exports darkFieldSx as an object', () => {
    expect(typeof darkFieldSx).toBe('object');
    expect(darkFieldSx).not.toBeNull();
  });

  it('darkFieldSx targets MuiOutlinedInput-notchedOutline', () => {
    const sx = darkFieldSx as Record<string, any>;
    expect(sx['& .MuiOutlinedInput-notchedOutline']).toBeDefined();
    expect(sx['& .MuiOutlinedInput-notchedOutline'].borderColor).toBe('common.white');
  });

  it('darkFieldSx targets MuiInputBase-input for white color', () => {
    const sx = darkFieldSx as Record<string, any>;
    expect(sx['& .MuiInputBase-input']).toBeDefined();
    expect(sx['& .MuiInputBase-input'].color).toBe('common.white');
  });
});
