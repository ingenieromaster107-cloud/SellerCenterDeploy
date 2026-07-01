import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

jest.mock('react-hook-form', () => {
  const mockControl = {
    _getWatch: jest.fn(() => ''),
    register: jest.fn(),
    unregister: jest.fn(),
    getFieldState: jest.fn(() => ({ invalid: false, isDirty: false, isTouched: false })),
    _names: { array: new Set(), mount: new Set(), unMount: new Set(), watch: new Set(), focus: '' },
    _subjects: { watch: { next: jest.fn() }, array: { next: jest.fn() }, state: { next: jest.fn() } },
    _formState: { errors: {} },
  };
  return {
    useFormContext: () => ({
      control: mockControl,
      setValue: jest.fn(),
    }),
    Controller: ({ render: renderProp, name }: any) =>
      renderProp({ field: { value: '', onChange: jest.fn(), onBlur: jest.fn(), name, ref: jest.fn() }, fieldState: { error: undefined }, formState: {} }),
  };
});

import { CategoryCascadeSelect } from './category-cascade-select';

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const categories: any[] = [
  {
    id: 1,
    name: 'Electronics',
    children: [
      { id: 11, name: 'Phones', children: [] },
      { id: 12, name: 'Laptops', children: [] },
    ],
  },
  { id: 2, name: 'Clothing', children: [] },
];

describe('CategoryCascadeSelect', () => {
  it('renders the category label', () => {
    renderWithTheme(
      <CategoryCascadeSelect
        name="category"
        label="Main Category"
        categoryTree={categories}
      />
    );
    expect(screen.getAllByText('Main Category').length).toBeGreaterThan(0);
  });

  it('renders selected categories panel label', () => {
    renderWithTheme(
      <CategoryCascadeSelect
        name="category"
        label="Category"
        categoryTree={categories}
        selectedLabel="Selected Categories"
      />
    );
    expect(screen.getByText('Selected Categories')).toBeInTheDocument();
  });

  it('renders placeholder text when no category selected', () => {
    renderWithTheme(
      <CategoryCascadeSelect
        name="category"
        label="Category"
        categoryTree={categories}
        placeholder="Choose a category"
      />
    );
    expect(screen.getAllByText('Choose a category').length).toBeGreaterThan(0);
  });

  it('disables the select when loading', () => {
    renderWithTheme(
      <CategoryCascadeSelect
        name="category"
        label="Category"
        categoryTree={[]}
        loading
      />
    );
    const select = document.querySelector('.MuiInputBase-root');
    expect(select?.classList.contains('Mui-disabled')).toBe(true);
  });

  it('renders without crashing with empty categoryTree', () => {
    expect(() =>
      renderWithTheme(
        <CategoryCascadeSelect
          name="category"
          label="Category"
          categoryTree={[]}
        />
      )
    ).not.toThrow();
  });
});
