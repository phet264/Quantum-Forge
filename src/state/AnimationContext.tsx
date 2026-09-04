import { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { CircuitState } from '@/types/circuit'
import { calculateIntermediateStates } from '@/lib/quantum/simulation/LocalSimulator'

export interface AnimationSettings {
  enabled: boolean
  prefersReducedMotion: boolean
  speed: number
}

interface AnimationContextType {
  settings: AnimationSettings
  updateSettings: (s: Partial<AnimationSettings>) => void
  isPlaying: boolean
  isAnimating: boolean
  isPaused: boolean
  isMeasuring: boolean
  currentStep: string | null // id of the currently animating operation
  progress: { current: number, total: number }
  intermediateStateVector: { real: number, imag: number }[] | null
  playAnimation: (circuit: CircuitState) => Promise<void>
  stopAnimation: () => void
  pauseAnimation: () => void
  resumeAnimation: () => void
  restartAnimation: (circuit: CircuitState) => Promise<void>
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined)

export function AnimationProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AnimationSettings>(() => {
    const saved = localStorage.getItem('quantumforge_animation_settings')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Migrate legacy string speeds to numbers
        if (typeof parsed.speed === 'string') {
          if (parsed.speed === 'slow') parsed.speed = 0.5
          else if (parsed.speed === 'fast') parsed.speed = 2.0
          else parsed.speed = 1.0
        }
        return {
          enabled: parsed.enabled !== undefined ? parsed.enabled : true,
          prefersReducedMotion: parsed.prefersReducedMotion || false,
          speed: typeof parsed.speed === 'number' ? parsed.speed : 1.0
        }
      } catch (e) {}
    }
    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    return {
      enabled: !reducedMotion,
      prefersReducedMotion: reducedMotion,
      speed: 1.0
    }
  })

  const updateSettings = useCallback((newSettings: Partial<AnimationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }, [])

  useEffect(() => {
    localStorage.setItem('quantumforge_animation_settings', JSON.stringify(settings))
  }, [settings])

  const [isPlaying, setIsPlaying] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isMeasuring, setIsMeasuring] = useState(false)
  const [currentStep, setCurrentStep] = useState<string | null>(null)
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const [intermediateStateVector, setIntermediateStateVector] = useState<{ real: number, imag: number }[] | null>(null)
  
  const abortControllerRef = useRef<AbortController | null>(null)
  const isPausedRef = useRef(false)

  // Sync state to ref for delay loop
  useEffect(() => {
    isPausedRef.current = isPaused
  }, [isPaused])

  const stopAnimation = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setIsPlaying(false)
    setIsAnimating(false)
    setIsPaused(false)
    setIsMeasuring(false)
    setCurrentStep(null)
    setProgress({ current: 0, total: 0 })
    setIntermediateStateVector(null)
  }, [])

  const pauseAnimation = useCallback(() => {
    if (isPlaying && isAnimating) {
      setIsPaused(true)
    }
  }, [isPlaying, isAnimating])

  const resumeAnimation = useCallback(() => {
    if (isPlaying && isAnimating) {
      setIsPaused(false)
    }
  }, [isPlaying, isAnimating])

  const playAnimation = useCallback(async (circuit: CircuitState) => {
    if (circuit.operations.length === 0 || !settings.enabled) {
      return Promise.resolve()
    }

    stopAnimation()

    const abortController = new AbortController()
    abortControllerRef.current = abortController

    setIsAnimating(true)
    setIsPlaying(true)
    setIsPaused(false)
    setIsMeasuring(false)
    setCurrentStep(null)
    setProgress({ current: 0, total: circuit.operations.length })

    let states: {real: Float64Array, imag: Float64Array}[]
    try {
      states = calculateIntermediateStates(circuit)
    } catch (e) {
      console.error('Animation state calculation failed', e)
      stopAnimation()
      return Promise.resolve()
    }

    const dim = 1 << circuit.numQubits
    const initial = []
    for(let i=0; i<dim; i++) {
      initial.push({ real: i === 0 ? 1 : 0, imag: 0 })
    }
    setIntermediateStateVector(initial)
    
    let msPerStep = 600 / settings.speed

    const delay = (ms: number) => new Promise(resolve => {
      let remaining = ms
      const step = 50
      
      const tick = () => {
        if (abortController.signal.aborted) {
          resolve(null)
          return
        }
        if (!isPausedRef.current) {
          remaining -= step
        }
        if (remaining <= 0) {
          resolve(null)
        } else {
          setTimeout(tick, step)
        }
      }
      setTimeout(tick, step)
    })

    await delay(msPerStep / 2)

    const ops = [...circuit.operations].sort((a, b) => a.timeStep - b.timeStep)

    for (let i = 0; i < ops.length; i++) {
      if (abortController.signal.aborted) break

      setProgress({ current: i + 1, total: ops.length })
      setCurrentStep(ops[i].id)
      const st = states[i]
      const vec = []
      for(let j=0; j<dim; j++) {
        vec.push({ real: st.real[j], imag: st.imag[j] })
      }
      setIntermediateStateVector(vec)

      await delay(msPerStep)
    }

    if (!abortController.signal.aborted) {
      setCurrentStep(null)
      // Visual Measurement Phase
      setIsMeasuring(true)
      await delay(msPerStep)
      setIsMeasuring(false)
      setIsPlaying(false)
      setIsAnimating(false)
    }
  }, [settings.enabled, settings.speed, stopAnimation])

  const restartAnimation = useCallback(async (circuit: CircuitState) => {
    return playAnimation(circuit)
  }, [playAnimation])

  return (
    <AnimationContext.Provider value={{
      settings,
      updateSettings,
      isPlaying,
      isAnimating,
      isPaused,
      isMeasuring,
      currentStep,
      progress,
      intermediateStateVector,
      playAnimation,
      stopAnimation,
      pauseAnimation,
      resumeAnimation,
      restartAnimation
    }}>
      {children}
    </AnimationContext.Provider>
  )
}

export function useAnimation() {
  const context = useContext(AnimationContext)
  if (!context) {
    throw new Error('useAnimation must be used within an AnimationProvider')
  }
  return context
}
