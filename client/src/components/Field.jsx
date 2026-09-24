import { AlertCircle } from 'lucide-react'

export default function Field({ id, label, labelRight, right, icon: Icon, error, ...inputProps }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <label htmlFor={id} className="font-mono text-[11px] uppercase tracking-[0.16em] text-mist">
          {label}
        </label>
        {labelRight}
      </div>

      <div
        className={`group flex items-center gap-3 border-b transition-colors duration-200 ${
          error ? 'border-error' : 'border-line focus-within:border-ink'
        }`}
      >
        {Icon && (
          <Icon
            className="h-4 w-4 shrink-0 text-mist transition-colors group-focus-within:text-ink"
            strokeWidth={1.5}
          />
        )}
        <input
          id={id}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="w-full bg-transparent py-3 text-[15px] text-ink placeholder:text-mist/60 focus:outline-none"
          {...inputProps}
        />
        {right}
      </div>

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-2 flex items-center gap-1.5 font-mono text-[11px] text-error"
        >
          <AlertCircle className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
          {error}
        </p>
      )}
    </div>
  )
}