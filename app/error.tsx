"use client";

import { useEffect } from "react";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-[24px] font-extrabold">Something went wrong</h1>
      <p className="max-w-md text-[14px] text-text-mute">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <button type="button" className="btn btn-solid" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
