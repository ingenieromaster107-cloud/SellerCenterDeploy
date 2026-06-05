import { useMemo, useState } from 'react';

import { TourContext } from './tour-context';

type Props = {
  children: React.ReactNode;
};

export function TourProvider({ children }: Props) {
  const [runTour, setRunTour] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const value = useMemo(
    () => ({
      runTour,
      setRunTour,
      currentStepIndex,
      setCurrentStepIndex,
    }),
    [runTour, currentStepIndex]
  );

  return (
    <TourContext.Provider value={value}>
        {children}
    </TourContext.Provider>
  );
}