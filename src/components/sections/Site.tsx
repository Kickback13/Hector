"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import {
  Droplets,
  Home,
  Fence,
  Store,
  Trash2,
  ShieldCheck,
  BadgeDollarSign,
  Gauge,
  MapPin,
  MessageSquareText,
  ClipboardCheck,
  CalendarCheck,
  Sparkles,
  Eye,
  Phone,
  ChevronDown,
  Star,
} from "lucide-react";
import { BlurReveal, ScrollWordReveal, ShimmerText, SplitHeading, TextRotate } from "@/components/fx/TextFx";
import BeforeAfter, { type Job } from "@/components/fx/BeforeAfter";
import { GlowCard } from "@/components/fx/GlowCard";
import { CircularGallery, ContainerScroll, GooeyMarquee, NumberTicker, ShineBorder, TestimonialsColumn, type Review } from "@/components/fx/Motion";
import { InteractiveButton, LiquidMetalButton, MobileDock, TubelightNav } from "@/components/fx/Chrome";
import OrbitalProcess, { type Step } from "@/components/fx/Orbit";
import { BackgroundPaths, Faq, GiantFooterName } from "@/components/fx/Extras";
import QuoteForm from "@/components/sections/QuoteForm";
import { LogoLockup } from "@/components/brand/Logo";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/utils";

const SprayCursor = dynamic(() => import("@/components/fx/SprayCursor"), { ssr: false });
const AuroraShader = dynamic(() => import("@/components/fx/AuroraShader"), { ssr: false });
const WashReveal = dynamic(() => import("@/components/fx/WashReveal"), { ssr: false });
const WaterRipple = dynamic(() => import("@/components/fx/WaterRipple"), { ssr: false });
const DottedSurface = dynamic(() => import("@/components/fx/Particles").then((m) => m.DottedSurface), { ssr: false });
const VaporText = dynamic(() => import("@/components/fx/Particles").then((m) => m.VaporText), { ssr: false });

/* ---------- content ---------- */

const SERVICES = [
  {
    icon: Droplets,
    title: "Pressure Washing",
    body: "Driveways, sidewalks, patios and pool decks — years of grime gone in an afternoon.",
    img: "/img/driveway-after.jpg",
    tags: ["Driveways", "Patios", "Pool decks", "Walkways"],
  },
  {
    icon: Home,
    title: "House & Siding Wash",
    body: "Gentle soft-wash for vinyl, brick and stucco that lifts mold and mildew without damage.",
    img: "/img/siding-after.jpg",
    tags: ["Stucco", "Vinyl", "Brick", "Trim"],
  },
  {
    icon: Fence,
    title: "Decks & Fences",
    body: "Restore wood and composite surfaces so they look new — ready for staining or sealing.",
    img: "/img/deck-after.jpg",
    tags: ["Wood", "Composite", "Railings"],
  },
  {
    icon: Store,
    title: "Commercial & Storefronts",
    body: "Entryways, dumpster pads and building exteriors that make the right first impression.",
    img: "/img/storefront-after.jpg",
    tags: ["Entryways", "Dumpster pads", "Exteriors"],
  },
  {
    icon: Trash2,
    title: "Trash Bin Cleaning",
    body: "Pressure wash and foam spray deep-clean for your trash and recycling bins — no more smell, no more grime.",
    img: "/img/bins-after.jpg",
    tags: ["Trash", "Recycling", "Green waste"],
  },
];

const JOBS: Job[] = [
  { key: "drive", label: "Driveway", before: "/img/driveway-before.jpg", after: "/img/driveway-after.jpg", note: "Oil stains, tire marks and black mildew lifted out of the concrete joints." },
  { key: "siding", label: "Stucco soft wash", before: "/img/siding-before.jpg", after: "/img/siding-after.jpg", note: "Low-pressure soft wash — algae and runoff stains gone, no damage to the stucco." },
  { key: "deck", label: "Wood deck", before: "/img/deck-before.jpg", after: "/img/deck-after.jpg", note: "Moss and grey weathering stripped back to clean wood, ready for sealing." },
  { key: "bins", label: "Trash bins", before: "/img/bins-before.jpg", after: "/img/bins-after.jpg", note: "Pressure wash + foam spray. No more smell, no more grime." },
  { key: "store", label: "Storefront", before: "/img/storefront-before.jpg", after: "/img/storefront-after.jpg", note: "Gum, coffee and grime cleared from the entry — first impressions fixed." },
];

const WHY = [
  { icon: MapPin, title: "Locally owned & operated", body: "We live here too — our name is on every job we do." },
  { icon: BadgeDollarSign, title: "Upfront, honest pricing", body: "Free quotes with no surprises. The price we say is the price you pay." },
  { icon: Gauge, title: "The right equipment for every surface", body: "High pressure where it helps, soft wash where it matters." },
  { icon: ShieldCheck, title: "Satisfaction guaranteed", body: "If a spot isn't right, we come back and make it right." },
];

const STEPS: Step[] = [
  { id: 1, title: "Request", when: "2 min", body: "Send the quick form or call/text. Tell us the area and what needs cleaning.", icon: MessageSquareText, related: [2] },
  { id: 2, title: "Quote", when: "Same day", body: "We text you back with an upfront price — usually the same day. No surprises.", icon: ClipboardCheck, related: [1, 3] },
  { id: 3, title: "Schedule", when: "Your pick", body: "Pick a time that works. You don't need to be home for most exterior jobs.", icon: CalendarCheck, related: [2, 4] },
  { id: 4, title: "Wash", when: "Job day", body: "High pressure where it helps, soft wash where it matters — the right method for every surface.", icon: Droplets, related: [3, 5] },
  { id: 5, title: "Walkthrough", when: "After", body: "We check every spot. If something isn't right, we come back and make it right.", icon: Eye, related: [4] },
];

// Placeholder reviews — swap for real Google reviews once they're live.
const REVIEWS: Review[] = [
  { text: "Driveway looked brand new. Oil stains I'd given up on are just gone.", name: "Sample review", area: "La Jolla", service: "Pressure washing" },
  { text: "Quote came back by text the same afternoon and the price was exactly what they said.", name: "Sample review", area: "UTC", service: "Driveway" },
  { text: "They soft-washed our stucco and the green streaks under the windows disappeared.", name: "Sample review", area: "Clairemont", service: "House wash" },
  { text: "Our deck went from grey and slippery to looking like new wood again.", name: "Sample review", area: "Del Mar", service: "Deck" },
  { text: "Bins don't smell anymore. Didn't know that was possible.", name: "Sample review", area: "Pacific Beach", service: "Trash bins" },
  { text: "Storefront entry is spotless — customers actually noticed.", name: "Sample review", area: "Downtown", service: "Commercial" },
  { text: "Easy to book, showed up on time, and the patio looks incredible.", name: "Sample review", area: "Carmel Valley", service: "Patio" },
  { text: "Local, friendly, and they treated our place like it was their own.", name: "Sample review", area: "Bird Rock", service: "Exterior wash" },
  { text: "Pool deck was black around the edges. Now it's bright white.", name: "Sample review", area: "Mission Hills", service: "Pool deck" },
];

const AREAS = ["La Jolla", "UTC", "Bird Rock", "Pacific Beach", "Del Mar", "Carmel Valley", "Clairemont", "Mission Beach", "Point Loma", "Mission Hills", "North Park", "Downtown"];

const FAQS = [
  { q: "How fast can I get a quote?", a: "Fill out the form or call/text and we'll text you back with a quote — usually the same day. Quotes are always free." },
  { q: "Do I need to be home?", a: "For most exterior jobs, no. As long as we can reach the area and a water spigot, we can get it done while you're out." },
  { q: "Will pressure washing damage my stucco or siding?", a: "Not the way we do it. We use high pressure only where it helps (like concrete) and a gentle soft wash on stucco, vinyl, brick and painted surfaces." },
  { q: "What's the difference between pressure washing and soft washing?", a: "Pressure washing uses high-pressure water to blast grime off hard surfaces. Soft washing uses low pressure plus cleaning solution to lift mold, mildew and algae from delicate surfaces without damage." },
  { q: "Do you clean commercial properties?", a: "Yes — storefront entries, sidewalks, dumpster pads and building exteriors across San Diego and La Jolla." },
  { q: "What if I'm not happy with a spot?", a: "Satisfaction guaranteed. If a spot isn't right, we come back and make it right." },
];

const GALLERY = [
  { src: "/img/hero-action.jpg", title: "Golden-hour driveway", tag: "Pressure washing" },
  { src: "/img/driveway-after.jpg", title: "Spanish-style drive", tag: "Concrete" },
  { src: "/img/softwash-action.jpg", title: "Stucco soft wash", tag: "House wash" },
  { src: "/img/deck-after.jpg", title: "Deck restoration", tag: "Wood" },
  { src: "/img/pavers-action.jpg", title: "Paver patio", tag: "Patio" },
  { src: "/img/storefront-after.jpg", title: "Coastal storefront", tag: "Commercial" },
  { src: "/img/siding-after.jpg", title: "Mildew-free stucco", tag: "Soft wash" },
  { src: "/img/bins-after.jpg", title: "Sanitized bins", tag: "Trash bins" },
];

/* ---------- helpers ---------- */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-sky/25 bg-sky/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-sky">
      <span className="h-1.5 w-1.5 rounded-full bg-sky shadow-[0_0_10px_#22a6d9]" />
      {children}
    </span>
  );
}

function SectionTitle({ eyebrow, title, sub, center }: { eyebrow: string; title: string; sub?: string; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <BlurReveal as="h2" className="mt-5 text-balance text-4xl font-semibold tracking-tight md:text-6xl">
        {title}
      </BlurReveal>
      {sub && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-5 text-lg text-white/65"
        >
          {sub}
        </motion.p>
      )}
    </div>
  );
}

/* ---------- page ---------- */

export default function Site() {
  return (
    <>
      <SprayCursor />
      <TubelightNav />
      <MobileDock />

      <main id="top" className="relative">
        {/* HERO */}
        <section className="grain relative flex min-h-[100svh] items-center overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/hero-action.jpg" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-b from-abyss/70 via-abyss/60 to-abyss" />
          <AuroraShader className="absolute inset-0 mix-blend-screen" />

          <div className="relative z-10 mx-auto w-full max-w-7xl transform-gpu px-4 pb-24 pt-36 md:px-8">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Eyebrow>
                <ShimmerText className="text-sky">Locally owned · San Diego &amp; La Jolla</ShimmerText>
              </Eyebrow>
            </motion.div>

            <h1 className="mt-7 text-[clamp(3.2rem,10vw,9.5rem)] font-bold leading-[0.9] tracking-tighter">
              <SplitHeading text="Your town," />
              <br />
              <span className="relative">
                <SplitHeading text="made" gradient />{" "}
                <motion.span
                  initial={{ opacity: 0, scale: 0.8, filter: "blur(16px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)", transitionEnd: { filter: "none" } }}
                  transition={{ delay: 0.9, duration: 0.9 }}
                  className="inline-block [filter:drop-shadow(0_0_28px_rgba(34,166,217,0.55))]"
                >
                  <span
                    className="inline-block bg-gradient-to-r from-sky via-white to-sky bg-[length:200%_auto] bg-clip-text pr-[0.08em] italic text-transparent"
                    style={{ animation: "shine 6s linear infinite" }}
                  >
                    clean.
                  </span>
                </motion.span>
              </span>
            </h1>

            <div className="mt-8 flex flex-wrap items-baseline gap-x-3 text-2xl font-medium text-white/85 md:text-4xl">
              <span>We wash</span>
              <TextRotate
                texts={["driveways", "stucco & siding", "decks & fences", "storefronts", "trash bins", "pool decks"]}
                className="rounded-xl bg-sky px-3 py-1 text-abyss shadow-[0_0_40px_rgba(34,166,217,0.55)]"
              />
              <span>like they&apos;re our own.</span>
            </div>

            <BlurReveal className="mt-7 max-w-xl text-lg text-white/70" delay={1.1}>
              Professional pressure washing and exterior cleaning for homes and businesses. Honest prices, real results, done by your neighbors.
            </BlurReveal>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.7 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <LiquidMetalButton label="Get a free quote" href="#quote" />
              <InteractiveButton text="Call now" href={`tel:${PHONE_TEL}`} />
            </motion.div>

            <motion.ul
              initial="h"
              animate="v"
              variants={{ v: { transition: { staggerChildren: 0.1, delayChildren: 1.9 } } }}
              className="mt-14 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/65"
            >
              {["Free quotes", "Same-day text back", "Satisfaction guaranteed", "2 years in San Diego"].map((t) => (
                <motion.li key={t} variants={{ h: { opacity: 0, y: 8 }, v: { opacity: 1, y: 0 } }} className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-sky" /> {t}
                </motion.li>
              ))}
            </motion.ul>
          </div>

          <motion.a
            href="#wash"
            aria-label="Scroll down"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-white/60"
          >
            <ChevronDown className="h-7 w-7" />
          </motion.a>
        </section>

        {/* MARQUEE */}
        <section aria-label="Services" className="border-y border-sky/15 bg-abyss">
          <GooeyMarquee text="PRESSURE WASHING ✦ SOFT WASH ✦ DECKS & FENCES ✦ STOREFRONTS ✦ TRASH BINS ✦" />
        </section>

        {/* WASH IT YOURSELF */}
        <section id="wash" className="relative mx-auto max-w-7xl px-4 py-28 md:px-8 md:py-36">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionTitle eyebrow="Try it" title="Go ahead. Wash it yourself." sub="Move your cursor across the driveway (or drag your finger on mobile). That's the difference we make — every job." />
          </div>
          <WashReveal before="/img/driveway-before.jpg" after="/img/driveway-after.jpg" />
        </section>

        {/* STATEMENT */}
        <section className="relative mx-auto max-w-5xl px-6 py-24 md:py-40">
          <ScrollWordReveal
            text="We live here too. Every driveway, wall, deck and storefront we touch has our name on it — so we wash it like it's our own. Honest prices. Real results. Done by your neighbors."
            highlight={["own.", "neighbors.", "honest", "real"]}
          />
        </section>

        {/* SERVICES */}
        <section id="services" className="relative mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-32">
          <SectionTitle eyebrow="What we do" title="Exterior cleaning in San Diego & La Jolla, done right" />
          <div className="mt-14 grid gap-5 md:grid-cols-6">
            {SERVICES.map((s, i) => {
              const Icon = s.icon;
              const span = i < 2 ? "md:col-span-3" : "md:col-span-2";
              return (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  className={span}
                >
                  <GlowCard seed={i} className="group h-full">
                    <div className="flex h-full flex-col p-6 md:p-7">
                      <div className="relative mb-6 aspect-[16/10] overflow-hidden rounded-2xl border border-sky/15">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={s.img} alt={s.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-abyss/80 to-transparent" />
                        <div className="absolute left-4 top-4 grid h-11 w-11 place-items-center rounded-xl bg-sky text-abyss shadow-[0_0_30px_rgba(34,166,217,0.6)]">
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-semibold">{s.title}</h3>
                      <p className="mt-2 flex-1 text-white/70">{s.body}</p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {s.tags.map((t) => (
                          <span key={t} className="rounded-full border border-sky/20 bg-abyss/50 px-3 py-1 text-xs text-white/70">
                            {t}
                          </span>
                        ))}
                      </div>
                      <a href="#quote" data-magnetic className="mt-6 inline-flex w-fit items-center gap-2 rounded-full text-sm font-semibold text-sky">
                        Quote this <span className="transition-transform group-hover:translate-x-1">→</span>
                      </a>
                    </div>
                  </GlowCard>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* RESULTS */}
        <section id="results" className="relative mx-auto max-w-6xl px-4 py-24 md:px-8 md:py-32">
          <SectionTitle eyebrow="Before & after" title="Drag the line. See the difference." center />
          <div className="mt-12">
            <BeforeAfter jobs={JOBS} />
          </div>
        </section>

        {/* CONTAINER SCROLL + RIPPLE */}
        <section className="relative overflow-hidden">
          <ContainerScroll
            title={
              <>
                <Eyebrow>On the job</Eyebrow>
                <h2 className="mt-5 text-4xl font-semibold tracking-tight md:text-7xl">
                  Years of grime.
                  <br />
                  <span className="text-sky text-glow">Gone in an afternoon.</span>
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-white/60">Hover the photo — the water moves with you.</p>
              </>
            }
          >
            <WaterRipple src="/img/hero-action.jpg" alt="Technician pressure washing a driveway at sunset" className="h-full w-full" />
          </ContainerScroll>
        </section>

        {/* STATS */}
        <section className="relative border-y border-sky/15 bg-gradient-to-b from-deep/40 to-abyss">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-4 md:grid-cols-4 md:px-8">
            {[
              { n: 2, s: "", label: "Years serving San Diego" },
              { n: 5, s: "", label: "Exterior services" },
              { n: 100, s: "%", label: "Satisfaction guaranteed" },
              { n: 24, s: "h", label: "Or less to get your quote" },
            ].map((st) => (
              <div key={st.label} className="py-14 text-center md:py-20">
                <NumberTicker to={st.n} suffix={st.s} className="block text-6xl font-bold tracking-tighter text-white md:text-8xl" />
                <p className="mt-3 text-sm uppercase tracking-[0.2em] text-sky">{st.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* GALLERY */}
        <section className="relative overflow-hidden py-24 md:py-32">
          <div className="px-4 md:px-8">
            <SectionTitle eyebrow="The work" title="Clean from every angle" sub="Scroll and it spins. Move your mouse and it tilts." center />
          </div>
          <div className="mt-6">
            <CircularGallery items={GALLERY} />
          </div>
        </section>

        {/* PROCESS + WHY */}
        <section id="process" className="relative mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-32">
          <SectionTitle eyebrow="How it works" title="From text to spotless in five steps" sub="Tap any step to see what happens." center />
          <OrbitalProcess steps={STEPS} />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {WHY.map((w, i) => {
              const Icon = w.icon;
              return (
                <motion.div key={w.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <GlowCard shader={false} className="h-full p-7">
                    <Icon className="h-8 w-8 text-sky" />
                    <h3 className="mt-5 text-lg font-semibold">{w.title}</h3>
                    <p className="mt-2 text-sm text-white/65">{w.body}</p>
                  </GlowCard>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* REVIEWS */}
        <section className="relative py-24 md:py-32">
          <div className="px-4 md:px-8">
            <SectionTitle eyebrow="Reviews" title="Why your neighbors call us" center />
            <p className="mx-auto mt-4 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/55">
              <Star className="h-3.5 w-3.5" /> Sample reviews shown — Google reviews coming soon
            </p>
          </div>
          <div className="mx-auto mt-12 flex max-h-[44rem] max-w-6xl justify-center gap-5 overflow-hidden px-4 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]">
            <TestimonialsColumn reviews={REVIEWS.slice(0, 3)} duration={16} />
            <TestimonialsColumn reviews={REVIEWS.slice(3, 6)} duration={20} className="hidden md:block" />
            <TestimonialsColumn reviews={REVIEWS.slice(6, 9)} duration={18} className="hidden lg:block" />
          </div>
        </section>

        {/* SERVICE AREA */}
        <section className="relative h-[42rem] overflow-hidden md:h-[48rem]">
          <DottedSurface className="absolute inset-0" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-abyss via-transparent to-abyss" />
          <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-center px-4 text-center">
            <Eyebrow>Service area</Eyebrow>
            <BlurReveal as="h2" className="mt-5 text-4xl font-semibold tracking-tight md:text-6xl">
              Serving San Diego & La Jolla
            </BlurReveal>
            <p className="mt-4 max-w-lg text-white/65">Point at the water. Then find your neighborhood.</p>
            <div className="mt-10 flex max-w-3xl flex-wrap justify-center gap-2.5">
              {AREAS.map((a, i) => (
                <motion.span
                  key={a}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ scale: 1.08, y: -3 }}
                  className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-sky/30 bg-abyss/70 px-4 py-2 text-sm backdrop-blur transition-colors hover:border-sky hover:bg-sky hover:text-abyss"
                >
                  <MapPin className="h-3.5 w-3.5" /> {a}
                </motion.span>
              ))}
              <span className="rounded-full border border-dashed border-sky/30 px-4 py-2 text-sm text-white/60">+ greater San Diego</span>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="relative mx-auto max-w-3xl px-4 py-24 md:py-32">
          <SectionTitle eyebrow="FAQ" title="Questions, answered" center />
          <div className="mt-12">
            <Faq items={FAQS} />
          </div>
        </section>

        {/* QUOTE */}
        <section id="quote" className="relative overflow-hidden py-24 md:py-32">
          <BackgroundPaths className="opacity-40" />
          <div className="relative z-10 mx-auto max-w-5xl transform-gpu px-4 md:px-8">
            <div className="text-center">
              <Eyebrow>Free quotes · Fast turnaround</Eyebrow>
              <VaporText words={["Ready to see it clean?", "Driveways.", "Siding.", "Decks.", "Storefronts.", "Clean."]} fontSize={84} className="mt-4" />
              <p className="mx-auto mt-2 max-w-lg text-white/65">Fill out the form and we&apos;ll text you back with a quote — usually the same day.</p>
            </div>
            <ShineBorder className="mt-12" radius={30} width={2}>
              <QuoteForm />
            </ShineBorder>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="relative overflow-hidden border-t border-sky/15 pt-20">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 px-4 md:flex-row md:px-8">
          <div className="max-w-sm">
            <LogoLockup />
            <p className="mt-5 text-white/60">Pressure washing, soft wash and exterior cleaning for homes and businesses in San Diego &amp; La Jolla. Locally owned &amp; operated.</p>
          </div>
          <div className="grid grid-cols-2 gap-10 text-sm">
            <div>
              <h3 className="mb-4 font-semibold uppercase tracking-[0.2em] text-sky">Services</h3>
              <ul className="space-y-2 text-white/65">
                {SERVICES.map((s) => (
                  <li key={s.title}>
                    <a href="#services" className="hover:text-white">
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold uppercase tracking-[0.2em] text-sky">Contact</h3>
              <ul className="space-y-2 text-white/65">
                <li>
                  <a href={`tel:${PHONE_TEL}`} className="flex items-center gap-2 hover:text-white">
                    <Phone className="h-4 w-4" /> {PHONE_DISPLAY}
                  </a>
                </li>
                <li>
                  <a href={`sms:${PHONE_TEL}`} className="flex items-center gap-2 hover:text-white">
                    <MessageSquareText className="h-4 w-4" /> Text us
                  </a>
                </li>
                <li>
                  <a href="#quote" className="hover:text-white">
                    Free quote
                  </a>
                </li>
                <li className="text-white/45">Serving San Diego &amp; La Jolla</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-16">
          <GiantFooterName />
        </div>
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-2 border-t border-white/10 px-4 py-6 pb-28 text-xs text-white/40 md:flex-row md:px-8 md:pb-6">
          <span>© 2026 Town Made Cleaning · Locally owned &amp; operated</span>
          <span>Pressure washing · Soft wash · Exterior cleaning</span>
        </div>
      </footer>
    </>
  );
}
