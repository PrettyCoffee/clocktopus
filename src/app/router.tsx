import { AppLayout } from "./layout"
import { NotFoundRoute } from "./routes/not-found"

export const AppRouter = () => (
  <AppLayout>
    <NotFoundRoute />
  </AppLayout>
)
