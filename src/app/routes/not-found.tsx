import { Frown } from "lucide-react"

import { ContextInfo } from "components/ui/context-info"

export const NotFoundRoute = () => (
  <div className="grid size-full place-content-center">
    <ContextInfo icon={Frown} label="404 - Not Found" />
    <p>Sorry, the page you are looking for does not exist.</p>
  </div>
)
