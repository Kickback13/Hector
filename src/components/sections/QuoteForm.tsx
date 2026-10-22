"use client";

/**
 * Quote builder — same Formspree endpoint and field names as the original site
 * (Name, Phone, Address, Service, Details), so Hector's inbox keeps working.
 * Multi-select service chips + property-size chips feed into the Service/Details fields.
 */
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Loader2, Send } from "lucide-react";
import { cn, FORMSPREE, PHONE_DISPLAY, PHONE_TEL } from "@/lib/utils";

const SERVICES = ["Pressure Washing", "House & Siding Wash", "Decks & Fences", "Commercial & Storefronts", "Trash Bin Cleaning", "Other / Not Sure"];
const SIZES = ["Small (one area)", "Medium (a few areas)", "Large / whole property", "Not sure"];

export default function QuoteForm() {
  const [picked, setPicked] = useState<string[]>(["Pressure Washing"]);
  const [size, setSize] = useState(SIZES[0]);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const toggle = (s: string) => setPicked((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if ((fd.get("_gotcha") as string)?.length) return;
    fd.set("Service", picked.length ? picked.join(", ") : "Other / Not Sure");
    fd.set("Details", `Size: ${size}\n${fd.get("Details") ?? ""}`);
    setState("sending");
    try {
      const r = await fetch(FORMSPREE, { method: "POST", body: fd, headers: { Accept: "application/json" } });
      setState(r.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  };

  const input =
    "w-full rounded-2xl border border-sky/20 bg-abyss/60 px-4 py-3.5 text-white placeholder:text-white/35 outline-none transition focus:border-sky focus:shadow-[0_0_0_4px_rgba(34,166,217,0.18)]";

  return (
    <div className="relative rounded-[28px] bg-deep p-6 md:p-10">
      <AnimatePresence mode="wait">
        {state === "sent" ? (
          <motion.div key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex min-h-[28rem] flex-col items-center justify-center text-center">
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 14 }}
              className="grid h-20 w-20 place-items-center rounded-full bg-sky text-abyss shadow-[0_0_60px_rgba(34,166,217,0.8)]"
            >
              <Check className="h-10 w-10" strokeWidth={3} />
            </motion.div>
            <h3 className="mt-6 text-3xl font-semibold">Request received.</h3>
            <p className="mt-2 max-w-sm text-white/75">We&apos;ll text you back with a quote — usually the same day.</p>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={submit} className="grid gap-5" exit={{ opacity: 0, y: -10 }}>
            <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />
            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-white/80">
                Name
                <input name="Name" required autoComplete="name" className={input} placeholder="Your name" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-white/80">
                Phone
                <input name="Phone" type="tel" required autoComplete="tel" className={input} placeholder="We text quotes here" />
              </label>
            </div>
            <label className="grid gap-2 text-sm font-medium text-white/80">
              Address / Area
              <input name="Address" required autoComplete="street-address" className={input} placeholder="e.g. La Jolla" />
            </label>

            <fieldset>
              <legend className="mb-2 text-sm font-medium text-white/80">What needs cleaning?</legend>
              <div className="flex flex-wrap gap-2">
                {SERVICES.map((s) => {
                  const on = picked.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggle(s)}
                      className={cn(
                        "flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all",
                        on ? "border-sky bg-sky text-abyss shadow-[0_0_24px_rgba(34,166,217,0.5)]" : "border-sky/25 text-white/75 hover:border-sky/60 hover:text-white",
                      )}
                    >
                      {on && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                      {s}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-2 text-sm font-medium text-white/80">How big is the job?</legend>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={size === s}
                    onClick={() => setSize(s)}
                    className={cn(
                      "relative rounded-2xl border px-3 py-3 text-left text-sm transition-all",
                      size === s ? "border-sky bg-sky/15 text-white" : "border-sky/20 text-white/70 hover:border-sky/50",
                    )}
                  >
                    {size === s && <motion.span layoutId="size-dot" className="absolute right-3 top-3 h-2 w-2 rounded-full bg-sky shadow-[0_0_10px_#22a6d9]" />}
                    {s}
                  </button>
                ))}
              </div>
            </fieldset>

            <label className="grid gap-2 text-sm font-medium text-white/80">
              Tell us about the job
              <textarea
                name="Details"
                rows={4}
                className={input}
                placeholder="Size of the area, what needs cleaning, anything else we should know"
              />
            </label>

            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <button
                type="submit"
                data-magnetic
                disabled={state === "sending"}
                className="group relative inline-flex h-14 items-center gap-2 overflow-hidden rounded-full bg-sky px-8 text-base font-semibold text-abyss shadow-[0_0_40px_rgba(34,166,217,0.55)] transition hover:shadow-[0_0_60px_rgba(34,166,217,0.85)] disabled:opacity-70"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                {state === "sending" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                Send quote request
              </button>
              <p className="text-sm text-white/60">
                Prefer to talk?{" "}
                <a href={`tel:${PHONE_TEL}`} className="font-semibold text-sky underline-offset-4 hover:underline">
                  Call {PHONE_DISPLAY}
                </a>
              </p>
            </div>
            {state === "error" && (
              <p role="alert" className="text-sm text-red-300">
                Something went wrong sending that. Please call or text {PHONE_DISPLAY}.
              </p>
            )}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
