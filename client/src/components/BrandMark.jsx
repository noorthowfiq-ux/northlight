export default function BrandMark({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none">
      <circle cx="12" cy="12" r="10.75" stroke="currentColor" strokeWidth="1" opacity="0.45" />
      <path
        d="M12 2.4l1.85 7.75L21.6 12l-7.75 1.85L12 21.6l-1.85-7.75L2.4 12l7.75-1.85L12 2.4z"
        fill="currentColor"
      />
    </svg>
  )
}