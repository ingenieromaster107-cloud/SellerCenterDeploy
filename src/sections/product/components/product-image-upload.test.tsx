import { render, screen, fireEvent } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { ProductImageUpload } from './product-image-upload';

jest.mock('src/locales', () => ({
  useTranslate: () => ({
    translate: (_ns: string, key: string) => key,
  }),
}));

jest.mock('src/components/iconify', () => ({
  Iconify: ({ icon }: any) => <span data-testid="iconify" data-icon={icon} />,
}));

global.URL.createObjectURL = jest.fn(() => 'blob:test-url');

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const makeImage = (name: string) => ({
  file: new File(['content'], name, { type: 'image/jpeg' }),
  preview: `blob:test/${name}`,
});

describe('ProductImageUpload', () => {
  it('renders format hint text', () => {
    renderWithTheme(
      <ProductImageUpload images={[]} onAdd={jest.fn()} onRemove={jest.fn()} />
    );
    expect(screen.getByText('formatHint')).toBeInTheDocument();
  });

  it('shows add button when below maxImages', () => {
    renderWithTheme(
      <ProductImageUpload images={[]} onAdd={jest.fn()} onRemove={jest.fn()} maxImages={5} />
    );
    expect(screen.getByText('addImages')).toBeInTheDocument();
  });

  it('does not show add button when at maxImages', () => {
    const images = Array.from({ length: 5 }, (_, i) => makeImage(`img${i}.jpg`));
    renderWithTheme(
      <ProductImageUpload images={images} onAdd={jest.fn()} onRemove={jest.fn()} maxImages={5} />
    );
    expect(screen.queryByText('addImages')).not.toBeInTheDocument();
  });

  it('renders image previews for each image', () => {
    const images = [makeImage('photo1.jpg'), makeImage('photo2.jpg')];
    renderWithTheme(
      <ProductImageUpload images={images} onAdd={jest.fn()} onRemove={jest.fn()} />
    );
    const imgs = screen.getAllByRole('img');
    expect(imgs).toHaveLength(2);
  });

  it('marks first image as main', () => {
    const images = [makeImage('main.jpg'), makeImage('other.jpg')];
    renderWithTheme(
      <ProductImageUpload images={images} onAdd={jest.fn()} onRemove={jest.fn()} />
    );
    expect(screen.getByText('main')).toBeInTheDocument();
  });

  it('calls onRemove when remove button clicked', () => {
    const onRemove = jest.fn();
    const images = [makeImage('remove-me.jpg')];
    renderWithTheme(
      <ProductImageUpload images={images} onAdd={jest.fn()} onRemove={onRemove} />
    );
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    expect(onRemove).toHaveBeenCalledWith(0);
  });

  it('shows image count text when images are present', () => {
    const images = [makeImage('a.jpg')];
    renderWithTheme(
      <ProductImageUpload images={images} onAdd={jest.fn()} onRemove={jest.fn()} maxImages={5} />
    );
    expect(screen.getByText(/1\/5/)).toBeInTheDocument();
  });
});
