"use client";

import * as Dialog from "@radix-ui/react-dialog";
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

type ConfirmOptions = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
};

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback<ConfirmFn>((opts) => {
    setOptions(opts);
    setOpen(true);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  const settle = useCallback((result: boolean) => {
    resolver.current?.(result);
    resolver.current = null;
    setOpen(false);
  }, []);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Dialog.Root
        open={open}
        onOpenChange={(next) => {
          if (!next) settle(false);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fh-modal-overlay fixed inset-0 z-[60] bg-black/40" />
          <Dialog.Content
            className="fh-modal fixed left-1/2 top-1/2 z-[61] w-[min(400px,92vw)] rounded-[10px] border border-[var(--fh-border)] bg-[var(--fh-panel)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.25)]"
            aria-describedby={undefined}
          >
            <Dialog.Title className="text-[16px] font-extrabold text-[var(--fh-text)]">
              {options?.title}
            </Dialog.Title>
            {options?.description && (
              <p className="mt-2 text-[13px] text-[var(--fh-mute)]">
                {options.description}
              </p>
            )}
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                className="fh-btn"
                onClick={() => settle(false)}
              >
                {options?.cancelLabel ?? "Cancel"}
              </button>
              <button
                type="button"
                className={`fh-btn ${options?.danger ? "fh-btn-danger" : "fh-btn-primary"}`}
                onClick={() => settle(true)}
              >
                {options?.confirmLabel ?? "Confirm"}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used within <ConfirmProvider>");
  return ctx;
}
