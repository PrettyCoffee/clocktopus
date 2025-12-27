import { Trans } from "@lingui/react/macro"

import { Button } from "../ui/button"

export const MainErrorFallback = () => (
  <div
    className="flex size-full flex-col items-center justify-center text-alert-error"
    role="alert"
  >
    <h2 className="text-lg font-semibold">
      <Trans>Ooops, something went wrong :(</Trans>
    </h2>
    <Button
      className="mt-4"
      onClick={() =>
        window.location.assign(
          window.location.origin + window.location.pathname
        )
      }
    >
      <Trans>Refresh</Trans>
    </Button>
  </div>
)
