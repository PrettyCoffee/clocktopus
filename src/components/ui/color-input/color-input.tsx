import { Dispatch, useState } from "react"

import { Check } from "lucide-react"

import { Button } from "components/ui/button"
import { Icon } from "components/ui/icon"
import { Popover } from "components/ui/popover"
import { VisuallyHidden } from "components/utility/visually-hidden"
import { cn } from "utils/cn"
import { allColors, colored, hstack, ThemeColor } from "utils/styles"

interface ColorInputValueProps {
  value: ThemeColor
  onChange: Dispatch<ThemeColor>
}

const getColorName = (color: ThemeColor) => {
  const [first, ...rest] = color
  return first!.toUpperCase() + rest.join("")
}

interface ColorButtonProps extends ColorInputValueProps {
  isActive: boolean
}
const ColorButton = ({ value, onChange, isActive }: ColorButtonProps) => (
  <button
    onClick={() => onChange(value)}
    className={cn(
      hstack({ align: "center", justify: "center", inline: true }),
      colored({ type: "text", color: value }),
      "size-8 cursor-pointer rounded-md bgl-base-current hover:bgl-layer-b/20 active:bgl-layer-b/20"
    )}
  >
    <VisuallyHidden>{getColorName(value)}</VisuallyHidden>
    {isActive && <Icon icon={Check} color="invert" size="sm" />}
  </button>
)

const ColorList = ({ value, onChange }: ColorInputValueProps) => (
  <div className={hstack({ gap: 2, wrap: true })}>
    {allColors.map(color => (
      <ColorButton
        key={color}
        isActive={value === color}
        value={color}
        onChange={onChange}
      />
    ))}
  </div>
)

const ColorDropdown = ({ value, onChange }: ColorInputValueProps) => {
  const [open, setOpen] = useState(false)
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button className="justify-start gap-2 border border-stroke-gentle">
          <div
            className={cn(
              colored({ type: "bg", color: value }),
              "size-4 rounded-sm opacity-80 hover:opacity-100"
            )}
          />
          {getColorName(value)}
        </Button>
      </Popover.Trigger>

      <Popover.Content className="max-w-43">
        <ColorList
          value={value}
          onChange={value => {
            onChange(value)
            setOpen(false)
          }}
        />
      </Popover.Content>
    </Popover.Root>
  )
}

interface ColorInputProps extends ColorInputValueProps {
  mode: "dropdown" | "list"
}
export const ColorInput = ({ mode, value, onChange }: ColorInputProps) => {
  const Input = mode === "list" ? ColorList : ColorDropdown
  return <Input value={value} onChange={onChange} />
}
