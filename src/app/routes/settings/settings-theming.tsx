import { css } from "goober"

import { Card } from "components/ui/card"
import { ColorInput } from "components/ui/color-input"
import { Toggle } from "components/ui/toggle"
import { themeData } from "data/theme"
import { useAtomValue } from "lib/yaasl"
import { cn } from "utils/cn"
import { hstack, vstack } from "utils/styles"

import { theme } from "../../../../tailwind/theme"

const trackStyles = `
  background: ${theme.read("color.stroke.default")};
  height: var(--track-width);
  border-radius: 50vh;
`

const thumbStyles = `
  appearance: none;
  height: var(--slider-size);
  width: var(--slider-size);
  background: ${theme.read("color.background.default")};
  outline: var(--track-width) solid ${theme.read("color.stroke.button")};
  margin-top: -0.4rem;
  border-radius: 50%;
  border: none;
`

const slider = css`
  --track-width: 0.125rem;
  --slider-size: 1rem;

  appearance: none;
  display: inline-block;
  background: transparent;
  cursor: pointer;
  height: 2rem;
  border-radius: 0.25rem;

  &::-moz-range-track {
    ${trackStyles}
  }
  &::-moz-range-thumb {
    ${thumbStyles}
  }

  input[type="range"]& {
    &::-webkit-slider-runnable-track {
      ${trackStyles}
    }
    &::-webkit-slider-thumb {
      ${thumbStyles}
    }
  }
`

const BaseColors = () => {
  const mode = useAtomValue(themeData.selectors.getMode)
  const colored = useAtomValue(themeData.selectors.getColored)
  return (
    <Card
      title="Base Colors"
      description="Choose between dark and light mode, and decide if neutral colors should have a hue."
    >
      <div className={hstack({ justify: "evenly", gap: 4, wrap: true })}>
        <Toggle
          label="Dark base colors"
          checked={mode === "dark"}
          onChange={() =>
            themeData.actions.setMode(mode === "dark" ? "light" : "dark")
          }
        />
        <Toggle
          label="Colored base colors"
          checked={colored}
          onChange={() => themeData.actions.toggleColored()}
        />
      </div>
    </Card>
  )
}

const BorderRadiusSlider = () => {
  const radius = useAtomValue(themeData.selectors.getRadius)
  return (
    <Card
      title="Border Radius"
      description="Adjust the border radius size of all elements."
    >
      <div className={vstack({})}>
        <input
          className={cn(slider, "text-text-priority")}
          type="range"
          value={radius}
          min={0}
          max={24}
          onChange={({ currentTarget }) =>
            themeData.actions.setRadius(Number(currentTarget.value))
          }
        />
        {radius}
      </div>
    </Card>
  )
}

const AccentColor = () => {
  const accent = useAtomValue(themeData.selectors.getAccent)
  return (
    <Card
      title="Accent color"
      description="Change the accent color which highlights focused and active elements."
    >
      <div className="mx-auto max-w-80">
        <ColorInput
          mode="list"
          value={accent}
          onChange={themeData.actions.setAccent}
        />
      </div>
    </Card>
  )
}

export const SettingsTheming = () => (
  <div className={cn(vstack({ gap: 2 }))}>
    <BaseColors />
    <AccentColor />
    <BorderRadiusSlider />
  </div>
)
