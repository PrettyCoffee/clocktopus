import { LayoutGrid, TableProperties } from "lucide-react"

import { Card } from "components/ui/card"
import { Input } from "components/ui/input"
import { Select } from "components/ui/select"
import { preferencesData } from "data/preferences"
import { useAtom } from "lib/yaasl"
import { cn } from "utils/cn"
import { vstack } from "utils/styles"

import { OrChain } from "./fragments/or-chain"
import {
  StyleRadioButton,
  styleRadioButtonFocusManager,
} from "./fragments/style-radio-button"

const locales = {
  "de-DE": "German",
  "en-GB": "English (GB)",
  "en-US": "English (US)",
  "fr-FR": "French",
}

const Locale = () => {
  const { locale } = useAtom(preferencesData)
  return (
    <Card
      title="Locale"
      description={
        "Adjust the locale to influcene how dates are displayed. " +
        "You can either select one in the dropdown or provide your own by using the text field."
      }
    >
      <OrChain>
        <Select.Root
          value={locale}
          onChange={locale => preferencesData.actions.setLocale(locale)}
          placeholder="Locale"
        >
          <Select.Option value="iso">ISO Standard</Select.Option>
          <Select.Separator />
          {Object.entries(locales)
            .sort(([, a], [, b]) => a.localeCompare(b))
            .map(([value, label]) => (
              <Select.Option key={value} value={value} label={label} />
            ))}
        </Select.Root>

        <Input
          type="text"
          value={
            ["iso", ...Object.keys(locales)].includes(locale) ? "" : locale
          }
          onChange={locale => preferencesData.actions.setLocale(locale)}
          placeholder="Custom locale (e.g. ja-JP)"
        />
      </OrChain>
    </Card>
  )
}

const SummaryStyle = () => {
  const { summaryStyle } = useAtom(preferencesData)
  return (
    <Card
      title="Summary style"
      description="Decide how the time summary of past dates is displayed — as table rows or in grid items?"
    >
      <OrChain role="radiogroup" onKeyDown={styleRadioButtonFocusManager}>
        <StyleRadioButton
          active={summaryStyle === "table"}
          icon={TableProperties}
          label="Table"
          onClick={() => preferencesData.actions.setSummaryStye("table")}
        />
        <StyleRadioButton
          active={summaryStyle === "grid"}
          icon={LayoutGrid}
          label="Grid"
          onClick={() => preferencesData.actions.setSummaryStye("grid")}
        />
      </OrChain>
    </Card>
  )
}

export const SettingsGeneral = () => (
  <div className={cn(vstack({ gap: 2 }))}>
    <Locale />
    <SummaryStyle />
  </div>
)
