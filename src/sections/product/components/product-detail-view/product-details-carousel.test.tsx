import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

jest.mock('src/components/lightbox', () => ({
  Lightbox: ({ open }: any) => (open ? <div data-testid="lightbox" /> : null),
  useLightbox: (slides: any[]) => ({
    open: false,
    selected: 0,
    onOpen: jest.fn(),
    onClose: jest.fn(),
    setSelected: jest.fn(),
  }),
}));

jest.mock('src/components/carousel', () => ({
  useCarousel: () => ({
    mainApi: null,
    options: {},
    arrows: { disabledPrev: true, disabledNext: true, onClickPrev: jest.fn(), onClickNext: jest.fn() },
    dots: { dotCount: 0, selectedIndex: 0 },
    thumbs: {
      thumbsRef: { current: null },
      selectedIndex: 0,
      onClickThumb: jest.fn(),
    },
  }),
  Carousel: ({ children }: any) => <div data-testid="carousel">{children}</div>,
  CarouselThumb: ({ src, selected }: any) => <div data-testid="carousel-thumb" data-selected={selected}><img src={src} alt="" /></div>,
  CarouselThumbs: ({ children }: any) => <div data-testid="carousel-thumbs">{children}</div>,
  CarouselArrowNumberButtons: () => <div data-testid="carousel-arrows" />,
}));

import { ProductDetailsCarousel } from './product-details-carousel';

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('ProductDetailsCarousel', () => {
  it('renders carousel component', () => {
    renderWithTheme(<ProductDetailsCarousel images={['img1.jpg', 'img2.jpg']} />);
    expect(screen.getByTestId('carousel')).toBeInTheDocument();
  });

  it('renders carousel thumbs', () => {
    renderWithTheme(<ProductDetailsCarousel images={['img1.jpg', 'img2.jpg']} />);
    expect(screen.getByTestId('carousel-thumbs')).toBeInTheDocument();
  });

  it('renders one thumb per image', () => {
    renderWithTheme(<ProductDetailsCarousel images={['img1.jpg', 'img2.jpg']} />);
    expect(screen.getAllByTestId('carousel-thumb').length).toBe(2);
  });

  it('renders images inside carousel', () => {
    renderWithTheme(<ProductDetailsCarousel images={['img-a.jpg']} />);
    const img = screen.getByRole('img', { hidden: true });
    expect(img).toBeInTheDocument();
  });

  it('renders without crashing with empty images', () => {
    expect(() =>
      renderWithTheme(<ProductDetailsCarousel images={[]} />)
    ).not.toThrow();
  });
});
