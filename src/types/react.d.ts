// oxlint-disable-next-line import/no-unassigned-import -- needed to extend types
import "@types/react"

declare module "@types/react" {
  export interface KeyboardEvent {
    skipGridNavigation?: boolean
  }
}
