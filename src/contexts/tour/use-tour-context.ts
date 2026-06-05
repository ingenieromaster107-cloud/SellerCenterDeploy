'use client';

import { useContext } from 'react';

import { TourContext } from './tour-context';

// ----------------------------------------------------------------------

export function useTourContext() {
  const context = useContext(TourContext);

  if (!context) {
    throw new Error('useTourContext must be used within AppTour');
  }

  return context;
}
