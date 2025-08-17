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

// 0.877|0>|0>|0>+(-0.199 + 0.435i)|1>|0>|0>
U(1, 2, 3) phi;

h a;
cx a, t;
cx phi, a;
h phi;

cx a, t;
cz phi, t;

measure phi;
measure a;
`,
  },
  {
    name: "Quantum Fourier Transform",
    code: `// Quantum Fourier Transform

OPENQASM 3.0;

gate x q { U(pi, 0, pi) q; }
gate h q { U(pi/2.0, 0, pi) q; }
gate cx c, t { ctrl @ U(pi, 0, pi) c, t; }
gate crz(theta) c, t { ctrl @ U(0, 0, theta) c, t; }

def qft(qubit[3] q) {
    h q[0];
    crz(pi/2) q[0], q[1];
    crz(pi/4) q[0], q[2];

    h q[1];
    crz(pi/2) q[1], q[2];

    h q[2];
}

def swap(qubit[3] q) {
    cx q[0], q[2];
    cx q[2], q[0];
    cx q[0], q[2];
}

qubit[3] q;
reset q;

x q[2];
qft(q);
swap(q);
`,
  },
  {
    name: "Grover's algorithm",
    code: `// Grover's algorithm

OPENQASM 3.0;

gate x q { U(pi, 0, pi) q; }
gate h q { U(pi/2.0, 0, pi) q; }
gate cccx c0, c1, c2, t { ctrl(3) @ U(pi, 0, pi) c0, c1, c2, t; }

// oracle for |110>|x>
def oracle(qubit[4] q) {
    x q[2], q[3];
    h q[3];
    cccx q[0], q[1], q[2], q[3];
    h q[3];
    x q[2], q[3];
}

def diffuser(qubit[4] q) {
    h q;
    x q;
    h q[3];
    cccx q[0], q[1], q[2], q[3];
    h q[3];
    x q;
    h q;
}

const int n = 4;
qubit[n] q;
reset q;
h q;

int N = 2**n;
int R = int(pi/4 * sqrt(float(N)));
for int i in [0:R] {
    oracle(q);
    diffuser(q);
}

measure q[3];
`,
  },
  {
    name: "Sudoku 2x2",
    code: `// Sudoku 2x2

OPENQASM 3.0;

gate x q { U(pi, 0, pi) q; }
gate h q { U(pi/2.0, 0, pi) q; }

gate cx q0, q1 { ctrl @ U(pi, 0, pi) q0, q1; }
gate cccz c0, c1, c2, t { ctrl(3) @ U(0, pi, 0) c0, c1, c2, t; }
gate ccccz c0, c1, c2, c3, t { ctrl(4) @ U(0, pi, 0) c0, c1, c2, c3, t; }
gate xor q0, q1, q2 { cx q0, q2; cx q1, q2; }

// The oracle constructs a Grover oracle that validates solutions to a 2x2 sudoku puzzle.
// It enforces the following uniqueness constraints: a != b, c != d, a != c, b != d.
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
]
