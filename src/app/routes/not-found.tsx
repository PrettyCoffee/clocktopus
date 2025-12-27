import { Trans } from "@lingui/react/macro"
import { ArrowLeft, Frown } from "lucide-react"

import { Button } from "components/ui/button"
import { ContextInfo } from "components/ui/context-info"

export const NotFoundRoute = () => (
  <div className="grid size-full place-content-center">
    <ContextInfo icon={Frown} animateIcon="rotate" label="404 - Not Found">
      <p>
        <Trans>Sorry, the page you are looking for does not exist.</Trans>
      </p>
      <div className="mx-auto mt-4">
        <Button look="key" icon={ArrowLeft} href="#">
          <Trans>Go to main page</Trans>
        </Button>
      </div>
    </ContextInfo>
  </div>
)
