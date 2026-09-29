import { type PropsWithChildren } from "react"

import { DialogProvider } from "components/ui/dialog"
import { Toaster } from "components/ui/toaster"
import { TooltipProvider } from "components/ui/tooltip"
import { LocaleProvider } from "locales/locale-provider"
import { Router } from "wouter"
import { useHashLocation } from "wouter/use-hash-location"

export const AppProviders = ({ children }: PropsWithChildren) => (
  <LocaleProvider>
    <Router hook={useHashLocation}>
      <TooltipProvider>
        <Toaster />
        <DialogProvider />
        {children}
      </TooltipProvider>
    </Router>
  </LocaleProvider>
)
