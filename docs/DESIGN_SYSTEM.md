# LockLens — Design System / UI Direction

## Design intent

Premium compact dark security workspace. NOT a generic gradient marketing site. High information density with calm whitespace. Main CTA is visually strong; secondary actions are quiet. Use real utility labels and avoid inflated headlines.

## Colors — see `src/styles/tokens.css`

- Primary canvas: `#090f18`
- Sidebar: `#0c131e`
- Surfaces: `#111b28`, elevated `#172332`
- Lines: `#223141`; subtle `#1a2735`
- Primary text: `#e9f2f6`; secondary: `#a1afbd`; muted: `#6e8397`
- Mint action/accent: `#7de8ca`; accent hover `#a3f4de`
- Guidance warning: `#e7b46b`; danger: `#e88c8a`

Avoid saturated neon everywhere. No large glass blur backgrounds, heavy animations, flashy gradients or stock illustrations. Use minimal SVG line icons. All visuals in preview are original CSS/SVG.

## Type

Font stack: Inter (if installed), system UI, Segoe UI fallback. No network font download. Approximate desktop sizes:

- Workspace title: 23–31px responsive; mobile 22–24px.
- Panel title: 15–17px; section heading: 18–19px.
- Body: 12–14px for compact panels; critical body copy must remain readable on mobile.
- Interactive controls: 11–14px; avoid making critical buttons/labels too tiny.
- Small meta/kickers: 9–11px only when noncritical. All-caps with restrained tracking.

## Layout

- Desktop: 252px sidebar, 70px top bar, max 1200px workspace.
- Main workspace: 1.48fr generator to 1fr insight column, 18px gap.
- At 980px: compact icon sidebar. Below 740px: menu drawer and single-column cards.
- Below 480px: tighter padding and stacked education cards.
- Generator: output, length, character toggles, exclusions, CTA.
- Right: compact estimated guess resistance with horizontal segments, separate password length and guidance, privacy explainer, tips. No circular score indicator.
- Analyzer: secret-entry field, local score, actionable explanations, three checks.

## UI behavior

- Default generator view with test output already generated.
- Password hidden by default; copying does not reveal it visually.
- Show/hide changes only the display, not the underlying value.
- Generated character combinations use proper randomness; visual strength is not a promise of guaranteed security.
- A toast confirms important actions; avoid toast on first page load.
- Normal length controls cover 8–40 characters, default 20. An Advanced Length toggle switches to 41–64 with synchronized number/stepper controls; returning to normal caps the selection at 40.
- Guess resistance and length guidance are independent. A neutral NIST single-factor length advisory appears below 15 characters without modifying the estimate.
- Guess resistance uses a local pattern estimator for both generated and entered text. Compact weakness and advice text accompany the horizontal meter. A separate provenance line identifies Web Crypto generation or unknown external origin; a generated-process bound is not a pattern score or safety guarantee.
- The existing estimate note explains that 4/4 is the highest estimator band and equal scores can differ in resistance. Associate that note with the meter for assistive technology. Estimator warnings lead the summary with “Warning:” and the existing amber warning color, preserving the numeric score, compact type and layout.
- A compact “Character composition” section in each view shows actual length, categories present and a two-column set of small presence indicators. These indicators use check/dash marks and accessible presence text, never another strength bar or a category fraction out of four. Missing categories have neutral styling. Explain briefly that diversity does not set the score; length and unpredictability matter. Only trusted generated results show the saved generator pool size. Mathematical generation details stay collapsed by default.
- Keep the NIST advisory brief. The full verifier requirement and generation probability derivation belong in the security documentation.
- For input beyond the local analysis limit, show “Not assessed” with an empty meter and no numeric score. Preserve the full input and its actual length so a truncated prefix cannot appear to describe the whole password.
- Mobile drawer overlays content with a backdrop, Escape dismissal and managed focus. Closed navigation is inert on mobile; tablet icons retain accessible names.
- Privacy disclosure is a compact section separate from footer branding and the developer credit.
- Respect `prefers-reduced-motion` and visible focus states.

## Avoid

- Giant typography, crowded bright colors, ornamental glows, unneeded landing page hero sections.
- Fake charts, fake security percentages, fabricated crack-time forecasts.
- Placeholder buttons that appear functional, meaningless navigation and unnecessary feature bloat.

## Visual verification

Use screenshots of the current implementation as the visual baseline before a refactor. Compare generator, analyzer, navigation and interactive states at desktop, tablet and mobile widths. Keep local captures in `.test-artifacts/`; do not reference preview images that are absent from the repository.
