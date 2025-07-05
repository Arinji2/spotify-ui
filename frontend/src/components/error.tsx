import { cn } from '@/lib/utils'
import type { ClassValue } from 'clsx'
import { useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Button } from './ui/button'
import { Link } from '@tanstack/react-router'

export function ErrorWrapper({
  children,
  small = false,
  className,
}: {
  children: React.ReactNode
  small?: boolean
  className?: ClassValue
}) {
  const [errorKey, setErrorKey] = useState(0) // Track key to force remount on error

  return (
    <ErrorBoundary
      onReset={() => setErrorKey((prev) => prev + 1)}
      fallbackRender={({ error, resetErrorBoundary }) => (
        <div
          className={cn(
            'flex h-full w-full flex-col items-center justify-center gap-4 rounded-xl bg-red-800 p-4 text-center',
            className,
          )}
        >
          {!small && (
            <h2 className="tracking-small text-brand-text text-2xl font-semibold">
              Something went wrong!
            </h2>
          )}
          <p
            className={cn('text-lg font-medium text-white', {
              'text-base': small,
            })}
          >
            {error?.message}
          </p>
          {!small && (
            <Button
              variant="secondary"
              data-active={true}
              onClick={resetErrorBoundary}
            >
              Try Again
            </Button>
          )}
        </div>
      )}
    >
      <div key={errorKey} className={cn('h-full w-full', className)}>
        {children}
      </div>
    </ErrorBoundary>
  )
}

export function RouteError() {
  return (
    <div className="bg-brand-destructive-dark text-brand-text flex min-h-screen w-full flex-col items-center justify-center gap-6 px-4">
      <h1 className="tracking-large text-3xl font-bold">
        Oops! Something went wrong.
      </h1>
      <p className="text-brand-text/80 max-w-md text-center text-lg">
        The page failed to load properly or some required data was missing.
      </p>
      <Link
        to="/"
        className="bg-brand-primary hover:bg-brand-primary-dark rounded-xl px-6 py-3 text-lg font-medium text-black transition"
      >
        Go back home
      </Link>
    </div>
  )
}
