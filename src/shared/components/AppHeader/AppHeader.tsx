'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bars3Icon,
  ChevronDownIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Dropdown } from '@heroui/react';

import { Logo } from '@/shared/components/Logo/Logo';
import { useTranslations } from '@/shared/hooks/useTranslations';

import { useAuth } from '@/modules/auth/hooks/useAuth';

import type { UserFullDTO } from '@/core/types/user';
import { APP_ROUTES } from '@/shared/constants/routes';

type AppHeaderUser = Pick<
  UserFullDTO,
  'firstName' | 'lastName' | 'email' | 'image'
>;

interface AppHeaderProps {
  user: AppHeaderUser | null;
}

export function AppHeader({ user }: AppHeaderProps) {
  const { t } = useTranslations('header');
  const router = useRouter();
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const openMobileMenu = (): void => {
    setIsMobileMenuOpen(true);
  };

  const closeMobileMenu = (): void => {
    setIsMobileMenuOpen(false);
  };

  const toggleProfileMenu = (): void => {
    setIsProfileMenuOpen((isOpen) => !isOpen);
  };

  const closeProfileMenu = (): void => {
    setIsProfileMenuOpen(false);
  };

  const handleLogout = async (): Promise<void> => {
    closeProfileMenu();
    await logout();
  };

  const userName = user ? `${user.firstName} ${user.lastName}`.trim() : '';
  const userInitials = user
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    : '';

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-gray-50 dark:border-neutral-800 dark:bg-neutral-950">
        <nav
          aria-label={t('ariaLabelGlobal')}
          className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8"
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-md p-2 text-gray-700 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:text-neutral-200 dark:hover:bg-neutral-800 lg:hidden"
              aria-label={t('openMainMenu')}
              aria-expanded={isMobileMenuOpen}
              onClick={openMobileMenu}
            >
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            <Link
              href={APP_ROUTES.HOME}
              className="hidden items-center lg:flex"
              aria-label={t('yourCompany')}
            >
              <Logo className="h-auto w-[60px]" />
            </Link>

            <Link
              href={APP_ROUTES.HOME}
              className="flex items-center lg:hidden"
              aria-label={t('yourCompany')}
              onClick={closeMobileMenu}
            >
              <Logo className="h-auto w-12" />
            </Link>
          </div>

          <div className="hidden items-center gap-x-12 lg:flex">
            <Link
              href={APP_ROUTES.HOME}
              className="text-sm font-semibold leading-6 text-gray-900 dark:text-white"
            >
              {t('main')}
            </Link>

            <Dropdown>
              <Dropdown.Trigger className="flex items-center gap-1 text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                {t('books')}

                <ChevronDownIcon
                  className="h-5 w-5 shrink-0 text-gray-400"
                  aria-hidden="true"
                />
              </Dropdown.Trigger>

              <Dropdown.Popover
                placement="bottom"
                className="min-w-64 rounded-2xl border border-gray-200 bg-white p-2 shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
              >
                <Dropdown.Menu aria-label={t('books')}>
                  <Dropdown.Item
                    id="library"
                    textValue={t('myBooks')}
                    className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    onAction={() => router.push(APP_ROUTES.BOOKS_LIBRARY)}
                  >
                    {t('myBooks')}
                  </Dropdown.Item>

                  <Dropdown.Item
                    id="upload"
                    textValue={t('upload')}
                    className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    onAction={() => router.push(APP_ROUTES.BOOK_UPLOAD)}
                  >
                    {t('upload')}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          </div>

          <div className="relative flex min-w-24 justify-end">
            {user ? (
              <>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-indigo-100 font-semibold text-indigo-700 ring-1 ring-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-950 dark:text-indigo-200 dark:ring-neutral-700"
                  aria-label={t('profileMenu')}
                  aria-expanded={isProfileMenuOpen}
                  onClick={toggleProfileMenu}
                >
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt=""
                      width={40}
                      height={40}
                      unoptimized
                      className="h-10 w-10 object-cover"
                    />
                  ) : (
                    userInitials
                  )}
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 top-full z-20 mt-3 w-64 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
                    <div className="border-b border-gray-100 px-4 py-3 dark:border-neutral-800">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {userName}
                      </p>

                      <p className="truncate text-sm text-gray-500 dark:text-neutral-400">
                        {user.email}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 dark:text-neutral-300 dark:hover:bg-neutral-800"
                      onClick={handleLogout}
                    >
                      {t('signOut')}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link
                href={APP_ROUTES.AUTH_LOGIN}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                onClick={closeProfileMenu}
              >
                {t('signIn')}
              </Link>
            )}
          </div>
        </nav>
      </header>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="presentation"
          onClick={closeMobileMenu}
        >
          <div className="absolute inset-0 bg-black/20" />

          <section
            aria-label={t('ariaLabelGlobal')}
            className="absolute inset-y-0 left-0 w-[88%] max-w-sm overflow-y-auto bg-white px-6 py-6 shadow-xl dark:bg-neutral-900"
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <Link
                href={APP_ROUTES.HOME}
                aria-label={t('yourCompany')}
                onClick={closeMobileMenu}
              >
                <Logo className="h-auto w-[60px]" />
              </Link>

              <button
                type="button"
                className="rounded-md p-2 text-gray-700 hover:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                aria-label={t('closeMenu')}
                onClick={closeMobileMenu}
              >
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-8 flex flex-col gap-1">
              <Link
                href={APP_ROUTES.HOME}
                className="rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-neutral-800"
                onClick={closeMobileMenu}
              >
                {t('main')}
              </Link>

              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-neutral-800">
                  {t('books')}

                  <ChevronDownIcon
                    className="h-5 w-5 shrink-0 text-gray-400 transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>

                <div className="ml-3 flex flex-col">
                  <Link
                    href={APP_ROUTES.BOOKS_LIBRARY}
                    className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    onClick={closeMobileMenu}
                  >
                    {t('myBooks')}
                  </Link>

                  <Link
                    href={APP_ROUTES.BOOK_UPLOAD}
                    className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    onClick={closeMobileMenu}
                  >
                    {t('upload')}
                  </Link>
                </div>
              </details>

              {user && (
                <>
                  <div className="my-3 border-t border-gray-200 dark:border-neutral-700" />

                  <p className="px-3 text-sm text-gray-500 dark:text-neutral-400">
                    {userName}
                  </p>

                  <button
                    type="button"
                    className="rounded-lg px-3 py-2 text-left text-base font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-neutral-800"
                    onClick={handleLogout}
                  >
                    {t('signOut')}
                  </button>
                </>
              )}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
