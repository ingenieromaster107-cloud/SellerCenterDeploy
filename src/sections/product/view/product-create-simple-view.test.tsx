import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { ProductCreateSimpleView } from './product-create-simple-view';

jest.mock('@mui/lab/LoadingButton', () => ({
  __esModule: true,
  default: ({ children, onClick }: any) => (
    <button type="submit" onClick={onClick}>{children}</button>
  ),
}));

jest.mock('@hookform/resolvers/zod', () => ({
  zodResolver: () => async () => ({ values: {}, errors: {} }),
}));

jest.mock('react-hook-form', () => {
  const fakeForm = () => ({
    control: { _defaultValues: {} },
    register: jest.fn(() => ({ onChange: jest.fn(), onBlur: jest.fn(), ref: jest.fn() })),
    handleSubmit: (fn: any) => (e: any) => { e?.preventDefault?.(); },
    formState: { errors: {}, isSubmitting: false },
    watch: jest.fn(),
    setValue: jest.fn(),
    getValues: jest.fn(() => ({})),
    reset: jest.fn(),
  });
  return {
    ...jest.requireActual('react-hook-form'),
    useForm: fakeForm,
    useFormContext: fakeForm,
    Controller: ({ render: renderFn }: any) =>
      renderFn({
        field: { value: '', onChange: jest.fn(), onBlur: jest.fn(), ref: jest.fn(), name: '' },
        fieldState: { error: undefined },
      }),
  };
});

jest.mock('src/routes/paths', () => ({
  paths: { home: { root: '/' }, product: { root: '/products' } },
}));

jest.mock('src/routes/hooks', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('src/hooks/product', () => ({
  useSimpleProductPayload: () => ({ buildPayload: jest.fn() }),
}));

jest.mock('src/locales', () => ({
  useTranslate: () => ({ translate: (_ns: string, key: string) => key }),
}));

jest.mock('src/layouts/home', () => ({
  HomeContent: ({ children }: any) => <div data-testid="home-content">{children}</div>,
}));

jest.mock('src/actions/category/use-categories', () => ({
  useCategories: () => ({ categoryTree: [], categoriesLoading: false }),
}));

jest.mock('src/actions/product/use-create-product', () => ({
  useCreateProduct: () => ({ mutateAsync: jest.fn(), isPending: false }),
}));

jest.mock('src/components/snackbar', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock('src/components/hook-form', () => ({
  Form: ({ children }: any) => <form>{children}</form>,
  Field: {
    Text: ({ name, label }: any) => <input data-testid={`field-${name}`} placeholder={label} />,
    Select: ({ name, label, children }: any) => (
      <select data-testid={`select-${name}`} aria-label={label}>{children}</select>
    ),
    Editor: ({ name }: any) => <textarea data-testid={`field-editor-${name}`} />,
  },
}));

jest.mock('src/components/custom-breadcrumbs', () => ({
  CustomBreadcrumbs: ({ heading }: any) => <div data-testid="breadcrumbs">{heading}</div>,
}));

jest.mock('src/components/loading-screen', () => ({
  SectionLoadingOverlay: () => null,
}));

jest.mock('../components/product-image-upload', () => ({
  ProductImageUpload: () => <div data-testid="image-upload" />,
}));

jest.mock('../components/category-tree-select', () => ({
  CategoryTreeSelect: () => <div data-testid="category-tree-select" />,
}));

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('ProductCreateSimpleView', () => {
  it('renders home content', () => {
    renderWithTheme(<ProductCreateSimpleView />);
    expect(screen.getByTestId('home-content')).toBeInTheDocument();
  });

  it('renders breadcrumbs', () => {
    renderWithTheme(<ProductCreateSimpleView />);
    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
  });

  it('renders image upload component', () => {
    renderWithTheme(<ProductCreateSimpleView />);
    expect(screen.getByTestId('image-upload')).toBeInTheDocument();
  });

  it('renders category tree select', () => {
    renderWithTheme(<ProductCreateSimpleView />);
    expect(screen.getByTestId('category-tree-select')).toBeInTheDocument();
  });
});
