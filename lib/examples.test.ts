import { describe, it, expect } from "vitest"
import { examples } from './examples';

describe('Quantum examples', () => {
    it('should be an array', () => {
        expect(Array.isArray(examples)).toBe(true);
    });

    it('all entries should conform to the Example interface', () => {
        examples.forEach((ex) => {
            expect(typeof ex.name).toBe('string');
            expect(typeof ex.code).toBe('string');
        });
    });

    it('should contain expected example names', () => {
        const names = examples.map((ex) => ex.name);
        expect(names).toEqual(expect.arrayContaining([
            'Bell State',
            'Quantum Teleportation',
            'Deutsch-Jozsa Algorithm',
            'Grover\'s Algorithm',
            'Grover\'s Algorithm (Sudoku 2x2)',
            'Shor\'s Algorithm (N=15, a=7)',
        ]));
    });

    it('all codes should start with "//"', () => {
        examples.forEach((ex) => {
            expect(ex.code.trim().startsWith('//')).toBe(true);
        });
    });

    it('should not have empty code', () => {
        examples.forEach((ex) => {
            expect(ex.code.trim().length).toBeGreaterThan(0);
        });
    });
});
