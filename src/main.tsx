import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { isDevEnv } from "utils/is-dev-env"

import { App } from "./app"
import { initTheme } from "./data/theme"
import "./index.css"

const root = document.getElementById("root")
if (!root) throw new Error("No root element found")

if (isDevEnv) {
  document.title = document.title + " (local)"
}

initTheme()

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
)
