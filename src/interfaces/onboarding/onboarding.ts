export interface TourState {
  run: boolean;
  stepIndex: number;
  steps: Step[];
  currentTour: string | null;
}
export interface Step {
    content: string;
    target: string;
    placement?: 'top' | 'bottom' | 'left' | 'right';
    requiredPath?: string
}