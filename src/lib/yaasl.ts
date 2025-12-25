import { reduxDevtools } from "@yaasl/devtools"
import { CONFIG } from "@yaasl/react"

import { isDevEnv } from "utils/is-dev-env"

CONFIG.name = "clocktopus"
CONFIG.globalEffects = [reduxDevtools({ disable: !isDevEnv })]

export * from "@yaasl/react"
