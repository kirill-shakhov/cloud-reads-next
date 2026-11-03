import { render, screen } from '@testing-library/react';

import { RegistrationProgressBar } from './RegistrationProgressBar';

describe('RegistrationProgressBar', () => {
  it('exposes the current step to assistive technology', () => {
    render(<RegistrationProgressBar currentStep={2} totalSteps={4} />);

    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '2'
    );
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuemax',
      '4'
    );
  });

  it('shows numbers for the current and upcoming steps and a check for passed ones', () => {
    render(<RegistrationProgressBar currentStep={3} totalSteps={4} />);

    expect(screen.queryByText('1')).not.toBeInTheDocument();
    expect(screen.queryByText('2')).not.toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });
});
