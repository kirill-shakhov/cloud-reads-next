import Image from "next/image";
import { Link } from "@heroui/react";

export default function EmailConfirmationPage() {
  return (
    <main className="flex min-h-full flex-1 flex-col px-6 py-12 lg:px-8">
      <section className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Image
          src="/cloudreads-logo.svg"
          alt="CloudReads"
          width={70}
          height={54}
          className="mx-auto"
          priority
        />

        <h1 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-neutral-100">
          Confirm your email
        </h1>
      </section>

      <section className="mt-10 space-y-6 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
          <p className="text-center text-sm font-medium text-green-800 dark:text-green-300">
            Email confirmed successfully!
          </p>
        </div>

        <p className="text-center text-sm text-gray-600 dark:text-neutral-400">
          Your account has been activated. You can now log in.
        </p>

        <Link
          href="/"
          className="inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Go to Dashboard
        </Link>
      </section>
    </main>
  );
}
