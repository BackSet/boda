import {
  useEffect,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react'

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

export function UiButton({
  variant = 'secondary',
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  const variantClass =
    variant === 'primary'
      ? 'border-rose-700/80 bg-gradient-to-r from-rose-700 to-rose-600 text-white shadow-[0_10px_24px_-14px_rgba(168,61,104,0.9)] hover:from-rose-700 hover:to-rose-700'
      : variant === 'danger'
        ? 'border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-950/70'
        : variant === 'ghost'
          ? 'border-transparent bg-transparent text-zinc-700 hover:bg-rose-50 dark:text-zinc-200 dark:hover:bg-zinc-800'
          : 'border-amber-200/70 bg-white/80 text-zinc-700 hover:bg-amber-50/70 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800'

  return (
    <button
      className={cx(
        'inline-flex items-center justify-center rounded-full border px-3.5 py-2 text-sm font-medium transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-rose-700 dark:focus-visible:ring-offset-zinc-950',
        variantClass,
        className,
      )}
      {...props}
    />
  )
}

export function UiInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cx(
        'w-full rounded-xl border border-amber-200/70 bg-white/85 px-3 py-2 text-sm outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-rose-500 dark:focus:ring-rose-900/60',
        className,
      )}
      {...props}
    />
  )
}

export function UiSelect({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cx(
        'w-full rounded-xl border border-amber-200/70 bg-white/85 px-3 py-2 text-sm outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-rose-500 dark:focus:ring-rose-900/60',
        className,
      )}
      {...props}
    />
  )
}

export function UiTextarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cx(
        'w-full rounded-xl border border-amber-200/70 bg-white/85 px-3 py-2 text-sm outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-rose-500 dark:focus:ring-rose-900/60',
        className,
      )}
      {...props}
    />
  )
}

export function UiCard({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLElement> & {
  children: ReactNode
}) {
  return (
    <section
      className={cx(
        'fairy-surface section-glow rounded-3xl border border-rose-100/70 bg-white/85 p-5 shadow-[0_24px_56px_-36px_rgba(84,54,66,0.55)] backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900',
        className,
      )}
      {...props}
    >
      {children}
    </section>
  )
}

export function UiBadge({
  children,
  tone = 'default',
}: {
  children: ReactNode
  tone?: 'default' | 'rose'
}) {
  return (
    <span
      className={
        tone === 'rose'
          ? 'rounded-full border border-rose-300/90 bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
          : 'rounded-full border border-amber-200/70 bg-amber-50/70 px-2.5 py-0.5 text-xs font-semibold text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200'
      }
    >
      {children}
    </span>
  )
}

export function UiModal({
  open,
  title,
  onClose,
  children,
  footer,
}: {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
}) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[3px]"
        aria-label="Cerrar modal"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-2xl rounded-3xl border border-rose-100/80 bg-white/95 shadow-[0_30px_90px_-40px_rgba(66,40,54,0.8)] dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-amber-100/80 px-5 py-3 dark:border-zinc-700">
          <h3 className="text-2xl">{title}</h3>
          <UiButton variant="ghost" onClick={onClose}>
            Cerrar
          </UiButton>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-5">{children}</div>
        {footer && (
          <div className="flex flex-wrap justify-end gap-2 border-t border-zinc-200 px-5 py-3 dark:border-zinc-700">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export function UiConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onClose,
  loading = false,
}: {
  open: boolean
  title: string
  message: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onClose: () => void
  loading?: boolean
}) {
  return (
    <UiModal
      open={open}
      title={title}
      onClose={onClose}
      footer={
        <>
          <UiButton type="button" onClick={onClose}>
            {cancelLabel}
          </UiButton>
          <UiButton
            type="button"
            variant="danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Procesando...' : confirmLabel}
          </UiButton>
        </>
      }
    >
      <p className="text-sm text-zinc-600 dark:text-zinc-300">{message}</p>
    </UiModal>
  )
}
