import { render } from '@testing-library/react';

import { notificationIcons } from './icons';

describe('notificationIcons', () => {
  it('has order icon defined', () => {
    expect(notificationIcons.order).toBeDefined();
  });

  it('has chat icon defined', () => {
    expect(notificationIcons.chat).toBeDefined();
  });

  it('has mail icon defined', () => {
    expect(notificationIcons.mail).toBeDefined();
  });

  it('has delivery icon defined', () => {
    expect(notificationIcons.delivery).toBeDefined();
  });

  it('renders order icon as valid SVG', () => {
    const { container } = render(<>{notificationIcons.order}</>);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders chat icon as valid SVG', () => {
    const { container } = render(<>{notificationIcons.chat}</>);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders mail icon as valid SVG', () => {
    const { container } = render(<>{notificationIcons.mail}</>);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders delivery icon as valid SVG', () => {
    const { container } = render(<>{notificationIcons.delivery}</>);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('has exactly 4 icon types', () => {
    expect(Object.keys(notificationIcons)).toHaveLength(4);
  });
});
