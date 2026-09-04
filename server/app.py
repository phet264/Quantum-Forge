import time
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import qiskit
from qiskit_aer import AerSimulator
import qiskit.qasm2

app = FastAPI()
simulator = AerSimulator()

@app.get("/health")
def health_check():
    return {"status": "ok"}

class SimulationRequest(BaseModel):
    qasm: str
    shots: int = 1024

@app.post("/api/simulate/qiskit")
def simulate_qiskit(req: SimulationRequest):
    start_time = time.time()
    try:
        if not req.qasm.strip():
            raise HTTPException(status_code=400, detail="QASM string is empty.")

        # Parse QASM string using qasm2 (supported in Qiskit 1.x)
        try:
            circuit = qiskit.qasm2.loads(req.qasm)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to parse QASM: {str(e)}")

        num_qubits = circuit.num_qubits
        depth = circuit.depth()

        # Run the circuit on AerSimulator
        # We need two independent executions: 
        # 1. Measurement execution (for counts and probabilities)
        # 2. Statevector execution (for exact state)
        
        counts = {}
        probabilities = {}
        state_vector_formatted = None

        # 1. Shot-based execution for counts
        if req.shots > 0:
            qc_meas = circuit.copy()
            # Only add measurements if not already present
            if not any(inst.operation.name == 'measure' for inst in qc_meas.data):
                if not qc_meas.cregs:
                    from qiskit.circuit import ClassicalRegister
                    qc_meas.add_register(ClassicalRegister(qc_meas.num_qubits, 'c'))
                # Measure all qubits into the first classical register
                for i in range(qc_meas.num_qubits):
                    qc_meas.measure(i, i)
                
            qc_meas = qiskit.transpile(qc_meas, simulator)
            result_meas = simulator.run(qc_meas, shots=req.shots).result()
            
            try:
                counts = result_meas.get_counts(qc_meas)
            except Exception:
                counts = {}
                
            if counts:
                clean_counts = {}
                for k, v in counts.items():
                    # Handle Qiskit measure_all space-separated registers (e.g. '00 00')
                    clean_k = k.replace(" ", "")
                    probabilities[clean_k] = v / req.shots
                    clean_counts[clean_k] = v
                counts = clean_counts

        # 2. Exact statevector execution
        import numpy as np
        try:
            qc_sv = circuit.copy()
            # Remove any existing measurements to ensure pure statevector works
            qc_sv.data = [inst for inst in qc_sv.data if inst.operation.name != 'measure']
            
            qc_sv.save_statevector()
            qc_sv = qiskit.transpile(qc_sv, simulator)
            result_sv = simulator.run(qc_sv, shots=0).result()
            
            sv = np.asarray(result_sv.get_statevector(qc_sv))
            state_vector_formatted = [{"real": float(amp.real), "imag": float(amp.imag)} for amp in sv]
        except Exception as e:
            print(f"Statevector extraction failed: {e}")
            state_vector_formatted = None

        time_taken_ms = (time.time() - start_time) * 1000

        return {
            "backend": "qiskit-aer",
            "shots": req.shots,
            "counts": counts,
            "measurements": counts, # for backward compatibility with frontend
            "probabilities": probabilities,
            "stateVector": state_vector_formatted,
            "executionTimeMs": time_taken_ms,
            "numQubits": num_qubits,
            "depth": depth,
            "status": "SUCCESS"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

from pydantic import Field
from typing import List, Dict, Any, Optional
import os
from dotenv import load_dotenv
load_dotenv()

class TutorMessage(BaseModel):
    role: str
    content: str

class GateOperation(BaseModel):
    type: str
    targets: List[int]
    controls: List[int]
    param: Optional[str] = None
    timeStep: int

class CircuitContext(BaseModel):
    numQubits: int
    depth: int
    operations: List[GateOperation]
    qasm: Optional[str] = None

class StateVectorAmp(BaseModel):
    real: float
    imag: float

class SimulationContext(BaseModel):
    backend: str
    shots: int
    counts: Dict[str, int]
    probabilities: Dict[str, float]
    stateVector: Optional[List[StateVectorAmp]] = None

class AssessmentTutorContext(BaseModel):
    assessment_title: str
    difficulty: str
    question_title: str
    question_type: str
    question_description: str
    student_answer: str
    correct_answer: str
    explanation: str

class ChallengeContext(BaseModel):
    title: str
    description: str
    score: Optional[int] = None
    mistakes: Optional[List[str]] = None
    expected_result: Optional[str] = None
    student_result: Optional[str] = None

class TutorContext(BaseModel):
    circuit: Optional[CircuitContext] = None
    simulation: Optional[SimulationContext] = None
    assessment: Optional[AssessmentTutorContext] = None
    challenge: Optional[ChallengeContext] = None
    learning_context: Optional[str] = None
    selected_qubit: Optional[int] = None

class TutorRequest(BaseModel):
    messages: List[TutorMessage]
    context: TutorContext

@app.post("/api/tutor/chat")
def tutor_chat(req: TutorRequest):
    api_key = os.getenv("GEMINI_API_KEY")
    import google.generativeai as genai
    genai.configure(api_key=api_key)

    ctx_info = "=== CURRENT CONTEXT (JSON) ===\n"
    if req.context.circuit:
        ctx_info += f"User's Circuit State:\n```json\n{req.context.circuit.model_dump_json(indent=2)}\n```\n"
    if req.context.simulation:
        ctx_info += f"Latest Simulation Result:\n```json\n{req.context.simulation.model_dump_json(indent=2)}\n```\n"
    if req.context.learning_context:
        ctx_info += f"Learning Context: {req.context.learning_context}\n"
    if req.context.assessment:
        ctx_info += f"Assessment Context:\n"
        ctx_info += f"- Assessment: {req.context.assessment.assessment_title} ({req.context.assessment.difficulty})\n"
        ctx_info += f"- Question: {req.context.assessment.question_title} ({req.context.assessment.question_type})\n"
        ctx_info += f"- Description: {req.context.assessment.question_description}\n"
        ctx_info += f"- Student's Answer: {req.context.assessment.student_answer}\n"
        ctx_info += f"- Correct Answer: {req.context.assessment.correct_answer}\n"
        ctx_info += f"- Explanation/Reasoning: {req.context.assessment.explanation}\n"
    if req.context.challenge:
        ctx_info += f"Challenge: {req.context.challenge.title}\n"
        ctx_info += f"Challenge Goal: {req.context.challenge.description}\n"
        if req.context.challenge.score is not None:
            ctx_info += f"Student Score: {req.context.challenge.score}%\n"
        if req.context.challenge.expected_result:
            ctx_info += f"Expected Result: {req.context.challenge.expected_result}\n"
        if req.context.challenge.student_result:
            ctx_info += f"Student's Result: {req.context.challenge.student_result}\n"
        if req.context.challenge.mistakes:
            ctx_info += f"Evaluated Mistakes: {', '.join(req.context.challenge.mistakes)}\n"
    if req.context.selected_qubit is not None:
        ctx_info += f"Selected Qubit: {req.context.selected_qubit}\n"

    sys_prompt = (
        "You are an interactive quantum teacher sitting with a student, looking at their actual circuit.\n"
        "Your responses must NOT feel like an AI-generated laboratory report, a university textbook, or generic documentation.\n\n"
        "CRITICAL RULES:\n"
        "1. NO FIXED RESPONSES OR TEMPLATES: You MUST dynamically generate a response tailored specifically to the user's exact question. Never force a predefined structure, headings, or sections like 'Initialization', 'Gate-by-Gate', 'Mathematics', or 'Simulation Results'.\n"
        "2. QUESTION-FIRST: Answer the exact question immediately in the first 1-2 sentences. Do NOT give a preamble.\n"
        "3. AVOID UNNECESSARY METADATA: Do NOT explain the classical register, QASM, bit ordering, state-vector indices, or every single gate UNLESS the question specifically asks about them or it's absolutely necessary to explain the result.\n"
        "4. 'POINT AT THE CIRCUIT' STYLE: Talk as if you and the student are looking at the circuit. Use phrases like 'Look at q0...', 'This X gate...', 'Notice that q2...'. Focus only on the important operations.\n"
        "5. EXPLAIN WHY: After stating what the circuit does, explain WHY it does it.\n"
        "6. MATHEMATICS IS STRICTLY ON-DEMAND: For beginners, use simple '0 -> 1' logic. Only introduce math notation (|ψ⟩ = ...) if the user specifically asks 'Explain mathematically' or if it genuinely clarifies the concept.\n"
        "7. SCIENTIFIC ACCURACY: Never say 'Z does nothing'. Say 'Z leaves |0⟩ unchanged. Its interesting effect appears on |1⟩'.\n"
        "8. CLASSICAL VS QUANTUM: Never confuse quantum states with classical bitstrings. If explaining simulation results, use the actual data naturally (e.g. 'And your simulator confirms it: all 1024 shots produced 0001'). Do NOT output a raw 'Simulation Results' block.\n"
        "9. NO RAW DATA OR BOILERPLATE: Never output raw SVG, JSON, or QASM (unless asked). Avoid repetitive phrases like 'Hello!', 'Let's dive in', or 'Here is a step-by-step walkthrough'.\n"
        "10. OPTIONAL ENDING: Only suggest ONE experiment if it teaches something genuinely useful. Do NOT automatically say 'Try this' at the end of every answer.\n"
        "11. INTERACTIVE GATE HIGHLIGHTING: When mentioning a specific gate from the user's circuit in your explanation, ALWAYS format it as a markdown link using the gate's exact ID, like this: `[the H gate](#gate-{id})`. For example, if explaining gate 'op-1234', write: 'Notice how [this H gate](#gate-op-1234) on q0...'. This allows the user to click the text and highlight the gate in their Circuit Builder.\n\n"
        "DYNAMIC BEHAVIOR EXAMPLES:\n"
        "- 'What does my circuit do?' -> Concise circuit explanation focusing on the main effect.\n"
        "- 'Why didn't Z change q1?' -> Focus SPECIFICALLY on Z and q1. Do NOT explain the rest of the circuit.\n"
        "- 'Explain this mathematically' -> Give mathematical detail.\n"
        "- 'I'm confused' -> Re-explain using a simpler mental model instead of repeating the previous answer.\n\n"
        "SELF-CHECK BEFORE ANSWERING:\n"
        "Did I answer the question immediately? Did I focus on the important part? Did I avoid unnecessary metadata and math? Did I avoid textbook language and fixed templates?\n\n"
        "CONTEXT:\n"
        "The user's actual quantum circuit and simulation results are in the 'CURRENT CONTEXT (JSON)' section below.\n"
    )
    
    sys_prompt += ctx_info

    try:
        model_name = os.getenv("GEMINI_MODEL", "gemini-flash-lite-latest")
        model = genai.GenerativeModel(model_name, system_instruction=sys_prompt)
        
        # Build a single prompt from history
        full_prompt = ""
        for m in req.messages[:-1]:
            role = "USER" if m.role == "user" else "AI"
            full_prompt += f"{role}: {m.content}\n\n"
            
        last_msg = req.messages[-1].content
        full_prompt += f"USER: {last_msg}\n\nAI:"
        
        response = model.generate_content(full_prompt)
        return {"reply": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
