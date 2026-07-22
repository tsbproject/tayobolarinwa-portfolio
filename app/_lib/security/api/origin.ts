import { SECURITY } from "../../constants/security";

export function validateOrigin(origin: string | null): boolean {
  if (!origin) {
    return false;
  }

  return (
    SECURITY.ALLOWED_ORIGINS as readonly string[]
  ).includes(origin);
}