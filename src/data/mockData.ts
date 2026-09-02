/**
 * Centralized mock data for Phase 0 UI components.
 * Prevents UI components from containing large embedded data structures.
 */

export const MOCK_ACTIVE_TASKS = [
  {
    id: 'task-1',
    title: "Shor's Algorithm",
    description: "Prime Factorization 2048-bit",
    type: "Advanced",
    progress: 78
  },
  {
    id: 'task-2',
    title: "Grover's Search",
    description: "Database Acceleration T-1",
    type: "Intermediate",
    progress: 34
  }
]

export const MOCK_EXPERIMENT_LOGS = [
  {
    id: 'log-1',
    code: 'SYS_OK [200]',
    time: '14:02:45',
    message: 'Circuit compilation completed successfully. 42 gates applied.',
    type: 'success'
  },
  {
    id: 'log-2',
    code: 'CAL_INIT [100]',
    time: '13:58:12',
    message: 'Initiated routine qubit calibration sequence.',
    type: 'info'
  },
  {
    id: 'log-3',
    code: 'DECO_WARN [403]',
    time: '13:45:01',
    message: 'Slight decoherence detected in Qubit Q-14. Auto-correction applied.',
    type: 'warning'
  },
  {
    id: 'log-4',
    code: 'JOB_END [201]',
    time: '12:30:00',
    message: 'VQE simulation finished. Results saved to Datastore.',
    type: 'info'
  }
]
