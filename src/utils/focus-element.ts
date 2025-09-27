const isFocusable = (element: Element | null): element is HTMLElement =>
  !!element && "focus" in element

const isSelectable = (
  element: Element | null
): element is HTMLInputElement | HTMLTextAreaElement =>
  !!element && "select" in element

export const focusElement = (element: Element | null) => {
  if (isFocusable(element)) element.focus()
  if (isSelectable(element)) element.select()
}
