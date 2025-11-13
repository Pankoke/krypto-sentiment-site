import { expect } from 'vitest';

declare global {
  interface Window {
    expect: typeof expect;
  }
  var expect: typeof expect;
}

(globalThis as typeof globalThis & { expect: typeof expect }).expect = expect;

void import('@testing-library/jest-dom');
