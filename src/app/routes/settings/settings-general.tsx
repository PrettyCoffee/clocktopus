import { t } from "@lingui/core/macro"
import { Trans } from "@lingui/react/macro"
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

const languages = {
  de: "🇩🇪 Deutsch",
  en: "🇬🇧 English",
}

const Language = () => {
  const { language } = useAtom(preferencesData)
  return (
    <Card
      title={t`Language`}
      description={
        <Trans>Choose the language used for texts in Clocktopus.</Trans>
      }
    >
      <Select.Root
        value={language}
        onChange={language => preferencesData.actions.setLanguage(language)}
        placeholder={t`Language`}
      >
        {Object.entries(languages)
          .sort(([, a], [, b]) => a.localeCompare(b))
          .map(([value, label]) => (
            <Select.Option key={value} value={value} label={label} />
          ))}
      </Select.Root>
    </Card>
  )
}

const locales = {
  "de-DE": "Deutsch",
  "en-GB": "English (GB)",
  "en-US": "English (US)",
}

const Locale = () => {
  const { locale } = useAtom(preferencesData)
  return (
    <Card
      title={t`Locale`}
      description={
        <Trans>
          Adjust the locale to influcene how dates are displayed. You can either
          select one in the dropdown or provide your own by using the text
          field.
        </Trans>
      }
    >
      <OrChain>
        <Select.Root
          value={locale}
          onChange={locale => preferencesData.actions.setLocale(locale)}
          placeholder={t`Locale`}
        >
          <Select.Option value="iso">
            <Trans>ISO Standard</Trans>
          </Select.Option>
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
          placeholder={t`Custom locale (e.g. ja-JP)`}
        />
      </OrChain>
    </Card>
  )
}

const SummaryStyle = () => {
  const { summaryStyle } = useAtom(preferencesData)
  return (
    <Card
      title={t`Summary style`}
      description={t`Decide how the time summary of past dates is displayed — as table rows or in grid items?`}
    >
      <OrChain role="radiogroup" onKeyDown={styleRadioButtonFocusManager}>
        <StyleRadioButton
          active={summaryStyle === "table"}
          icon={TableProperties}
          label={t`Table`}
          onClick={() => preferencesData.actions.setSummaryStye("table")}
        />
        <StyleRadioButton
          active={summaryStyle === "grid"}
          icon={LayoutGrid}
          label={t`Grid`}
          onClick={() => preferencesData.actions.setSummaryStye("grid")}
        />
      </OrChain>
    </Card>
  )
}

export const SettingsGeneral = () => (
  <div className={cn(vstack({ gap: 2 }))}>
    <Language />
    <Locale />
    <SummaryStyle />
  </div>
)
