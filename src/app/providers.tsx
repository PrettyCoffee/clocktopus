import { PropsWithChildren } from "react"

import { Router } from "wouter"
import { useHashLocation } from "wouter/use-hash-location"

import { DialogProvider } from "components/ui/dialog"
import { Toaster } from "components/ui/toaster"
import { TooltipProvider } from "components/ui/tooltip"
import { LocaleProvider } from "locales/locale-provider"

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
