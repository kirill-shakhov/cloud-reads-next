import Image from 'next/image';

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/cloudreads-logo.svg"
      alt="CloudReads"
      width={70}
      height={54}
      className={className}
      priority
    />
  );
}
