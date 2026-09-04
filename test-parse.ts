import { parseQASM } from './src/lib/quantum/qasm.ts';

const qasm = `OPENQASM 2.0;
include "qelib1.inc";
qreg q[2];
id q[0];
`;

console.log(JSON.stringify(parseQASM(qasm), null, 2));

const qasmH = `OPENQASM 2.0;
include "qelib1.inc";
qreg q[2];
h q[0];
`;

console.log(JSON.stringify(parseQASM(qasmH), null, 2));
