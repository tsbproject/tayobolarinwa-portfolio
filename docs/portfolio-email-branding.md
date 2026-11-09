# Portfolio Email Branding — Audit and Implementation (2026-11-08)

## Findings
- Existing email templates were in `app/_emails/ConsultationEmail.tsx` (admin notification) and `app/_emails/ConsultationConfirmationEmail.tsx` (client confirmation).
- They independently created their own `Html/Head/Body/Container` wrappers and used a few inline styles; **there was no central shared branded email template** in `app/_emails`.
- `app/_lib/services/consultation.service.tsx` sends both through `EmailService` / Resend. Existing API and recipients are unchanged.
- Web UI branding uses a light surface, slate/navy, blue `#2563eb`, Inter, and existing `/images/logo/tsb-logo.png`. Web CSS/Tailwind styling does NOT automatically apply to delivered HTML email.
- A visual regression had been reported after React Email dependency updates. The earlier templates themselves lacked a distinctive brand header, and the real cause of the regression has **not** been conclusively determined.

## Implementation on feature branch
- `app/_emails/PortfolioEmailLayout.tsx`: central email-safe, inline-styled frame with existing logo at the public absolute URL, navy banner, blue accent, white content, slate footer, links, preview text, and reusable title.
- Both original email templates now consume this common layout while preserving their existing data fields, sender/recipients, email subjects and consultation service logic.
- No CSS classes, Tailwind pipeline or web font loads are required by the email design.
- No changes to Sostain survey API, public release flags or research DB.

## Required local verification before shipping
1. Pull the feature branch only after preserving local `package.json` and `package-lock.json` changes; `git pull --ff-only` should fast-forward without conflicts because email source paths differ.
2. Confirm JSON is valid, then run `npx --no-install tsc --noEmit`, `npm run lint`, `npm run build`. Stop `npm run dev` before production build.
3. Confirm the logo URL `https://tayobolarinwa.dev/images/logo/tsb-logo.png` is publicly accessible from an email client. If blocked by external image settings the alt text should still communicate brand.
4. With a personally owned test email, submit one consultation and inspect **both** the admin notification and client confirmation in desktop and mobile Gmail/Outlook if available. Validate readable contrasts, logo sizing, header, footer and complete data.
5. Confirm the local `@react-email/components` dependency tree matches the intended, separately tested configuration. Avoid forcing unverified nested render overrides.
6. Review any outstanding vulnerabilities and the React Email compatibility before release. Neither HTML rendering tests nor final production build have been verified by the assistant.
7. Do not merge into master or deploy until confirmed. Survey still closed and research DB still draft.
