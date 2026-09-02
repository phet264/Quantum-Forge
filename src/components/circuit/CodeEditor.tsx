import { useCircuit } from '@/state/CircuitContext'
import Editor, { useMonaco } from '@monaco-editor/react'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { useEffect } from 'react'
import { useTheme } from 'next-themes'

export function CodeEditor() {
  const { code, parseError, updateFromCode } = useCircuit()
  const monaco = useMonaco()
  const { theme } = useTheme()

  useEffect(() => {
    if (monaco) {
      // We could define a custom QASM language syntax highlighting here
      // For now, let's just use python or plain text as it looks decent
    }
  }, [monaco])

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      updateFromCode(value)
    }
  }

  return (
    <div className="h-full flex flex-col glass-card rounded-lg overflow-hidden border border-border">
      <div className="flex justify-between items-center p-3 border-b border-border bg-card">
        <h3 className="font-label-caps text-label-caps text-muted-foreground uppercase tracking-wider">QASM Editor</h3>
        
        <div className="flex items-center text-xs font-code-sm">
          {parseError ? (
            <span className="flex items-center text-destructive">
              <AlertCircle className="h-3.5 w-3.5 mr-1" /> Error
            </span>
          ) : (
            <span className="flex items-center text-primary">
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Valid
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 relative">
        <Editor
          height="100%"
          defaultLanguage="python" // Fallback language for reasonable highlighting
          theme={theme === 'light' ? 'light' : 'vs-dark'}
          value={code}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: 'JetBrains Mono, monospace',
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            padding: { top: 16 }
          }}
        />
      </div>

      {parseError && (
        <div className="p-3 bg-destructive/10 border-t border-destructive/20 text-destructive text-xs font-code-sm flex items-start shadow-inner">
          <AlertCircle className="h-4 w-4 mr-2 shrink-0 mt-0.5" />
          <span className="leading-relaxed">{parseError}</span>
        </div>
      )}
    </div>
  )
}
