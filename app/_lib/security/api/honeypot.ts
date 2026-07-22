import { SECURITY } from "../../constants/security";

export function hasTriggeredHoneypot(
  value?: string | null
) {
  return Boolean(value?.trim());
}

export const HONEYPOT_FIELD =
  SECURITY.HONEYPOT_FIELD;