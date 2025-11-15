import { PropsWithChildren } from "react"

import { Text } from "./fragments/text"

export const Caption = ({
  offset,
  children,
}: PropsWithChildren<{ offset?: { x?: number; y?: number } }>) => (
  <Text x={offset?.x ?? 0} y={16 + (offset?.y ?? 0)} anchor="start">
    {children}
  </Text>
)
