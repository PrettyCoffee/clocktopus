import { Card } from "components/ui/card"
import { Input } from "components/ui/input"
import { Select } from "components/ui/select"
import { preferencesData } from "data/preferences"
import { useAtomValue } from "lib/yaasl"
import { cn } from "utils/cn"
import { vstack } from "utils/styles"

import { OrChain } from "./fragments/or-chain"

const locales = {
  "de-DE": "German",
  "en-GB": "English (GB)",
  "en-US": "English (US)",
  "fr-FR": "French",
}

const Locale = () => {
  const preferences = useAtomValue(preferencesData)
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
          value={preferences.locale}
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
            ["iso", ...Object.keys(locales)].includes(preferences.locale)
              ? ""
              : preferences.locale
          }
          onChange={locale => preferencesData.actions.setLocale(locale)}
          placeholder="Custom locale (e.g. ja-JP)"
        />
      </OrChain>
    </Card>
  )
}

export const SettingsGeneral = () => (
  <div className={cn(vstack({ gap: 2 }))}>
    <Locale />
  </div>
)
