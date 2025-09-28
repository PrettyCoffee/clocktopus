import "react"

declare module "react" {
  export interface KeyboardEvent {
    skipGridNavigation?: boolean
  }
}
