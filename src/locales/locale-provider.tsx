import { PropsWithChildren, useEffect, useState } from "react"

// eslint-disable-next-line no-restricted-imports -- i18n may only be used here
import { i18n, Messages } from "@lingui/core"
import { I18nProvider, useLingui } from "@lingui/react"

import { preferencesData } from "data/preferences"
import { useSelector } from "lib/yaasl"

const availableLocales = new Set(["en", "de"])

const getMessages = (locale: string) =>
  import(`./${locale}/messages.po`) as Promise<{ messages: Messages }>

const activate = async (localeArg: string) => {
  const locale = availableLocales.has(localeArg) ? localeArg : "en"
  const { messages } = await getMessages(locale)
  i18n.load(locale, messages)
  i18n.activate(locale)
  return locale
}

export const LocaleProvider = ({ children }: PropsWithChildren) => {
  const locale = useSelector(preferencesData, data => data.language)
  const [activeLocale, setActiveLocale] = useState<string>()

  useEffect(() => {
    void activate(locale).then(setActiveLocale)
  }, [locale])

  if (!activeLocale) return null
  return <I18nProvider i18n={i18n}>{children}</I18nProvider>
}

export const useTrans = () => useLingui()._
