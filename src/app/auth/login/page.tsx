import Image from "next/image";
import { Button } from "@heroui/react";

export default function LoginPage() {
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
          Login
        </h1>
      </section>

      <section className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium leading-6 text-gray-900 dark:text-neutral-100"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              className="mt-2 block w-full rounded-md border-0 bg-white px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-neutral-800 dark:text-neutral-100 dark:ring-neutral-600 dark:placeholder:text-neutral-500 dark:focus:ring-indigo-500 sm:text-sm sm:leading-6"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-gray-900 dark:text-neutral-100"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              className="mt-2 block w-full rounded-md border-0 bg-white px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-neutral-800 dark:text-neutral-100 dark:ring-neutral-600 dark:placeholder:text-neutral-500 dark:focus:ring-indigo-500 sm:text-sm sm:leading-6"
            />
          </div>

          <div>
            <Button type="button" className="w-full">
              Login
            </Button>

            <Button
              type="button"
              variant="tertiary"
              className="mt-4 w-full"
            >
              Continue with Google
            </Button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500 dark:text-neutral-400">
          Don&apos;t have an account?{" "}
          <a
            href="/auth/registration.tsx"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Sign up!
          </a>
        </p>
      </section>
    </main>
  );
}
