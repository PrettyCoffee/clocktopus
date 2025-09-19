import { PropsWithChildren, Suspense } from "react"

import { ArrowLeft, History, Settings } from "lucide-react"
import { useHashLocation } from "wouter/use-hash-location"

import { MainErrorFallback } from "components/errors/main"
import { Layout } from "components/layouts/layout"
import { Github } from "components/ui/icon"
import { IconButton } from "components/ui/icon-button"
import { Spinner } from "components/ui/spinner"
import { ErrorBoundary } from "components/utility/error-boundary"
import { cn } from "utils/cn"
import { hstack } from "utils/styles"

export const AppLayout = ({ children }: PropsWithChildren) => {
  const [path] = useHashLocation()
  const isSettingsRoute = path.endsWith("settings")

  return (
    <Layout.Root>
      <Layout.Side
        actions={
          isSettingsRoute
            ? { title: "Back", icon: ArrowLeft, to: "" }
            : { title: "Settings", icon: Settings, to: "settings" }
        }
      >
        <img
          className="mx-auto size-40 rounded-lg opacity-50 shade-medium"
          src="./clocktopus.png"
          alt="logo"
        />
        <div className="flex-1" />
        <div className={cn(hstack({ gap: 1 }), "ml-4 *:flex-1")}>
          <IconButton
            icon={Github}
            title="Github Repository"
            href="https://github.com/PrettyCoffee/clocktopus"
            target="_blank"
          />
          <IconButton icon={History} title="Changelog" />
        </div>
      </Layout.Side>
      <Layout.Main>
        <Suspense fallback={<Spinner size="xl" />}>
          <ErrorBoundary Fallback={MainErrorFallback}>{children}</ErrorBoundary>
        </Suspense>
      </Layout.Main>
    </Layout.Root>
  )
}
