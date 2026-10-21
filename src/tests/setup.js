import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Aislamos cada prueba: DOM limpio y localStorage vacío
afterEach(() => {
  cleanup();
  localStorage.clear();
});
