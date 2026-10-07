/**
 * GatherGrid Design Tokens
 *
 * These CSS custom properties define the visual language of the platform.
 * Import this file in your app's root CSS to apply the theme.
 *
 * Usage: var(--gg-color-primary), var(--gg-radius-md), etc.
 */
export const tokens = {
  colors: {
    background: '#FAF8F5',
    surface: '#FFFFFF',
    ink: '#1F2430',
    muted: '#6B7280',
    primary: '#FF6B4A',
    secondary: '#14B8A6',
    highlight: '#FFC93C',
    success: '#22C55E',
    danger: '#EF4444',
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
  },
  fonts: {
    display: "'Outfit', 'Nunito', sans-serif",
    body: "'Inter', sans-serif",
  },
  radii: {
    sm: '6px',
    md: '10px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.07)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  },
  transitions: {
    fast: '150ms ease',
    normal: '200ms ease',
  },
} as const;

/**
 * Generate CSS custom properties string from tokens.
 * Useful for injecting into a <style> tag or CSS file.
 */
export function generateCSSVariables(): string {
  return `
:root {
  /* Colors */
  --gg-color-background: ${tokens.colors.background};
  --gg-color-surface: ${tokens.colors.surface};
  --gg-color-ink: ${tokens.colors.ink};
  --gg-color-muted: ${tokens.colors.muted};
  --gg-color-primary: ${tokens.colors.primary};
  --gg-color-secondary: ${tokens.colors.secondary};
  --gg-color-highlight: ${tokens.colors.highlight};
  --gg-color-success: ${tokens.colors.success};
  --gg-color-danger: ${tokens.colors.danger};
  --gg-color-border: ${tokens.colors.border};
  --gg-color-border-light: ${tokens.colors.borderLight};

  /* Fonts */
  --gg-font-display: ${tokens.fonts.display};
  --gg-font-body: ${tokens.fonts.body};

  /* Radii */
  --gg-radius-sm: ${tokens.radii.sm};
  --gg-radius-md: ${tokens.radii.md};
  --gg-radius-lg: ${tokens.radii.lg};
  --gg-radius-xl: ${tokens.radii.xl};
  --gg-radius-full: ${tokens.radii.full};

  /* Spacing */
  --gg-space-xs: ${tokens.spacing.xs};
  --gg-space-sm: ${tokens.spacing.sm};
  --gg-space-md: ${tokens.spacing.md};
  --gg-space-lg: ${tokens.spacing.lg};
  --gg-space-xl: ${tokens.spacing.xl};
  --gg-space-2xl: ${tokens.spacing['2xl']};
  --gg-space-3xl: ${tokens.spacing['3xl']};

  /* Shadows */
  --gg-shadow-sm: ${tokens.shadows.sm};
  --gg-shadow-md: ${tokens.shadows.md};
  --gg-shadow-lg: ${tokens.shadows.lg};

  /* Transitions */
  --gg-transition-fast: ${tokens.transitions.fast};
  --gg-transition-normal: ${tokens.transitions.normal};
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --gg-transition-fast: 0ms;
    --gg-transition-normal: 0ms;
  }
}
`.trim();
}
