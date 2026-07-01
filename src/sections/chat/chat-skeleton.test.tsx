import { render, screen } from '@testing-library/react';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import {
  ChatRoomSkeleton,
  ChatHeaderSkeleton,
  ChatNavItemSkeleton,
} from './chat-skeleton';

const theme = createTheme({ cssVariables: true } as any);
const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('ChatNavItemSkeleton', () => {
  it('renders default 6 skeleton items', () => {
    const { container } = renderWithTheme(<ChatNavItemSkeleton />);
    const skeletons = container.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons.length).toBeGreaterThanOrEqual(6);
  });

  it('renders custom item count', () => {
    const { container } = renderWithTheme(<ChatNavItemSkeleton itemCount={3} />);
    const circles = container.querySelectorAll('.MuiSkeleton-circular');
    expect(circles.length).toBe(3);
  });
});

describe('ChatHeaderSkeleton', () => {
  it('renders without crashing', () => {
    renderWithTheme(<ChatHeaderSkeleton />);
    expect(document.body).toBeInTheDocument();
  });

  it('renders skeleton elements', () => {
    const { container } = renderWithTheme(<ChatHeaderSkeleton />);
    const skeletons = container.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});

describe('ChatRoomSkeleton', () => {
  it('renders without crashing', () => {
    renderWithTheme(<ChatRoomSkeleton />);
    expect(document.body).toBeInTheDocument();
  });

  it('renders circular progress', () => {
    renderWithTheme(<ChatRoomSkeleton />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
