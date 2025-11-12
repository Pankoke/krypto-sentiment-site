import React from 'react';
import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import EncodingTest, { encodingTestString } from '../src/components/EncodingTest';
import { GET as sentimentGet } from '../app/api/sentiment/route';

describe('encoding coverage', () => {
  it('renders the umlaut test string via the EncodingTest component', () => {
    const html = renderToString(<EncodingTest />);
    expect(html).toContain(encodingTestString);
  });

  it('sentiment API response uses charset=utf-8', async () => {
    const response = await sentimentGet(new Request('http://localhost'));
    const contentType = response.headers.get('content-type');
    expect(contentType).toContain('charset=utf-8');
  });
});
