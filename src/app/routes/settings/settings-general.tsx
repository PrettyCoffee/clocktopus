import { Fragment, useState } from "react"

import { t } from "@lingui/core/macro"
import { Trans } from "@lingui/react/macro"
import {
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyStart,
  LayoutGrid,
  TableProperties,
} from "lucide-react"

import { routes } from "app/layout"
import { Card } from "components/ui/card"
import { Input } from "components/ui/input"
import { Select } from "components/ui/select"
import { preferencesData } from "data/preferences"
import { useAtom } from "lib/yaasl"
import { useTrans } from "locales/locale-provider"
import { cn } from "utils/cn"
import { vstack } from "utils/styles"

import { CheckOption, checkOptionFocusManager } from "./fragments/check-option"
import { OrChain } from "./fragments/or-chain"
import { RadioOption, radioOptionFocusManager } from "./fragments/radio-option"

const languages = {
  de: "Deutsch",
  en: "English",
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

const isValidLocale = (locale: string) => {
  try {
    return (
      Intl.DateTimeFormat.supportedLocalesOf(Intl.getCanonicalLocales(locale))
        .length > 0
    )
  } catch {
    return false
  }
}

const locales = [
  { value: "iso", label: "ISO Standard" },
  { value: "de-DE", label: "Deutsch" },
  { value: "en-GB", label: "English (GB)" },
  { value: "en-US", label: "English (US)" },
]
const availableLocales = new Set(locales.map(({ value }) => value))

const Locale = () => {
  const { locale } = useAtom(preferencesData)
  const [custom, setCustom] = useState(
    availableLocales.has(locale) ? "" : locale
  )

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
          value={availableLocales.has(locale) ? locale : undefined}
          onChange={locale => preferencesData.actions.setLocale(locale)}
          placeholder={custom ? t`Custom locale` : t`Locale`}
        >
          {locales.map(({ value, label }) => (
            <Fragment key={value}>
              <Select.Option value={value} label={label} />
              {value === "iso" && <Select.Separator />}
            </Fragment>
          ))}
        </Select.Root>

        <Input
          type="text"
          value={custom}
          alert={!custom || isValidLocale(custom) ? undefined : "error"}
          onChange={locale => {
            setCustom(locale)
            if (!isValidLocale(locale)) return
            preferencesData.actions.setLocale(locale)
          }}
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
      <OrChain role="radiogroup" onKeyDown={radioOptionFocusManager}>
        <RadioOption
          active={summaryStyle === "table"}
          icon={TableProperties}
          label={t`Table`}
          onClick={() => preferencesData.actions.setSummaryStye("table")}
        />
        <RadioOption
          active={summaryStyle === "grid"}
          icon={LayoutGrid}
          label={t`Grid`}
          onClick={() => preferencesData.actions.setSummaryStye("grid")}
        />
      </OrChain>
    </Card>
  )
}

const SelectStyle = () => {
  const { selectMenuAlignment } = useAtom(preferencesData)
  return (
    <Card
      title={t`Selection menu alignment`}
      description={t`Change how selection menus are aligned to the opening button. Either align the currently selected item with the button or move the menu underneath the button.`}
    >
      <OrChain role="radiogroup" onKeyDown={radioOptionFocusManager}>
        <RadioOption
          active={selectMenuAlignment === "item-aligned"}
          icon={AlignVerticalJustifyCenter}
          label={t`Item aligned`}
          onClick={() =>
            preferencesData.actions.setSelectMenuAlignment("item-aligned")
          }
        />
        <RadioOption
          active={selectMenuAlignment === "popper"}
          icon={AlignVerticalJustifyStart}
          label={t`Bottom aligned`}
          onClick={() =>
            preferencesData.actions.setSelectMenuAlignment("popper")
          }
        />
      </OrChain>
    </Card>
  )
}

const HiddenRoutes = () => {
  const trans = useTrans()
  const { hiddenRoutes = [] } = useAtom(preferencesData)
  const hidableRoutes = routes.filter(({ to, href }) =>
    /search|stats|calendar|github/i.test(to ?? href)
  )
  return (
    <Card
      title={t`Hidden pages`}
      description={t`Hide optional pages from the navigation of the side-menu, if you don't use them.`}
    >
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className="flex flex-row flex-wrap gap-2"
        onKeyDown={checkOptionFocusManager}
      >
        {hidableRoutes.map(({ title, icon, href, to }) => {
          const active = !hiddenRoutes.includes(href ?? to)
          return (
            <CheckOption
              key={href ?? to}
              icon={icon}
              label={trans(title)}
              active={active}
              onClick={() =>
                preferencesData.actions.toggleHiddenRoute(href ?? to, active)
              }
            />
          )
        })}
      </div>
    </Card>
  )
}

export const SettingsGeneral = () => (
  <div className={cn(vstack({ gap: 2 }))}>
    <Language />
    <Locale />
    <HiddenRoutes />
    <SummaryStyle />
    <SelectStyle />
  </div>
)
