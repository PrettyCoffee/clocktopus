import { PropsWithChildren } from "react"

import { Text } from "./fragments/text"

export const Caption = ({ children }: PropsWithChildren) => (
  <Text x={0} y={16} anchor="start">
    {children}
  </Text>
)
