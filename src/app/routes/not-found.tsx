import { Frown } from "lucide-react"

import { NoData } from "components/ui/no-data"

export const NotFoundRoute = () => (
  <div className="grid size-full place-content-center">
    <NoData icon={Frown} label="404 - Not Found" />
    <p>Sorry, the page you are looking for does not exist.</p>
  </div>
)
