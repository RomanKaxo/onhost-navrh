# ONhost — návrh nového webu: společné zadání týmu

_První týmový úkol Elaris + Claude + Codex. Tento soubor je jediný zdroj pravdy; když se něco mění, mění se tady._

## Cíl

Prémiový návrh celého webu onhost.cz (všech 39 stránek ze sitemapy) v tématu **vesmíru**, postavený na barvách a písmu z brandmanuálu, s výrazným ale klidným **motion designem**. Výsledek běží na GitHub Pages jako **návrh** (banner „Návrh“, `noindex`).

## Koncept: „Zapni svůj vesmír“

Symbol ONhostu je tlačítko zapnutí. Web začíná ve tmě (`--space-0`) a po „zapnutí“ se rozsvítí mlhovina (fialová `#3C096C`) a hvězdy (růžová a levandulová). Kruh symbolu je oběžná dráha, produkty jsou planety, datacentra souhvězdí. Prémiovost = hodně tmy a vzduchu, velká typografie, pomalé plynulé animace, jeden silný moment na stránce místo mnoha efektů.

## Brand (z brandmanuálu 2026 — závazné)

| Token | Hodnota | Role |
| --- | --- | --- |
| `--space-0` | `#12001E` | nejhlubší vesmír, pozadí |
| `--brand` | `#3C096C` | primární fialová, mlhovina, plochy |
| `--pink` | `#E91E7A` | akcent, hlavní CTA, růžová čárka loga |
| `--pink-hot` | `#F72585` | hover/zář akcentu |
| `--lilac` | `#BB88EB` | sekundární akcent, odkazy na tmavém |
| `--lilac-200` | `#E0BEFF` | jemný text/ikony na tmavém |
| `--lilac-50` | `#F1E2FF` | světlé plochy, text na tmavém |
| `--ink-900` | `#1A1A1A` | text na světlém |
| `--ink-700` | `#2E2E2E`, `#332A2E`, `#4D3F46` | šedé neutrály |

- Písmo nadpisů **League Spartan**, text **Inter** (Regular/Medium/SemiBold). Self-hosted (`@fontsource`).
- Povolená pozadí podle manuálu: bílé, tmavé, brandová barva, přechod fialová→růžová, tmavá fotografie.

### Logo — pravidla (nesmí se porušit)
- Soubory: `public/brand/onhost-horizontal.svg`, `public/brand/onhost-symbol.svg` (čistý výřez originální geometrie). Barvy přes CSS proměnné `--logo-mark` a `--logo-bar`.
- Schválené kombinace: bílá + růžová čárka na tmavém/fialovém; tmavá fialová (`#3C096C`/`#2C0A3E`) na světlé levandulové; černá na růžové.
- **Logo se nesmí:** otáčet, naklánět, deformovat, přebarvovat mimo schválené varianty, dostat stín/záři/obrys/efekt, vkládat do tvarů a rámečků, měnit poměr symbol–logotyp. Minimální šířka 50 px. Ochranná zóna = výška růžové čárky.
- **Animace loga:** jen průhlednost a rovnoměrné posunutí/zmenšení. Žádná rotace, glow, morph. Pohyb se děje **kolem** loga (oběžné dráhy, částice), ne v něm.

## Pohybový systém

- Rychlosti: mikro 150–200 ms, přechody 400–700 ms, scénické 1,2–2 s. Křivka `cubic-bezier(.2,.8,.2,1)`; pro oběžné dráhy lineární.
- Motivy: oběžná dráha (kruh symbolu), hvězdné pole s paralaxou, mlhovina (pomalý šum), „zapnutí“ (tma → světlo), souhvězdí (body spojené linkami).
- `prefers-reduced-motion: reduce` → žádné scénické animace, statický poster, žádné automatické přehrávání videa.
- Výkon: LCP < 2,5 s na mobilu, WebGL jen kde je vidět (IntersectionObserver), pauza mimo viewport, videa `preload="none"` + poster, celkový JS úvodní stránky co nejmenší.

## Obsah a poctivost

- Zdroj: `content/source/*.md` (text živého webu, stažený 13. 10. 2026) + snímky `reference/live/`.
- Výsledný obsah: `src/content/pages/<slug>.md` (schéma níže). Psát česky, prémiově, srozumitelně, krátké věty, aktivní slovesa.
- **Jen ověřitelná tvrzení.** Žádná vymyšlená čísla (uptime, počty zákazníků, rychlosti, certifikace), pokud nejsou na živém webu nebo v podkladech. Chybějící text označit `<!-- ukázkový text -->` a v UI štítkem „ukázkový text“. Ceny přebírat z živého webu, nevymýšlet.

### Schéma obsahu (`src/content/pages/<slug>.md`)

```yaml
---
slug: webhosting            # cesta bez lomítek; úvod = "home"; vnořené "blog/jak-vybrat-hosting-pro-firemni-web"
kind: product               # home | product | feature | listing | article | company | legal | support
title: Webhosting           # <title> a H1
description: …              # meta description, max ~155 znaků
eyebrow: Hosting pro weby   # malý nadtitulek
lead: …                     # 1–2 věty pod H1
planet: web                 # motiv planety pro produkt (web, wordpress, managed, game, vps, mail, dedicated, ssl, reseller, developer, ddos, colo, domains, builder, email-security, database, datacenter)
highlights:                 # 3–6 výhod
  - title: …
    text: …
plans:                      # jen pokud jsou na živém webu
  - name: Start
    price: "49 Kč"
    period: "měsíc"
    features: [ … ]
    featured: false
faq:
  - q: …
    a: …
cta:
  title: …
  text: …
  primary: { label: …, href: … }
---
Volitelný delší text v Markdownu (právní stránky, články, znalostní báze).
```

## Stránky (39 + 404) a kdo je dělá

| Skupina | Stránky | Šablona | Obsah | Stavba |
| --- | --- | --- | --- | --- |
| Úvod | `/` | `HomeLayout` | Elaris | Claude (já) + Codex (scéna) |
| Produkty (16) | webhosting, wordpress-hosting, managed-hosting, gamehosting, vps, mailhosting, dedikovane-servery, ssl-certifikaty, reseller-hosting, developer, ddos-ochrana, kolokace, domeny, website-builder, email-security, databaze | `ProductLayout` | Elaris | Claude sub-agent A |
| Funkce + DC (4) | funkce/ai-asistent, funkce/monitoring, funkce/zalohy, datacenter | `FeatureLayout` | Elaris | Claude sub-agent A |
| Obsah (9) | blog, 2 články, znalostni-baze, 5 návodů | `ListingLayout`, `ArticleLayout` | Elaris | Claude sub-agent B |
| Firma a podpora (4) | o-nas, kontakt, podpora, faq | `CompanyLayout` | Elaris | Claude sub-agent B |
| Právní (5) | obchodni-podminky, gdpr, cookies, sla, refundace | `LegalLayout` | Elaris (přepis jen formátu, právní text beze změny smyslu) | Claude sub-agent B |
| 404 | „Ztracen ve vesmíru“ | — | Claude | Claude |

**Codex** navíc: technika (Astro, GitHub Actions → Pages), knihovna pohybu `src/motion/` (WebGL hvězdné pole a mlhovina, oběžné dráhy, odkrývání při scrollu, přechody stránek) a Remotion kompozice v `motion/remotion/` (smyčky „zapnutí“, „nasazení“, „souhvězdí“ → WebM/MP4 + poster do `public/media/`).

## Technika

- Astro (statický výstup), `base: /onhost-navrh`, odkazy vždy přes `import.meta.env.BASE_URL`.
- Styly: `src/styles/tokens.css` (tokeny výše), `src/styles/base.css`, komponenty v `src/components/` (Astro komponenty, minimum klientského JS).
- Každá stránka: `<meta name="robots" content="noindex">`, banner „Návrh nového webu ONhost“.
- Ověření před předáním: `npm run build` bez chyb, snímky 1440 a 390 px, žádný horizontální scroll, kontrast AA (pozor: růžová na fialové je jen pro velký text/CTA), `prefers-reduced-motion` funguje.

## Pravidla spolupráce

- Každý pracuje ve své oblasti souborů (viz tabulka) a ve vlastní větvi; koordinátor (Claude) slučuje do `main` a nasazuje.
- RTK pro shellové příkazy (`rtk git`, `rtk npm` …).
- Nic se nepublikuje mimo GitHub Pages tohoto repozitáře. Žádné klíče do repozitáře.

## Poslední úkol (až bude web hotový)

Reels video (9:16, ~30–45 s) „Proč ONhost“: vlastní scénář, Remotion, v tématu vesmíru a podle pravidel loga. Prémiový tón, jen ověřitelná tvrzení. Zpracovává Claude.

### Hlavní motiv: logo je vypínač (on/off)
Symbol ONhostu je tlačítko zapnutí — využíváme to všude, hlavně v Remotion videu a v úvodní scéně webu:
- **„Stisk“** = rovnoměrné krátké zmenšení symbolu (např. 1 → 0,94 → 1, 180–240 ms) a návrat; **nic jiného se s logem neděje** (žádná rotace, záře, obrys, deformace, přebarvení).
- **Následek stisku** se odehrává kolem loga: tma se rozsvítí, z kruhu se rozběhne oběžná dráha, vzplanou hvězdy, objeví se mlhovina; vypnutí = vesmír pohasne.
- Stav „zapnuto“ lze ukazovat i textem/zvukem/UI kolem (např. „ON“), ne úpravou loga.
- Na webu: tlačítko/odkaz se symbolem může sloužit jako přepínač „zapnout vesmír“ (pohyb on/off) — výchozí stav respektuje `prefers-reduced-motion`.
