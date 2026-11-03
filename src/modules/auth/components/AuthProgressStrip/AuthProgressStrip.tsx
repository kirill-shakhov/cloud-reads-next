import { Spinner } from '@heroui/react';

interface AuthProgressStripProps {
  isVisible: boolean;
  message: string;
}

export function AuthProgressStrip({
  isVisible,
  message,
}: AuthProgressStripProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="fixed inset-x-0 top-0 z-50 border-b border-sky-100 bg-sky-50/95 backdrop-blur dark:border-sky-900 dark:bg-sky-950/95"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3 text-sm">
        <Spinner size="sm" />
        <span className="font-medium text-sky-800 dark:text-sky-300">
          {message}
        </span>
      </div>
    </div>
  );
}
