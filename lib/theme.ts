/**
 * Sukra Polyclinic — Design Tokens
 *
 * Primary:   #006d77  (deep teal)
 * Secondary: #ef8e1f  (warm amber/orange)
 *
 * Derived palette keeps the brand cohesive across every screen.
 */

export const COLORS = {
  /* ── PRIMARY family ── */
  primary: '#006d77', // buttons, headers, active states
  primaryDark: '#004e56', // pressed / dark accent
  primaryLight: '#e0f4f4', // tinted backgrounds
  primaryMuted: '#b2dfdb', // icon circles, subtle fills
  primaryBg: '#f0fafa', // page background

  /* ── SECONDARY family ── */
  secondary: '#ef8e1f', // CTA buttons, highlights
  secondaryDark: '#c67510', // pressed state
  secondaryLight: '#fef3e2', // badges, tinted bg
  secondaryMuted: '#fcd9a8', // soft accents

  /* ── NEUTRALS ── */
  white: '#FFFFFF',
  bg: '#F8FAFA',
  card: '#FFFFFF',
  grey50: '#F9FAFB',
  grey100: '#F3F4F6',
  grey200: '#E5E7EB',
  grey300: '#D1D5DB',
  grey400: '#9CA3AF',
  grey500: '#6B7280',
  grey700: '#374151',
  grey800: '#1F2937',
  grey900: '#111827',
  dark: '#0F172A',

  /* ── SEMANTIC ── */
  success: '#16A34A',
  successLight: '#DCFCE7',
  error: '#DC2626',
  errorLight: '#FEE2E2',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',

  /* ── LEGACY ALIASES (for quick migration) ── */
  teal: '#006d77',
  gold: '#ef8e1f',
  muted: '#E5E7EB',
};
