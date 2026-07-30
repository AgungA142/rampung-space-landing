const WHATSAPP_PHONE_REGEX = /^\d{8,15}$/;

export function normalizeWhatsAppPhone(value: string): string {
  return value.replace(/\D/g, "");
}

export function isValidWhatsAppPhone(value: string): boolean {
  return WHATSAPP_PHONE_REGEX.test(normalizeWhatsAppPhone(value));
}
