import { Component, FunctionComponent, ReactNode } from "react"

import { Trans } from "@lingui/react/macro"

const DefaultFallback = () => (
  <div className="flex size-full flex-col items-center justify-center">
    <Trans>
      <div>💥KABOOM💥</div>
      <div className="text-sm text-text-gentle">
        Something went terribly wrong and everything is burning now.
      </div>
    </Trans>
  </div>
)

interface Props {
  children: ReactNode
  Fallback?: FunctionComponent
  onCatch?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface State {
  error: null | Error
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { onCatch } = this.props
    onCatch?.(error, errorInfo)
    console.error("Uncaught error:", error, errorInfo)
  }

  componentDidUpdate(prevProps: Props) {
    const { children } = this.props
    if (children !== prevProps.children) {
      this.setState({ error: null })
    }
  }

  render() {
    const { children, Fallback = DefaultFallback } = this.props
    const { error } = this.state
    return !error ? children : <Fallback />
  }
}
