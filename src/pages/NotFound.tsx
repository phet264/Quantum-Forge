import { AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="glass-card rounded-lg p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center mb-6">
          <AlertCircle className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="font-headline-lg text-headline-lg mb-2">404 - Not Found</h1>
        <p className="text-muted-foreground font-body-md mb-8">
          The page or experiment you are looking for does not exist or has been moved.
        </p>
        <Button asChild className="w-full">
          <Link to="/">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
