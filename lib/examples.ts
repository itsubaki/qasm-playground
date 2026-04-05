export interface Example {
    name: string
    code: string
}

export const examples: Example[] = [
    {
        name: "Bell State",
        code: `// Bell State
//
// Prepares two qubits in the entangled Bell state
// The final state is (|00> + |11>)/sqrt(2).

OPENQASM 3.0;

gate h q { U(pi/2.0, 0, pi) q; }
gate cx c, t { ctrl @ U(pi, 0, pi) c, t; }

qubit[2] q;
reset q;

h q[0];
cx q[0], q[1];
`,
    },
    {
        name: "Quantum Teleportation",
        code: `// Quantum Teleportation
//
// Transfers the state of psi to t using entanglement and classical communication.
// The final state of t is the same as the initial state of psi: 0.92|0> + 0.27(1+i))|1>.

OPENQASM 3.0;

gate h q { U(pi/2.0, 0, pi) q; }
gate cx c, t { ctrl @ U(pi, 0, pi) c, t; }
gate cz c, t { ctrl @ U(0, pi, 0) c, t; }

qubit psi;
qubit a;
qubit t;

reset psi;
reset a;
reset t;

// psi = 0.92|0> + 0.27(1+i))|1>
U(pi/4, pi/4, pi/4) psi;

h a;
cx a, t;
cx psi, a;
h psi;

cx a, t;
cz psi, t;

// t = 0.92|0> + 0.27(1+i))|1>
measure psi;
measure a;
`,
    },
    {
        name: "Deutsch-Jozsa Algorithm (constant)",
        code: `// Deutsch-Jozsa Algorithm (constant)
//
// Runs Deutsch-Jozsa with a constant oracle.
// Measure the first qubit:
// 0: the oracle is constant
// 1: the oracle is balanced

OPENQASM 3.0;

gate x q { U(pi, 0, pi) q; }
gate h q { U(pi/2.0, 0, pi) q; }
gate cx q0, q1 { ctrl @ U(pi, 0, pi) q0, q1; }

def oracle(qubit q0, qubit q1) {
    constant(q0, q1);
}

def constant(qubit q0, qubit q1) {
    x q1;
}

def balanced(qubit q0, qubit q1) {
    cx q0, q1;
}

qubit q0;
qubit q1;
reset q0;
reset q1;

h q0;
x q1;
h q1;

oracle(q0, q1);

h q0;
measure q0;
`
    },
    {
        name: "Deutsch-Jozsa Algorithm (balanced)",
        code: `// Deutsch-Jozsa Algorithm (balanced)
//
// Runs Deutsch-Jozsa with a balanced oracle.
// Measure the first qubit:
// 0: the oracle is constant
// 1: the oracle is balanced

OPENQASM 3.0;

gate x q { U(pi, 0, pi) q; }
gate h q { U(pi/2.0, 0, pi) q; }
gate cx q0, q1 { ctrl @ U(pi, 0, pi) q0, q1; }

def oracle(qubit q0, qubit q1) {
    balanced(q0, q1);
}

def constant(qubit q0, qubit q1) {
    x q1;
}

def balanced(qubit q0, qubit q1) {
    cx q0, q1;
}

qubit q0;
qubit q1;
reset q0;
reset q1;

h q0;
x q1;
h q1;

oracle(q0, q1);

h q0;
measure q0;
`
    },
    {
        name: "Quantum Phase Estimation (T)",
        code: `// Quantum Phase Estimation (T)
//
// Estimates the eigenphase of the T gate using the |1> eigenstate.
// The expected phase is phi = 1/8 = 0.001 in binary.
//
// U|psi> = exp(i*2pi*phi)|psi>
// exp(i*pi/4) = exp(i*2pi*1/8)

OPENQASM 3.0;

gate h q { U(pi/2, 0, pi) q; }
gate x q { U(pi, 0, pi) q; }
gate cr(theta) c, t { ctrl @ U(0, 0, theta) c, t; }

def inv_qft(qubit[3] q) {
    h q[2];
    cr(-pi/2) q[2], q[1];

    h q[1];
    cr(-pi/4) q[2], q[0];
    cr(-pi/2) q[1], q[0];

    h q[0];
}

const int n = 3;
qubit[n] c;
qubit t;

reset c;
reset t;

h c;
x t;

// controlled-U^(2^i)
cr(pi/4) c[0], t;
cr(pi/2) c[1], t;
cr(pi)   c[2], t;

inv_qft(c);
`
    },
    {
        name: "Quantum Phase Estimation (Rz(pi/3))",
        code: `// Quantum Phase Estimation (Rz(pi/3))
//
// Estimates the eigenphase of Rz(pi/3) using the |1> eigenstate.
// The expected phase is phi = 1/6 = 0.001010101... in binary.
//
// U|psi> = exp(i*2pi*phi)|psi>
// exp(i*pi/3) = exp(i*2pi*1/6)

OPENQASM 3.0;

gate h q { U(pi/2, 0, pi) q; }
gate x q { U(pi, 0, pi) q; }
gate cr(theta) c, t { ctrl @ U(0, 0, theta) c, t; }

def inv_qft(qubit[7] q) {
    h q[6];
    cr(-pi/2)   q[6], q[5];
    cr(-pi/4)   q[6], q[4];
    cr(-pi/8)   q[6], q[3];
    cr(-pi/16)  q[6], q[2];
    cr(-pi/32)  q[6], q[1];
    cr(-pi/64)  q[6], q[0];

    h q[5];
    cr(-pi/2)   q[5], q[4];
    cr(-pi/4)   q[5], q[3];
    cr(-pi/8)   q[5], q[2];
    cr(-pi/16)  q[5], q[1];
    cr(-pi/32)  q[5], q[0];

    h q[4];
    cr(-pi/2)   q[4], q[3];
    cr(-pi/4)   q[4], q[2];
    cr(-pi/8)   q[4], q[1];
    cr(-pi/16)  q[4], q[0];

    h q[3];
    cr(-pi/2)   q[3], q[2];
    cr(-pi/4)   q[3], q[1];
    cr(-pi/8)   q[3], q[0];

    h q[2];
    cr(-pi/2)   q[2], q[1];
    cr(-pi/4)   q[2], q[0];

    h q[1];
    cr(-pi/2)   q[1], q[0];

    h q[0];
}

const int n = 7;
qubit[n] c;
qubit t;

reset c;
reset t;

h c;
x t;

// controlled-U^(2^i)
cr(pi/3)      c[0], t;
cr(2*pi/3)    c[1], t;
cr(4*pi/3)    c[2], t;
cr(8*pi/3)    c[3], t;
cr(16*pi/3)   c[4], t;
cr(32*pi/3)   c[5], t;
cr(64*pi/3)   c[6], t;

inv_qft(c);
`
    },
    {
        name: "Shor's Algorithm (N=15, a=7)",
        code: `// Shor's Algorithm (N=15, a=7)
//
// Uses phase estimation to find the order r of 7 mod 15.
// where r is the order such that a^r ≡ 1 (mod N).
// From the measured phase (e.g., 1/4 or 3/4), we recover r = 4,
// which yields the factors 3 and 5.
//
// 010: 0.010 = 0.25 = 1/4; r=4.
// 110: 0.110 = 0.75 = 3/4; r=4.
// otherwise: reject and repeat.
//
// gcd(pow(a, r/2)-1, N) = gcd(pow(7, 4/2)-1, 15) = 3.
// gcd(pow(a, r/2)+1, N) = gcd(pow(7, 4/2)+1, 15) = 5.

OPENQASM 3.0;

gate x q { U(pi, 0, pi) q; }
gate h q { U(pi/2.0, 0, pi) q; }
gate cx c, t { ctrl @ U(pi, 0, pi) c, t; }
gate ccx c0, c1, t { ctrl(2) @ U(pi, 0, pi) c0, c1, t; }
gate cr(theta) c, t { ctrl @ U(0, 0, theta) c, t; }

def modexp(qubit[3] q, qubit[4] a) {
    // controlled-U^(2^0)
    cx q[0], a[1];
    cx q[0], a[2];

    // controlled-U^(2^1)
    cx        a[0], a[2];
    ccx q[1], a[2], a[0];
    cx        a[0], a[2];

    cx        a[3], a[1];
    ccx q[1], a[1], a[3];
    cx        a[3], a[1];
}

def inv_qft(qubit[3] q) {
  h q[2];
  cr(-pi/2) q[2], q[1];
  
  h q[1];
  cr(-pi/4) q[2], q[0];
  cr(-pi/2) q[1], q[0];
  
  h q[0];
}

// N=15, a=7
qubit[3] q;
qubit[4] a;
reset q;
reset a;

h q;
x a[3];

modexp(q, a);
inv_qft(q);
`,
    },
    {
        name: "Grover's Algorithm",
        code: `// Grover's Algorithm
//
// Searches a 4-bit state space (2x2 binary grid) using Grover iterations,
// where r = [a, b, c, d].
// The oracle marks the two valid solutions satisfying the constraints:
// a != b, c != d, a != c, and b != d.
// The solutions are [1,0,0,1] and [0,1,1,0].

OPENQASM 3.0;

gate x q { U(pi, 0, pi) q; }
gate h q { U(pi/2.0, 0, pi) q; }
gate cx q0, q1 { ctrl @ U(pi, 0, pi) q0, q1; }
gate xor q0, q1, q2 { cx q0, q2; cx q1, q2; }
gate cccz c0, c1, c2, t { ctrl(3) @ U(0, 0, pi) c0, c1, c2, t; }
gate ccccx c0, c1, c2, c3, t { ctrl(4) @ U(pi, 0, pi) c0, c1, c2, c3, t; }

def oracle(qubit[4] r, qubit[4] s, qubit a) {
    xor r[0], r[1], s[0];
    xor r[2], r[3], s[1];
    xor r[0], r[2], s[2];
    xor r[1], r[3], s[3];

    ccccx s[0], s[1], s[2], s[3], a;

    xor r[1], r[3], s[3];
    xor r[0], r[2], s[2];
    xor r[2], r[3], s[1];
    xor r[0], r[1], s[0];
}

def diffuser(qubit[4] r) {
    h r;
    x r;
    cccz r[0], r[1], r[2], r[3];
    x r;
    h r;
}

def G(qubit[4] r, qubit[4] s, qubit a) {
    oracle(r, s, a);
    diffuser(r);
}

const int n = 4;
qubit[n] r;
qubit[4] s;
qubit a;

reset r;
reset s;
reset a;

h r;
x a;
h a;

int N = 2**n;
int M = 2;
int R = int(pi/4 * sqrt(float(N)/float(M)));

for int i in [0:R-1] {
    G(r, s, a);
}
`,
    },
    {
        name: "Quantum Counting",
        code: `// Quantum Counting
//
// Applies phase estimation to the Grover operator.
// This estimates how many solutions the oracle marks.
//
// The oracle marks the two valid solutions satisfying the constraints:
// a != b, c != d, a != c, and b != d.
// The solutions are [1,0,0,1] and [0,1,1,0].
//
// 011: phi=0.3750, theta=2.3562; M=13.6569, N-M=2.3431
// 101: phi=0.6250, theta=3.9270; M=13.6569, N-M=2.3431

OPENQASM 3.0;

gate x q { U(pi, 0, pi) q; }
gate h q { U(pi/2.0, 0, pi) q; }
gate cr(theta) c, t { ctrl @ U(0, 0, theta) c, t; }
gate cx q0, q1 { ctrl @ U(pi, 0, pi) q0, q1; }
gate xor q0, q1, q2 { cx q0, q2; cx q1, q2; }
gate ccccz c0, c1, c2, c3, t { ctrl(4) @ U(0, 0, pi) c0, c1, c2, c3, t; }
gate cccccx c0, c1, c2, c3, c4, t { ctrl(5) @ U(pi, 0, pi) c0, c1, c2, c3, c4, t; }

// The oracle flips the phase when the following uniqueness constraints are satisfied:
// a != b, c != d, a != c, and b != d.
def oracle(qubit[4] r, qubit[4] s, qubit c, qubit a) {
    xor r[0], r[1], s[0];
    xor r[2], r[3], s[1];
    xor r[0], r[2], s[2];
    xor r[1], r[3], s[3];

    cccccx s[0], s[1], s[2], s[3], c, a;

    xor r[1], r[3], s[3];
    xor r[0], r[2], s[2];
    xor r[2], r[3], s[1];
    xor r[0], r[1], s[0];
}

def diffuser(qubit c, qubit[4] r) {
    h r;
    x r;
    ccccz r[0], r[1], r[2], c, r[3];
    x r;
    h r;
}

def controlledG(qubit[4] r, qubit[4] s, qubit c, qubit a) {
  oracle(r, s, c, a);
  diffuser(c, r);
}

def inv_qft(qubit[3] q) {
  h q[2];
  cr(-pi/2) q[2], q[1];
  
  h q[1];
  cr(-pi/4) q[2], q[0];
  cr(-pi/2) q[1], q[0];
  
  h q[0];
}

const int n = 3;
qubit[n] c;
qubit[4] r;
qubit[4] s;
qubit a;

// initialize
reset c;
reset r;
reset s;
reset a;

h c;
h r;
x a;
h a;

for int i in [0:n-1] {
  for int j in [0:(1<<i)-1] {
    controlledG(r, s, c[i], a);
  }
}

inv_qft(c);
`,
    },
    {
        name: "Quantum Signal Processing",
        code: `// Quantum Signal Processing
//
// This example uses standard QSP building blocks:
//   W(theta): signal operator, where x = cos(theta)
//   S(phi):   phase operator
//
// The phase sequence is:
//   W(theta) -> S(pi/4) -> W(theta) -> S(-pi/4) -> W(theta)
//
// For this sequence, the amplitude of |0> becomes:
//   P(x) = 2x^3 - x
//
// where x = cos(theta).
//
// Example:
//   theta = pi/6  →  x = cos(pi/6) = sqrt(3)/2
//   P(x) = 2x^3 - x = sqrt(3)/4 ≈ 0.433013
//
// The final state has the form:
//   P(x)|0> + Q(x)|1>
//
// Verified for theta = pi/6:
//   final state = 0.433013|0> + (-0.5 + 0.75i)|1>

OPENQASM 3.0;

gate Rx(theta) q { U(theta, -pi/2, pi/2) q; }
gate W(theta) q { Rx(-2 * theta) q; }
gate S(phi) q { U(0, 0, -2 * phi) q; }

qubit q;
reset q;

W(pi/6) q;
S(pi/4) q;
W(pi/6) q;
S(-pi/4) q;
W(pi/6) q;
`,
    },
    {
        name: "Error Correction",
        code: `// Error Correction
//
// Encodes one qubit with the three-qubit bit-flip code.
// It detects and corrects a single X error.

OPENQASM 3.0;

gate x q { U(pi, 0, pi) q; }
gate cx q0, q1 { ctrl @ U(pi, 0, pi) q0, q1; }

qubit psi;
reset psi;

// psi = 0.92|0> + 0.27(1+i))|1>
U(pi/4, pi/4, pi/4) psi;

// encode
qubit[2] enc;
reset enc;

cx psi, enc[0];
cx psi, enc[1];

// error (bit-flip on the first qubit)
x psi;

// add ancilla
qubit[2] a;
reset a;

// error correction
cx psi,    a[0];
cx enc[0], a[0];
cx enc[0], a[1];
cx enc[1], a[1];

bit m0 = measure a[0];
bit m1 = measure a[1];

if(m0 && !m1) { x psi; }
if(m0 && m1)  { x enc[0]; }
if(!m0 && m1) { x enc[1]; }

// decode
cx psi, enc[1];
cx psi, enc[0];
`,
    },
    {
        name: "Magic State Distillation",
        code: `// Magic State Distillation
//
// Prepares and checks a magic state used for non-Clifford gates.
// The final measurements decide whether to accept the state.
//
// |A> is the "magic state" used to implement the T gate
// It can be seen as a rotated version of |+> under T:
// T|+> = exp(-i * pi/8 * Z) |+>
// |A>  = exp(-i * pi/8 * Y) |0> = cos(pi/8)|0> + sin(pi/8)|1> = 0.9238...|0> + 0.3826...|1>
//
// This representation rotates the computational basis from Z to Y
// |A> is an eigenstate of Hadamard: H|A> = |A>
// Hadamard can also be expressed as H = A†XA
//
// |0>|0>|A>: accept.
// otherwise: reject and repeat.

OPENQASM 3.0;

gate h q { U(pi/2, 0, pi) q; }
gate ry(theta) q { U(theta, 0, 0) q; }
gate cx c, t { ctrl @ U(pi, 0, pi) c, t; }

def prepare_magic(qubit q) {
    ry(pi/4) q;
}

qubit z;
qubit a;
qubit plus;

reset z;
reset a;
reset plus;

prepare_magic(a);
h plus;

h z;
ry(pi/4) a;
cx z, a;
ry(-pi/4) a;
h z;

cx plus, a;

measure z;
measure a;
`,
    },
]
