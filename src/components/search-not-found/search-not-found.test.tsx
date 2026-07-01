import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('src/locales', () => ({
  useTranslate: () => ({
    translate: (key: string) => {
      const map: Record<string, string> = {
        'chatModule.sideBar.contactsSearcher.errorMessages.notFound': 'Not found',
        'chatModule.sideBar.contactsSearcher.errorMessages.notResultsFoundFor': 'No results found for',
        'chatModule.sideBar.contactsSearcher.errorMessages.tryWithAnotherKeyword': 'Try with another keyword',
      };
      return map[key] ?? key;
    },
  }),
}));

import { SearchNotFound } from './search-not-found';

describe('SearchNotFound', () => {
  it('renders text when no query', () => {
    render(<SearchNotFound />);
    expect(screen.getByText('Not found')).toBeInTheDocument();
  });

  it('renders "Not found" heading when query is provided', () => {
    render(<SearchNotFound query="test query" />);
    expect(screen.getByRole('heading', { name: /Not found/i })).toBeInTheDocument();
  });

  it('renders query text in results', () => {
    render(<SearchNotFound query="my search" />);
    expect(screen.getByText(/"my search"/)).toBeInTheDocument();
  });

  it('does not render heading element when no query', () => {
    render(<SearchNotFound />);
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });
});
