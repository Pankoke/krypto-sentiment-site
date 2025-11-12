import React from 'react';

export const encodingTestString = 'Änderungen, Gebühren, Überblick, größer, Schlagzeilen, Zusammenfassung';

export default function EncodingTest() {
  return (
    <p className="mt-6 text-sm text-gray-500" aria-live="polite">
      {encodingTestString}
    </p>
  );
}
