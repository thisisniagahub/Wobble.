const DEFAULT_SITE_URL = "https://wobble.gangniaga.my";
const DEFAULT_TELEGRAM_AUTH_PATH = "/api/auth/telegram";

function stripTrailingSlash(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  if (digits.startsWith("00")) {
    return digits.slice(2);
  }

  if (digits.startsWith("0")) {
    return `6${digits}`;
  }

  return digits;
}

export const siteConfig = {
  name: "Wobble",
  description:
    "Premium panna cotta jars for gifting, celebrations, and direct WhatsApp orders across Malaysia.",
  siteUrl: stripTrailingSlash(
    process.env.NEXT_PUBLIC_WOBBLE_SITE_URL || DEFAULT_SITE_URL,
  ),
  whatsappNumber: normalizePhone(
    process.env.NEXT_PUBLIC_WOBBLE_WHATSAPP_NUMBER || "",
  ),
  telegramBotUsername: (
    process.env.NEXT_PUBLIC_WOBBLE_TELEGRAM_BOT_USERNAME || ""
  ).trim(),
  telegramAuthPath: DEFAULT_TELEGRAM_AUTH_PATH,
};

export function buildAbsoluteUrl(path = "/") {
  return new URL(path, `${siteConfig.siteUrl}/`).toString();
}

export function buildWhatsAppHref(message: string) {
  const encodedMessage = encodeURIComponent(message);

  if (!siteConfig.whatsappNumber) {
    return `https://wa.me/?text=${encodedMessage}`;
  }

  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodedMessage}`;
}
