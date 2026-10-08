/**
 * Stepper — multi-step progress indicator for forms.
 */
import React from 'react';
import { Check } from 'lucide-react';
import styles from './Stepper.module.css';

export interface StepItem {
  id: string | number;
  label: string;
}

export interface StepperProps {
  steps: StepItem[];
  currentStep: number; // 0-indexed
  onStepClick?: (stepIndex: number) => void;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onStepClick,
  className = '',
}) => {
  return (
    <nav className={[styles.stepper, className].filter(Boolean).join(' ')} aria-label="Progress">
      {steps.map((step, index) => {
        const isDone = index < currentStep;
        const isCurrent = index === currentStep;

        return (
          <div key={step.id} className={styles.stepWrapper}>
            <button
              type="button"
              className={[
                styles.stepButton,
                isDone ? styles.done : '',
                isCurrent ? styles.current : '',
              ].filter(Boolean).join(' ')}
              onClick={() => onStepClick && onStepClick(index)}
              disabled={!onStepClick || index > currentStep}
            >
              <span className={styles.badge}>
                {isDone ? <Check size={12} strokeWidth={3} /> : index + 1}
              </span>
              <span className={styles.label}>{step.label}</span>
            </button>
            {index < steps.length - 1 && (
              <div className={[styles.connector, isDone ? styles.connectorDone : ''].filter(Boolean).join(' ')} />
            )}
          </div>
        );
      })}
    </nav>
  );
};

