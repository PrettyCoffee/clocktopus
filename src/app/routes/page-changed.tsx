import { Replace, RotateCcw } from "lucide-react"

import { Button } from "components/ui/button"
import { ContextInfo } from "components/ui/context-info"

export const PageChangedRoute = () => (
  <div className="mx-auto grid size-full max-w-md place-content-center">
    <ContextInfo icon={Replace} label="Something changed!" animateIcon="rotate">
      <p>
        Seems like clocktopus got an update since the last time you used this
        tab. Please reload the page to apply the changes.
      </p>
      <div className="mx-auto mt-4">
        <Button look="key" icon={RotateCcw} href="#">
          Reload
        </Button>
      </div>
    </ContextInfo>
  </div>
)
