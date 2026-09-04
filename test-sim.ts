import { LocalSimulator } from './src/lib/quantum/simulation/LocalSimulator.ts';
import type { CircuitState } from './src/types/circuit.ts';

const sim = new LocalSimulator();

const testCircuit = async () => {
  const hCircuit: CircuitState = {
    numQubits: 2,
    operations: [
      { id: '1', type: 'H', targets: [0], controls: [], timeStep: 0 }
    ]
  };

  const bellCircuit: CircuitState = {
    numQubits: 2,
    operations: [
      { id: '1', type: 'H', targets: [0], controls: [], timeStep: 0 },
      { id: '2', type: 'CX', targets: [1], controls: [0], timeStep: 1 }
    ]
  };

  console.log("H Circuit Result:");
  console.log(await sim.run(hCircuit, 1024));

  console.log("Bell Circuit Result:");
  console.log(await sim.run(bellCircuit, 1024));
};

testCircuit();
