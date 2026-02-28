import { preferencesData } from "data/preferences"

export const getLocale = () => preferencesData.get().locale
export const getLanguage = () => preferencesData.get().language
