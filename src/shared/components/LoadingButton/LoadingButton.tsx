'use client';

import type { ReactNode } from 'react';
import { Button, type ButtonProps, Spinner } from '@heroui/react';

interface LoadingButtonProps extends Omit<ButtonProps, 'children'> {
  children: ReactNode;
}

export function LoadingButton({ children, ...props }: LoadingButtonProps) {
  return (
    <Button {...props}>
      {({ isPending }) => (
        <>
          {isPending && <Spinner color="current" size="sm" />}
          {children}
        </>
      )}
    </Button>
  );
}
