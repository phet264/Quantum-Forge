import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
          <div className="glass-card rounded-lg p-8 max-w-md w-full text-center border-destructive/20">
            <div className="w-16 h-16 rounded-full bg-destructive/10 mx-auto flex items-center justify-center mb-6">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="font-headline-md text-headline-md mb-2">System Error</h1>
            <p className="text-muted-foreground font-body-md mb-6">
              An unexpected error occurred in the QuantumForge application.
            </p>
            <div className="bg-muted p-4 rounded text-left mb-6 overflow-auto max-h-32 text-xs font-mono text-muted-foreground border border-border">
              {this.state.error?.message || 'Unknown error'}
            </div>
            <Button 
              onClick={() => {
                this.setState({ hasError: false, error: null })
                window.location.href = '/'
              }}
              className="w-full"
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
