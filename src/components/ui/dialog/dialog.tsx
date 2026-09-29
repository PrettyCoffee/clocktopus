import { PropsWithChildren, ReactNode, useState } from "react"

import { t } from "@lingui/core/macro"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { ClassNameProp } from "types/base-props"
import { cn } from "utils/cn"
import { hstack, vstack } from "utils/styles"
import { zIndex } from "utils/z-index"

import { Button, ButtonProps } from "../button"
import { IconButton } from "../icon-button"

const transitionStyles = {
  show: {
    overlayClassName:
      "duration-200 transition-all bg-background-page/50 backdrop-blur-sm",
    contentClassName: "duration-200 transition-all scale-100 opacity-100",
    duration: 200,
  },
  hide: {
    overlayClassName:
      "duration-100 transition-all bg-transparent backdrop-blur-0",
    contentClassName: "duration-100 transition-all scale-50 opacity-0",
    duration: 100,
  },
}

interface DialogAction {
  look?: ButtonProps["look"]
  caption?: string
  onClick?: () => void
  disabled?: boolean
}

export interface DialogProps extends ClassNameProp {
  title: string
  description?: ReactNode
  onClose?: () => void
  confirm?: DialogAction
  cancel?: DialogAction
}

const DialogActions = ({
  confirm,
  cancel,
  onClose,
}: Pick<DialogProps, "confirm" | "cancel" | "onClose">) => {
  if (!confirm && !cancel) return null

  return (
    <div className={cn(hstack({ gap: 2, wrap: true }), "px-4 pb-4")}>
      {confirm && (
        <Button
          look={confirm.look ?? "key"}
          disabled={confirm.disabled}
          onClick={() => {
            onClose?.()
            confirm.onClick?.()
          }}
        >
          {confirm.caption ?? t`Confirm`}
        </Button>
      )}
      {cancel && (
        <Button
          look={cancel.look ?? "flat"}
          disabled={cancel.disabled}
          onClick={() => {
            onClose?.()
            cancel.onClick?.()
          }}
        >
          {cancel.caption ?? t`Cancel`}
        </Button>
      )}
    </div>
  )
}

export const Dialog = ({
  title,
  description,
  onClose,
  children,
  confirm,
  cancel,
  className,
}: PropsWithChildren<DialogProps>) => {
  const [status, setStatus] = useState<"init" | "show" | "closing">("init")

  const transition = transitionStyles[status === "show" ? "show" : "hide"]

  if (status === "init") {
    setTimeout(() => setStatus("show"), 0)
  } else if (status === "closing") {
    setTimeout(() => onClose?.(), transition.duration)
  }

  const close = () => setStatus("closing")

  return (
    <DialogPrimitive.Root open onOpenChange={open => !open && close()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "bg-background-page/50 fixed inset-0 size-full",
            zIndex.dialog,
            transition.overlayClassName,
          )}
        />

        <DialogPrimitive.Content
          className={cn(
            vstack({}),
            "border-stroke-gentle bg-background-page fixed inset-1/2 h-max w-96 -translate-1/2 rounded-lg border",
            zIndex.dialog,
            transition.contentClassName,
            className,
          )}
        >
          <DialogPrimitive.Title
            className={cn(
              hstack({ align: "center" }),
              "text-text-priority h-12 truncate pr-12 pl-4 text-xl",
            )}
          >
            <span className="truncate">{title}</span>
          </DialogPrimitive.Title>

          {description && (
            <DialogPrimitive.Description className="text-text-gentle px-4 pb-4 text-sm">
              {description}
            </DialogPrimitive.Description>
          )}

          {children && (
            <div className="flex-1 overflow-auto px-4 pb-4">{children}</div>
          )}

          <DialogActions confirm={confirm} cancel={cancel} onClose={close} />

          <DialogPrimitive.Close asChild className="absolute top-1 right-1">
            <IconButton
              title={t`Close`}
              hideTitle
              icon={X}
              onClick={() => {
                close()
                cancel?.onClick?.()
              }}
            />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
