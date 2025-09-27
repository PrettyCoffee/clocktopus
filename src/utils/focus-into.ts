import { focusElement } from "./focus-element"

const focusableSelector = [
  "[contentEditable=true]",
  "[tabindex]",
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "iframe",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
].join(",")

const isRadioButtonWithGroup = (
  element: Element | null
): element is HTMLInputElement =>
  element instanceof HTMLInputElement &&
  element.type === "radio" &&
  Boolean(element.name)

const getPreferredRadioButton = (
  currentRadio: HTMLInputElement,
  elements: Element[]
) => {
  if (currentRadio.checked) return currentRadio

  const checkedRadio = elements.find(
    element =>
      isRadioButtonWithGroup(element) &&
      element.name === currentRadio.name &&
      element.checked
  )

  return checkedRadio ?? currentRadio
}

export const getFocusableElements = (container: Element | null) => {
  if (container === null) return []
  return [...container.querySelectorAll(focusableSelector)]
}

const tabIndex = (element: Element) =>
  Number(element.getAttribute("tabIndex") ?? 0)

const splitNegativeTabIndex = (elements: Element[]) =>
  [
    elements.filter(element => tabIndex(element) >= 0),
    elements.filter(element => tabIndex(element) < 0),
  ] as const

const getPreferredElements = (container: Element | null) => {
  const elements = getFocusableElements(container)

  /** Elements with tabIndex={-1} are usually not accessible via the tab key.
   *  Therefore, we prefer to focus elements that are actually accessible via tab.
   **/
  const [tabbable, nonTabbable] = splitNegativeTabIndex(elements)

  return tabbable.length > 0 ? tabbable : nonTabbable
}

export const hasFocusableChild = (element: Element | null) =>
  !element ? false : getPreferredElements(element).length > 0

export const focusInto = (
  container: Element | null,
  entry: "start" | "end" = "start"
) => {
  if (!container) return

  const elements = getPreferredElements(container)
  if (elements.length === 0) {
    focusElement(container)
    return
  }

  const focusIndex = entry === "start" ? 0 : elements.length - 1
  const element = elements[focusIndex]!

  if (isRadioButtonWithGroup(element)) {
    focusElement(getPreferredRadioButton(element, elements))
  } else {
    focusElement(element)
  }
}
