import React from 'react'
import { cn } from '@/utils/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="form-field">
        {label && (
          <label className="form-label">
            {icon && <span className="inline-flex items-center mr-1">{icon}</span>}
            {label}
          </label>
        )}
        <input
          className={cn(
            'form-input',
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          ref={ref}
          suppressHydrationWarning
          {...props}
        />
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
