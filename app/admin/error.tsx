"use client";

import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin route error:", error);
  }, [error]);

  return (
    <div className="fh-panel p-6">
      <h2 className="text-[18px]">Something went wrong in the admin</h2>
      <p className="fh-note mt-2 break-words">
        {error.message || "An unexpected error occurred."}
        {error.digest ? ` (ref: ${error.digest})` : ""}
      </p>
      <button
        type="button"
        className="fh-btn fh-btn-primary mt-4"
        onClick={reset}
      >
        Try again
      </button>
    </div>
  );
}
