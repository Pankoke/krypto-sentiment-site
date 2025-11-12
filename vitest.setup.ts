import { expect } from 'vitest';

declare global {
  var expect: typeof import('vitest')['expect'];
}

(globalThis as typeof globalThis & { expect: typeof import('vitest')['expect'] }).expect = expect;

void import('@testing-library/jest-dom');
