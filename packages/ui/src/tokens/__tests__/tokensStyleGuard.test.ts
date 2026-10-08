import { describe, it, expect } from 'vitest';
import { tokens, generateCSSVariables } from '../../tokens.js';

describe('Design Tokens Style Guard & Color Palette Rules', () => {
  it('contains NO forbidden colors (purple, violet, indigo) anywhere in token definitions', () => {
    const rawTokensJson = JSON.stringify(tokens).toLowerCase();

    // Check color tokens
    expect(rawTokensJson).not.toContain('purple');
    expect(rawTokensJson).not.toContain('violet');
    expect(rawTokensJson).not.toContain('indigo');
    expect(rawTokensJson).not.toContain('#7c3aed'); // common violet-600
    expect(rawTokensJson).not.toContain('#8b5cf6'); // common purple-500
    expect(rawTokensJson).not.toContain('#6366f1'); // common indigo-500
  });

  it('contains NO gradient backgrounds in the design tokens file', () => {
    const rawTokensJson = JSON.stringify(tokens).toLowerCase();
    expect(rawTokensJson).not.toContain('linear-gradient');
    expect(rawTokensJson).not.toContain('radial-gradient');
  });

  it('generates prefers-reduced-motion media query with 0ms transition overrides', () => {
    const css = generateCSSVariables();
    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
    expect(css).toContain('--gg-transition-fast: 0ms');
    expect(css).toContain('--gg-transition-normal: 0ms');
  });
});
