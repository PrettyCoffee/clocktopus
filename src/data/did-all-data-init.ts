import { categoryGroupsData, categoriesData } from "./categories"
import { preferencesData } from "./preferences"
import { themeData } from "./theme"
import { timeEntriesData } from "./time-entries"

export const didAllDataInit = async () => {
  await timeEntriesData.didInit
  await preferencesData.didInit
  await categoriesData.didInit
  await categoryGroupsData.didInit
  await themeData.didInit
}
