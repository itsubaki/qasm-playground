export const examples = [
  {
    name: "Bell State",
    code: `// Bell State

OPENQASM 3.0;

gate h q { U(pi/2.0, 0, pi) q; }
gate cx c, t { ctrl @ U(pi, 0, pi) c, t; }

qubit[2] q;
reset q;

h q[0];
cx q[0], q[1];

measure q;
`,
  },
  {
    name: "Quantum Teleportation",
    code: `// Quantum Teleportation

OPENQASM 3.0;

gate h q { U(pi/2.0, 0, pi) q; }
gate cx c, t { ctrl @ U(pi, 0, pi) c, t; }
gate cz c, t { ctrl @ U(0, pi, 0) c, t; }

qubit phi;
qubit a;
qubit t;

reset phi;
reset a;
reset t;

// 0.92|0> + 0.27(1+i))|1>
U(pi/4, pi/4, pi/4) phi;

h a;
cx a, t;
cx phi, a;
h phi;

cx a, t;
cz phi, t;

// 0.92|0> + 0.27(1+i))|1>
measure phi;
measure a;
`,
  },
  {
    name: "Deutsch-Jozsa Algorithm",
    code: `// Deutsch-Jozsa Algorithm

OPENQASM 3.0;

gate x q { U(pi, 0, pi) q; }
gate h q { U(pi/2.0, 0, pi) q; }
gate cx q0, q1 { ctrl @ U(pi, 0, pi) q0, q1; }

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

x q1;
h q0;
h q1;

balanced(q0, q1);

h q0;
measure q0;
`
  },
  {
    name: "Grover's Algorithm",
    code: `// Grover's Algorithm

OPENQASM 3.0;

gate x q { U(pi, 0, pi) q; }
gate h q { U(pi/2.0, 0, pi) q; }
gate cccx c0, c1, c2, t { ctrl(3) @ U(pi, 0, pi) c0, c1, c2, t; }

// oracle for |110>|x>
def oracle(qubit[3] q, qubit a) {
    x q[2]; x a;
    h a;
    cccx q[0], q[1], q[2], a;
    h a;
    x q[2]; x a;
}

def diffuser(qubit[3] q, qubit a) {
    h q; h a;
    x q; x a;
    h a;
    cccx q[0], q[1], q[2], a;
    h a;
    x q; x a;
    h q; h a;
}

const int n = 3;
qubit[n] q;
qubit a;
reset q;
reset a;

h q;
h a;

int N = 2**(n+1);
int R = int(pi/4 * sqrt(float(N)));
for int i in [0:R] {
    oracle(q, a);
    diffuser(q, a);
}

measure a;
`,
  },
  {
    name: "Grover's Algorithm (Sudoku 2x2)",
    code: `// Grover's Algorithm (Sudoku 2x2)

OPENQASM 3.0;

gate x q { U(pi, 0, pi) q; }
gate h q { U(pi/2.0, 0, pi) q; }

gate cx q0, q1 { ctrl @ U(pi, 0, pi) q0, q1; }
gate cccz c0, c1, c2, t { ctrl(3) @ U(0, pi, 0) c0, c1, c2, t; }
gate ccccz c0, c1, c2, c3, t { ctrl(4) @ U(0, pi, 0) c0, c1, c2, c3, t; }
gate xor q0, q1, q2 { cx q0, q2; cx q1, q2; }

// The oracle constructs a Grover oracle that validates solutions to a 2x2 sudoku puzzle.
// The oracle flips the phase when the following uniqueness constraints are satisfied: a != b, c != d, a != c, b != d.
// Valid solutions are [1,0,0,1] and [0,1,1,0].
def oracle(qubit[4] r, qubit[4] s, qubit a) {
    xor r[0], r[1], s[0];
    xor r[2], r[3], s[1];
    xor r[0], r[2], s[2];
    xor r[1], r[3], s[3];

    ccccz s[0], s[1], s[2], s[3], a;

    xor r[3], r[1], s[3];
    xor r[2], r[0], s[2];
    xor r[3], r[2], s[1];
    xor r[1], r[0], s[0];
}

def diffuser(qubit[4] r) {
    h r;
    x r;
    cccz r[0], r[1], r[2], r[3];
    x r;
    h r;
}

const int n = 4;
qubit[n] r;
qubit[4] s;
qubit a;

reset r;
reset s;
reset a;

h r;
h a;

int N = 2**n;
int M = 2;
int R = int(pi/4 * sqrt(float(N)/float(M)));

for int i in [0:R] {
    oracle(r, s, a);
    diffuser(r);
}
`,
  },
  {
    name: "Shor's Algorithm (N=15, a=7)",
    code: `// Shor's Algorithm (N=15, a=7)

OPENQASM 3.0;

gate x q { U(pi, 0, pi) q; }
gate h q { U(pi/2.0, 0, pi) q; }
gate cx c, t { ctrl @ U(pi, 0, pi) c, t; }
gate ccx c0, c1, t { ctrl(2) @ U(pi, 0, pi) c0, c1, t; }
gate crz(theta) c, t { ctrl @ U(0, 0, theta) c, t; }

def modexp(qubit[3] q, qubit[4] a) {
    // controlled-U^(2^0)
    cx q[2], a[1];
    cx q[2], a[2];

    // controlled-U^(2^1)
    cx        a[0], a[2];
    ccx q[1], a[2], a[0];
    cx        a[0], a[2];
    
    cx        a[3], a[1];
    ccx q[1], a[1], a[3];
    cx        a[3], a[1];
}

def swap(qubit[3] q) {
  cx q[0], q[2];
  cx q[2], q[0];
  cx q[0], q[2];
}

def inv_qft(qubit[3] q) {
  h q[2];

  crz(-pi/2) q[0], q[1];
  h q[1];

  crz(-pi/4) q[0], q[2];
  crz(-pi/2) q[1], q[2];
  h q[0];
}

// N=15, a=7
qubit[3] q;
qubit[4] a;
reset q;
reset a;

x a[3];
h q;

modexp(q, a);
swap(q);
inv_qft(q);

measure a;
// measure q;
//
// 010 > 0.010 > 0.25 > 1/4; r=4.
// 110 > 0.110 > 0.75 > 3/4; r=4.
// gcd(pow(a, r/2)-1, N) = 3.
// gcd(pow(a, r/2)+1, N) = 5.
`,
  },
]
