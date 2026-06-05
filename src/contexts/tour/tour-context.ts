import { createContext } from 'react';

export type TourContextType = {
  runTour: boolean;
  setRunTour: React.Dispatch<React.SetStateAction<boolean>>;
  currentStepIndex: number;
  setCurrentStepIndex: React.Dispatch<React.SetStateAction<number>>;
};

export const TourContext = createContext<TourContextType | null>(null);