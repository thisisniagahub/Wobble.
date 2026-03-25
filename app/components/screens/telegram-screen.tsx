"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  LogOut,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { siteConfig } from "@/lib/site-config";

type TelegramUser = {
  first_name?: string;
  id: number;
  last_name?: string;
  photo_url?: string;
  username?: string;
};

type SessionState = {
  authenticated: boolean;
  botUsername: string;
  configured: boolean;
  error?: string;
  loading: boolean;
  user: TelegramUser | null;
};

interface TelegramScreenProps {
  onNavigate: (screen: string) => void;
  whatsappOrderHref: string;
}

const flashMessages: Record<string, string> = {
  success: "Telegram login berjaya. Sesi anda dah aktif untuk sambung order.",
  invalid_hash: "Telegram verification gagal. Cuba login semula sekali lagi.",
  invalid_auth_date: "Telegram callback tak lengkap. Cuba semula dari widget login.",
  missing_hash: "Telegram callback tak bawa signature yang sah.",
  missing_user_id: "Telegram callback tak ada user id yang boleh disahkan.",
  missing_bot_token: "Bot token belum diset pada environment production.",
  missing_session_secret: "Session secret belum diset untuk simpan login Telegram.",
};

export function TelegramScreen({
  onNavigate,
  whatsappOrderHref,
}: TelegramScreenProps) {
  const searchParams = useSearchParams();
  const widgetRef = useRef<HTMLDivElement | null>(null);
  const [session, setSession] = useState<SessionState>({
    authenticated: false,
    botUsername: siteConfig.telegramBotUsername,
    configured: false,
    loading: true,
    user: null,
  });

  async function refreshSession() {
    try {
      const response = await fetch("/api/auth/telegram?action=session", {
        cache: "no-store",
      });
      const payload = (await response.json()) as Omit<SessionState, "loading">;

      setSession({
        ...payload,
        loading: false,
      });
    } catch {
      setSession((current) => ({
        ...current,
        error: "Tak dapat semak sesi Telegram sekarang.",
        loading: false,
      }));
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refreshSession();
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const widgetHost = widgetRef.current;

    if (!widgetHost) {
      return;
    }

    widgetHost.innerHTML = "";

    if (session.authenticated || !siteConfig.telegramBotUsername) {
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", siteConfig.telegramBotUsername);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-radius", "999");
    script.setAttribute("data-request-access", "write");
    script.setAttribute(
      "data-auth-url",
      new URL(siteConfig.telegramAuthPath, window.location.origin).toString(),
    );

    widgetHost.appendChild(script);
  }, [session.authenticated]);

  async function handleLogout() {
    await fetch("/api/auth/telegram?action=logout", {
      cache: "no-store",
    });
    await refreshSession();
  }

  const flashMessage =
    flashMessages[searchParams.get("telegram") || ""] || undefined;
  const displayName =
    session.user?.first_name ||
    session.user?.username ||
    "Wobble guest";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full overflow-y-auto custom-scrollbar px-6 py-24 md:px-10 md:py-28"
      role="region"
      aria-label="Telegram login"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="rounded-[2.5rem] border border-white/10 bg-black/30 p-8 text-white shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-3xl md:p-12"
        >
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-[#FF6B9D]/30 bg-[#FF6B9D]/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-[#FFB6CF]">
            <Sparkles className="h-3.5 w-3.5" />
            telegram login
          </div>

          <h2 className="max-w-2xl text-5xl font-black uppercase tracking-tighter text-white md:text-7xl">
            Stay in the loop after the first wobble.
          </h2>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60 md:text-xl">
            Login with Telegram to continue ordering with a verified identity,
            keep the handoff cleaner, and make future follow-ups faster.
          </p>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "Verified identity",
                body: "Telegram signs the login payload and the server verifies the hash before saving any session.",
              },
              {
                icon: MessageCircle,
                title: "Faster follow-up",
                body: "Useful when you want to move from landing page discovery into a real conversation flow.",
              },
              {
                icon: UserRoundCheck,
                title: "Cleaner reorders",
                body: "You can come back with the same Telegram identity instead of starting cold every time.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6"
              >
                <item.icon className="h-6 w-6 text-[#FF6B9D]" />
                <h3 className="mt-5 text-sm font-black uppercase tracking-[0.2em] text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55">
                  {item.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-4 md:flex-row">
            <motion.a
              href={whatsappOrderHref}
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-3 rounded-full bg-white px-8 py-4 text-[10px] font-black uppercase tracking-[0.22em] text-black shadow-xl"
            >
              order on whatsapp
            </motion.a>
            <motion.button
              type="button"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate("gift")}
              className="inline-flex items-center justify-center gap-3 rounded-full border border-white/15 bg-white/5 px-8 py-4 text-[10px] font-black uppercase tracking-[0.22em] text-white"
            >
              view gift boxes
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-[2.5rem] border border-white/10 bg-white/[0.05] p-8 text-white shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-3xl md:p-10"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                session status
              </p>
              <h3 className="mt-3 text-3xl font-black uppercase tracking-tighter">
                {session.authenticated ? "Connected" : "Login Ready"}
              </h3>
            </div>

            {session.authenticated && (
              <button
                type="button"
                onClick={() => void handleLogout()}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/80"
              >
                <LogOut className="h-3.5 w-3.5" />
                logout
              </button>
            )}
          </div>

          {flashMessage && (
            <div className="mt-6 rounded-[1.5rem] border border-[#FF6B9D]/25 bg-[#FF6B9D]/10 px-5 py-4 text-sm leading-relaxed text-[#FFD3E3]">
              {flashMessage}
            </div>
          )}

          {session.error && (
            <div className="mt-6 rounded-[1.5rem] border border-amber-400/25 bg-amber-400/10 px-5 py-4 text-sm leading-relaxed text-amber-100">
              {session.error}
            </div>
          )}

          <div className="mt-8 rounded-[2rem] border border-white/10 bg-black/25 p-6">
            {session.loading ? (
              <p className="text-sm uppercase tracking-[0.2em] text-white/50">
                checking telegram session...
              </p>
            ) : session.authenticated ? (
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.2em] text-white/40">
                  active session
                </p>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-2xl font-black tracking-tighter text-white">
                    {displayName}
                  </p>
                  <p className="mt-2 text-sm text-white/50">
                    {session.user?.username
                      ? `@${session.user.username}`
                      : `telegram id ${session.user?.id}`}
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-white/55">
                  Session ini dah tersedia untuk flow seterusnya. Kalau nak
                  terus order, guna WhatsApp CTA atau sambung ke gift box.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                <p className="text-sm leading-relaxed text-white/55">
                  Login widget akan muncul di bawah bila
                  `NEXT_PUBLIC_WOBBLE_TELEGRAM_BOT_USERNAME` dan
                  `WOBBLE_TELEGRAM_BOT_TOKEN` diset pada environment deploy.
                </p>

                {siteConfig.telegramBotUsername ? (
                  <div
                    ref={widgetRef}
                    className="flex min-h-14 items-center justify-start"
                  />
                ) : (
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-5 py-4 text-sm leading-relaxed text-white/45">
                    Bot username belum diisi. Set nilai env untuk aktifkan widget
                    Telegram sebenar pada production.
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
