import { ArrowLeft, Frown } from "lucide-react"

import { Button } from "components/ui/button"
import { ContextInfo } from "components/ui/context-info"

export const NotFoundRoute = () => (
  <div className="grid size-full place-content-center">
    <ContextInfo icon={Frown} animateIcon="rotate" label="404 - Not Found">
      <p>Sorry, the page you are looking for does not exist.</p>
      <div className="mx-auto mt-4">
        <Button look="key" icon={ArrowLeft} href="#">
          Go to main page
        </Button>
      </div>
    </ContextInfo>
  </div>
)
