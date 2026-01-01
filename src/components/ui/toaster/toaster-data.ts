import { ReactNode } from "react"

import { MessageDescriptor } from "@lingui/core"

import { createSlice } from "lib/yaasl"
import { AlertKind } from "types/base-props"
import { createId } from "utils/create-id"

import { ButtonProps } from "../button"

const defaultDurations: Record<AlertKind, number> = {
  info: 5000,
  success: 5000,
  warn: 0,
  error: 0,
}

export interface ToastAction extends Pick<
  ButtonProps,
  "look" | "onClick" | "icon" | "to"
> {
  label: MessageDescriptor | string
}

export interface ToastProps {
  id: string
  kind: AlertKind
  title: MessageDescriptor | string
  message?: ReactNode
  duration?: number
  actions?: ToastAction[]
}

type ToastPatch = Partial<Omit<ToastProps, "id">>

export const toastList = createSlice({
  name: "toast-list",
  defaultValue: [] as ToastProps[],
  reducers: {
    add: (state, toast: ToastProps) => [toast, ...state],
    edit: (state, id: string, data: ToastPatch) =>
      state.map(toast => (toast.id !== id ? toast : { ...toast, ...data, id })),
    close: (state, id: string) => state.filter(toast => toast.id !== id),
    clear: () => [],
  },
})

export const showToast = ({
  kind,
  duration = defaultDurations[kind],
  ...props
}: Omit<ToastProps, "id">) => {
  const id = createId("uuid")
  toastList.actions.add({ ...props, id, kind, duration })

  return {
    close: () => toastList.actions.close(id),
    edit: (data: ToastPatch) => toastList.actions.edit(id, data),
  }
}
