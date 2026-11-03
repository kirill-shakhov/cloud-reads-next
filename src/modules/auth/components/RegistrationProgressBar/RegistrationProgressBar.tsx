interface RegistrationProgressBarProps {
  currentStep?: number;
  totalSteps?: number;
  className?: string;
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z"
      />
    </svg>
  );
}

export function RegistrationProgressBar({
  currentStep = 1,
  totalSteps = 3,
  className = '',
}: RegistrationProgressBarProps) {
  const steps = Array.from({ length: totalSteps }, (_, index) => index + 1);

  return (
    <div
      className={`flex items-center justify-center gap-0 ${className}`}
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-valuenow={currentStep}
    >
      {steps.map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-300 ${
              currentStep >= step
                ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg'
                : 'border-gray-300 bg-white text-gray-400'
            }`}
          >
            {currentStep > step ? (
              <CheckIcon />
            ) : (
              <span className="text-base font-semibold">{step}</span>
            )}
          </div>

          {step < totalSteps && (
            <div
              className={`mx-2 h-1 w-12 rounded transition-colors duration-300 ${
                currentStep > step
                  ? 'bg-indigo-600'
                  : 'bg-gray-300 dark:bg-neutral-700'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
