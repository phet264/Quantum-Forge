import type { CircuitChallenge } from '@/types/assessment'
import type { CircuitState } from '@/types/circuit'

export interface ValidationResult {
  valid: boolean
  errors: string[]
}

export function validateChallengeCircuit(challenge: CircuitChallenge, circuit: CircuitState): ValidationResult {
  const rules = challenge.criteria.rules || []
  if (rules.length === 0) {
    return { valid: true, errors: [] }
  }

  const errors: string[] = []

  for (const rule of rules) {
    switch (rule.type) {
      case 'must_not_be_empty':
        if (circuit.operations.length === 0) {
          errors.push(rule.errorMessage)
        }
        break

      case 'must_have_gate':
        const hasRequiredGate = circuit.operations.some(op => op.type === rule.gate)
        if (!hasRequiredGate) {
          errors.push(rule.errorMessage)
        }
        break

      case 'must_entangle':
        // Look for multi-qubit gates (like CX where controls length > 0)
        // Wait, SWAP doesn't have controls in our state, it has 2 targets.
        const hasEntanglingGate = circuit.operations.some(
          op => (op.controls && op.controls.length > 0) || (op.targets && op.targets.length > 1)
        )
        if (!hasEntanglingGate) {
          errors.push(rule.errorMessage)
        }
        break

      case 'banned_gate':
        const hasBannedGate = circuit.operations.some(op => op.type === rule.gate)
        if (hasBannedGate) {
          errors.push(rule.errorMessage)
        }
        break
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
