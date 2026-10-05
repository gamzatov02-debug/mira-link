export type MiraMode = "brand-dark" | "operational-light"

/** Isolated implementation bridge for approved Stage 3 tokens. */
export const miraTokens = {
  control: { s: "32px", m: "40px", l: "48px", hitAreaMin: "44px" },
  backdrop: { "brand-dark": "rgba(3,27,19,0.72)", "operational-light": "rgba(17,27,22,0.44)" },
  motion: { fast: "120ms", normal: "180ms", overlay: "320ms", standard: "cubic-bezier(.2,0,0,1)" },
  elevation: { card: "0 8px 24px rgba(0,0,0,.18)", modal: "0 24px 64px rgba(0,0,0,.32)" },
  z: { overlay: 60, sheetModal: 70, toast: 80 },
} as const
