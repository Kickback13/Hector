# Town Made Cleaning — website

Next.js + Tailwind rebuild of [townmadecleaning.com](https://www.townmadecleaning.com) — pressure washing & exterior cleaning in San Diego and La Jolla.

Brand: navy `#0C4A63`, sky `#22A6D9`, Jost. Quote form posts to the same Formspree endpoint as the original site (`Name`, `Phone`, `Address`, `Service`, `Details`).

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Effects (adapted from 21st.dev, re-colored to the brand)

| Where | 21st.dev component |
|---|---|
| Custom cursor + water-spray trail | `@jahed/magnetic-cursor`, `@pulkitxm/fluid-cursor-trail`, `@dillionverma/smooth-cursor` |
| Hero background | `@minhxthanh/animated-shader-background`, `@kokonutd/background-paths` |
| Hero text | `@danielpetho/text-rotate`, `@tom_ui/blur-reveal`, `@tom_ui/shimmer-text` |
| Hero buttons | `@johuniq/liquid-metal-button`, `@dillionverma/interactive-hover-button` |
| Nav | `@ayushmxxn/tubelight-navbar` |
| "Wash it yourself" + before/after | `@ibrandify/before-after-comparison` |
| Statement | `@motiondotdev/motion-scroll-word-reveal` |
| Service cards | `@easemize/spotlight-card`, `@moazamtrade/feature-shader-cards` |
| On-the-job photo | `@manuarora700/container-scroll-animation`, `@rahil1202/water-ripple-image` |
| Stats | `@danielpetho/basic-number-ticker` |
| Gallery | `@ravikatiyar162/circular-gallery` |
| Process | `@jatin-yadav05/radial-orbital-timeline` |
| Reviews | `@efferd/testimonials-columns-1` |
| Marquee | `@designali-in/gooey-marquee` |
| Service area | `@sshahaider/dotted-surface` |
| FAQ | `@scrollxui/frequently-asked-questions-with-accordion` |
| Quote headline / form border | `@jatin-yadav05/vapour-text-effect`, `@dillionverma/shine-border` |
| Footer wordmark | `@arihantcodes_1f7b8c4d/large-name-footer` |
| Mobile dock | `@isaiahbjork/message-dock` |

## Before launch

- Photos in `public/img/` are AI-generated placeholders — swap in real job photos (keep the same file names and they drop right in).
- Reviews are labeled as samples — replace with real Google reviews.
- FAQ answers and the service-area neighborhood list are drafts — have Hector confirm.
