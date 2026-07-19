export function Logo({ wordmark = true }: { wordmark?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        aria-hidden
        className="h-[34px] w-[34px] shrink-0 rounded-full"
        style={{
          background:
            "conic-gradient(from -40deg, var(--color-gold), var(--color-orange) 45%, var(--color-gold) 100%)",
        }}
      />
      {wordmark && (
        <span className="font-display text-[22px] leading-none tracking-[0.04em]">
          FRESHHUB
        </span>
      )}
    </div>
  );
}
