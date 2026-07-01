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

jest.mock('@mui/x-tree-view/RichTreeView', () => ({
  RichTreeView: ({ items }: any) => (
    <ul data-testid="rich-tree-view">
      {items.map((item: any) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  ),
}));

jest.mock('@mui/x-tree-view/TreeItem', () => ({
  TreeItem: ({ label, children }: any) => <div>{label}{children}</div>,
  treeItemClasses: {
    groupTransition: 'tree-item-group-transition',
    content: 'tree-item-content',
    selected: 'tree-item-selected',
    label: 'tree-item-label',
    iconContainer: 'tree-item-icon-container',
  },
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid="iconify" data-icon={icon} />,
}));

import { CategoryTreeSelect } from './category-tree-select';

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const categories: any[] = [
  {
    id: 1,
    name: 'Electronics',
    children: [
      { id: 11, name: 'Phones', children: [] },
    ],
  },
  { id: 2, name: 'Clothing', children: [] },
];

describe('CategoryTreeSelect', () => {
  it('renders the label', () => {
    renderWithTheme(
      <CategoryTreeSelect
        name="category"
        label="Category"
        categoryTree={categories}
      />
    );
    expect(screen.getByText('Category')).toBeInTheDocument();
  });

  it('renders the selectedLabel panel', () => {
    renderWithTheme(
      <CategoryTreeSelect
        name="category"
        label="Category"
        categoryTree={categories}
        selectedLabel="My Categories"
      />
    );
    expect(screen.getByText('My Categories')).toBeInTheDocument();
  });

  it('renders the tree view with category items', () => {
    renderWithTheme(
      <CategoryTreeSelect
        name="category"
        categoryTree={categories}
      />
    );
    expect(screen.getByTestId('rich-tree-view')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('Clothing')).toBeInTheDocument();
  });

  it('shows loading text when loading', () => {
    renderWithTheme(
      <CategoryTreeSelect
        name="category"
        categoryTree={[]}
        loading
        loadingText="Loading..."
      />
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows empty message when no categories', () => {
    renderWithTheme(
      <CategoryTreeSelect
        name="category"
        categoryTree={[]}
      />
    );
    expect(screen.getByText('No hay categorías disponibles')).toBeInTheDocument();
  });

  it('renders search placeholder', () => {
    renderWithTheme(
      <CategoryTreeSelect
        name="category"
        categoryTree={categories}
      />
    );
    expect(screen.getByPlaceholderText('Buscar categoría...')).toBeInTheDocument();
  });

  it('shows empty placeholder when no selection', () => {
    renderWithTheme(
      <CategoryTreeSelect
        name="category"
        categoryTree={categories}
        placeholder="Pick a category"
      />
    );
    expect(screen.getByText('Pick a category')).toBeInTheDocument();
  });
});
