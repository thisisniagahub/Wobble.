import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/lib/site-config";

export const runtime = "nodejs";

const COOKIE_NAME = "wobble_telegram_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

type TelegramUser = {
  id: number;
  auth_date: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
};

function getBotToken() {
  return (
    process.env.WOBBLE_TELEGRAM_BOT_TOKEN ||
    process.env.TELEGRAM_BOT_TOKEN ||
    ""
  ).trim();
}

function getSessionSecret() {
  return (
    process.env.WOBBLE_TELEGRAM_SESSION_SECRET ||
    process.env.TELEGRAM_AUTH_SESSION_SECRET ||
    getBotToken()
  ).trim();
}

function getCookieOptions(request: NextRequest) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: request.nextUrl.protocol === "https:",
    path: "/",
  };
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);

  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
}

function encodeSession(user: TelegramUser) {
  const secret = getSessionSecret();

  if (!secret) {
    return "";
  }

  const payload = Buffer.from(JSON.stringify(user)).toString("base64url");
  const signature = createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");

  return `${payload}.${signature}`;
}

function decodeSession(value: string | undefined) {
  if (!value) {
    return null;
  }

  const [payload, signature] = value.split(".");
  const secret = getSessionSecret();

  if (!payload || !signature || !secret) {
    return null;
  }

  const expectedSignature = createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");

  if (!safeEqual(signature, expectedSignature)) {
    return null;
  }

  try {
    return JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as TelegramUser;
  } catch {
    return null;
  }
}

function buildTelegramCheckString(searchParams: URLSearchParams) {
  return [...searchParams.entries()]
    .filter(([key, value]) => key !== "hash" && value)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");
}

function verifyTelegramAuth(searchParams: URLSearchParams) {
  const botToken = getBotToken();

  if (!botToken) {
    return { ok: false as const, reason: "missing_bot_token" };
  }

  const hash = searchParams.get("hash");

  if (!hash) {
    return { ok: false as const, reason: "missing_hash" };
  }

  const secret = createHash("sha256").update(botToken).digest();
  const expectedHash = createHmac("sha256", secret)
    .update(buildTelegramCheckString(searchParams))
    .digest("hex");

  if (!safeEqual(hash, expectedHash)) {
    return { ok: false as const, reason: "invalid_hash" };
  }

  const authDate = Number(searchParams.get("auth_date") || "0");

  if (!Number.isFinite(authDate) || authDate <= 0) {
    return { ok: false as const, reason: "invalid_auth_date" };
  }

  const user: TelegramUser = {
    id: Number(searchParams.get("id") || "0"),
    auth_date: authDate,
    first_name: searchParams.get("first_name") || undefined,
    last_name: searchParams.get("last_name") || undefined,
    username: searchParams.get("username") || undefined,
    photo_url: searchParams.get("photo_url") || undefined,
  };

  if (!user.id) {
    return { ok: false as const, reason: "missing_user_id" };
  }

  return { ok: true as const, user };
}

function buildRedirectUrl(reason: string) {
  const redirectUrl = new URL(siteConfig.siteUrl);
  redirectUrl.searchParams.set("screen", "telegram");
  redirectUrl.searchParams.set("telegram", reason);
  return redirectUrl;
}

export async function GET(request: NextRequest) {
  const action = request.nextUrl.searchParams.get("action");

  if (action === "session") {
    const user = decodeSession(request.cookies.get(COOKIE_NAME)?.value);

    return NextResponse.json({
      authenticated: Boolean(user),
      configured: Boolean(getBotToken() && siteConfig.telegramBotUsername),
      botUsername: siteConfig.telegramBotUsername,
      user,
    });
  }

  if (action === "logout") {
    const response = NextResponse.json({ authenticated: false, ok: true });

    response.cookies.set({
      ...getCookieOptions(request),
      name: COOKIE_NAME,
      value: "",
      expires: new Date(0),
    });

    return response;
  }

  const verification = verifyTelegramAuth(request.nextUrl.searchParams);

  if (!verification.ok) {
    return NextResponse.redirect(buildRedirectUrl(verification.reason));
  }

  const sessionValue = encodeSession(verification.user);

  if (!sessionValue) {
    return NextResponse.redirect(buildRedirectUrl("missing_session_secret"));
  }

  const response = NextResponse.redirect(buildRedirectUrl("success"));

  response.cookies.set({
    ...getCookieOptions(request),
    name: COOKIE_NAME,
    value: sessionValue,
    maxAge: COOKIE_MAX_AGE,
  });

  return response;
}
