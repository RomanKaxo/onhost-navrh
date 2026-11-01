# Globe — integrace 1. 11. 2026

Na homepage nahrazuje ilustrativní WorldMap v sekci datacentra. Ostatní použití
WorldMap zůstávají. Jediný marker je Praha [50.08, 14.43], podle souřadnic
v `scripts/build-world.mjs` a stávajícího katalogu. Žádné další lokality ani
číselná tvrzení nepřibyly.

## Zdroj a struktura

`src/components/ui/globe.tsx` je doslovná kopie z Romanova promptu
`~/.agenti/briefy/zadani/globe-prompt.md`. SHA-256:
`39aa20e56602e67980aaf72f7e3ea585831fffd5710954546475b9e0d71c820c`.
Přiložený `demo.tsx` je rovněž převzatý; homepage používá značkový obal
`NetworkGlobe.tsx`. Složka `src/components/ui` odpovídá shadcn konvenci:
CLI a převzaté komponenty ji najdou přes alias `@/components/ui`.
`components.json` popisuje aliasy, TypeScript a Tailwind pro další komponenty.
Spustit `npm ci`, `npm run dev`; není potřeba inicializovat celý shadcn projekt.

`@astrojs/tailwind` 6.0.2 má peer Astro pouze 3–5. Pro Astro 7 používáme
[oficiálně dokumentovaný plugin @tailwindcss/vite](https://docs.astro.build/en/guides/styling/).
`src/styles/globe.css` načítá pouze theme a utilities, bez preflightu. Skenování
užitkových tříd je omezené na `src/components/ui`; vlastní styly webu zůstávají.
TS alias `@/* → src/*`, helper `src/lib/utils.ts` kombinuje clsx a tailwind-merge.
Typecheck se vztahuje na Astro web v `src`; samostatný projekt Remotion má vlastní závislosti.

## Provozní obal

Vite resolver přesměruje import `cobe` pouze z původního `ui/globe.tsx` na
`src/lib/globe-runtime.ts`. Adaptér dál používá skutečné COBE. Tím zůstává
původní soubor doslova stejný a přitom funguje:

- React island `client:visible`, stabilní čtvercový prostor před hydratací;
- pozastavení kreslení mimo viewport a na skryté kartě;
- `prefers-reduced-motion` i jeho změna za běhu: statický poster po načtení mapové textury;
- překreslení po změně velikosti a návrat k animaci;
- tažení bez chyby uzavřeného React stavu v dodané ukázce;
- error boundary a dekorativní CSS koule, pokud WebGL nejde vytvořit.

COBE 0.6.5 podporuje původní API promptu. Jeho volba `mapBaseBrightness`
musí být výslovně 0, jinak vzniká NaN a černá mapa. Adaptér čeká na
`TEXTURE_MIN_FILTER === NEAREST`, které tato připnutá verze nastaví až po
načtení vložené mapy; pak zastaví renderovací smyčku pro reduced motion.
Před probe COBE vytváříme kontext s `preserveDrawingBuffer`, aby statický obraz
nezmizel po compositingu. Při aktualizaci COBE ověřit tyto body znovu. Původní komponenta a Phenomenon
ponechávají své resize listenery po unmountu; kvůli doslovnosti je zdroj
nezměněný. Přidané listenery a observery adaptér uklízí. Navigace a resize
po odchodu byly otestované. Fallback není geografická mapa.

## Připnuté závislosti

Data vydání ověřena proti npm registry; hranice 18. 10. 2026, tedy více než
14 dní před úkolem. Všech 117 nových nebo změněných záznamů locku hranici splňuje.
Původní přímé závislosti projektu mají stejné verze.

| Balíček | Verze | Vydáno |
| --- | --- | --- |
| @astrojs/react | 6.0.0 | 2026-06-22 |
| @tailwindcss/vite | 4.3.3 | 2026-07-16 |
| clsx | 2.1.1 | 2024-04-23 |
| cobe | 0.6.5 | 2025-09-17 |
| react | 19.2.0 | 2025-10-01 |
| react-dom | 19.2.0 | 2025-10-01 |
| tailwind-merge | 3.7.0 | 2026-09-12 |
| tailwindcss | 4.3.3 | 2026-07-16 |
| @types/node | 24.19.2 | 2026-10-09 |
| @types/react | 19.3.0 | 2026-09-09 |
| @types/react-dom | 19.3.0 | 2026-09-09 |
| typescript | 6.0.3 | 2026-04-16 |

Kvůli pravidlu 14 dní jsou také přesně připnuté nepřímé závislosti přes `overrides`:

- `@babel/generator@7.29.8`
- `@babel/helper-string-parser@7.29.7`
- `@babel/parser@7.29.9`
- `@babel/traverse@7.29.10`
- `@babel/types@7.29.8`
- `baseline-browser-mapping@2.11.29`
- `browserslist@4.29.3`
- `caniuse-lite@1.0.30001816`
- `electron-to-chromium@1.5.459`
- `node-releases@2.0.59`

## Ověření a artefakty

- `rtk npm run build`: 42 stránek, exit 0.
- `rtk proxy npx tsc --noEmit`: exit 0.
- Playwright Chromium, 1440 × 1000 a 390 × 1000: lazy start, rotace,
  pause mimo viewport, reduced motion, změna velikosti, navigace a nulový horizontální scroll.
- Porovnání vybraných computed stylů původní verze a výsledku na obou šířkách:
  shodná typografie, barvy, šířky a padding hero, formuláře, katalogu a faktů.
- Doplňková kontrola: první načtení s reduced motion dává stabilní neprázdný
  poster; tažení 65 px mění phi o 0,325 rad; bez WebGL se ukáže CSS fallback.
- Screenshoty, ověřovací skripty a JSON důkazy:
  `/home/roman/Documents/ONHOST/globe-2026-11-01/`.
- `npm audit` stále hlásí původní problém v `undici@8.11.2` z Astro stromu;
  stejná verze byla v původním locku, nesouvisí s Globe. Bez plošného audit fixu.

Nebyl změřen LCP ani výkon na skutečném telefonu. Kontrola přes codebase-memory
nebyla dostupná (nástroje skillu nebyly v relaci vystavené); soubory byly čtené přímo.

## Paprsky dostupnosti — 1. 11. 2026

COBE 0.6.5 v `node_modules/cobe/dist/index.d.ts` ani rendereru nemá API
oblouků. `src/lib/globe-lasers.ts` proto přidává dekorativní 2D canvas přes
stejný adaptér. Původní `ui/globe.tsx` i jeho SHA-256 zůstávají stejné.
Žádné nové závislosti.

Paprsky ilustrují dostupnost služeb z Prahy odkudkoli. Cíle (Londýn,
New York, Paříž, Singapur, Řím, Stockholm, Madrid a Berlín) nemají
popisky ani trvalé markery a neoznačují datacentra nebo pobočky.
Popisek: „Odtud běží vaše weby – dostupné odkudkoli“.

Trasy jsou předpočítané kulové interpolace s vyvýšením nad povrch.
Projekce přebírá matici `J(theta, phi)` a poloměr 0,8 z připnutého shaderu
COBE, včetně měřítka, offsetu a poměru pixelů. Zadní úseky uvnitř siluety
Země se nekreslí; oblouk může nad horizont vyčnívat. Každý let má světlou
hlavu, růžovofialovou stopu a krátký dopadový kruh, poté zaniká.

Overlay nemá vlastní animační smyčku: používá přímo COBE `onRender` a jeho
aktuální `phi/theta`, včetně tažení a šipek. Časový krok je omezen na 50 ms,
aby se po pauze neposunul skokem; rotace je nyní časová (0,3 rad/s).
Mimo viewport a při skryté kartě stojí i overlay. Při reduced motion
se vymaže a zůstane statický globus. Je dekorativní (`aria-hidden`),
nepřebírá události ukazatele a při zániku se odstraní. Canvas má nejvýše
2× rozlišení CSS; nejsou zde per-frame blur filtry ani nové textury.

Geometrii ověřuje `rtk proxy node scripts/verify-globe-lasers.mjs` (Node 22+):
19 zpětných projekcí proti shaderu, světové strany, zakrytí horizontem,
měřítko a offset. Browserové důkazy a skript jsou v
`/home/roman/Documents/ONHOST/lasery-2026-11-01/`.

Build: 42 stránek, exit 0; `rtk proxy npx tsc --noEmit`: exit 0 (po
vygenerování Astro typů buildem). Playwright Chromium, 1440 × 1000 a
390 × 1000: let, viditelný overlay, lazy start, pauza mimo viewport,
vymazání a zastavení při reduced motion, návrat k letu, resize, tažení
65 px = 0,325 rad, šipky, navigace, žádný horizontální scroll ani pageerror.
Ověřen také první vstup s reduced motion a fallback bez WebGL.

Na NVIDIA RTX 4060 Ti má měření s nahráváním na obou šířkách medián
16,7 ms/snímek (přibližně 60 fps). Jde o desktop s mobilní šířkou,
nikoli skutečný telefon. Softwarový SwiftShader byl pomalejší;
jeho oddělené výsledky zachovává `checks-swiftshader.json`.
`checks.json` obsahuje aktuální měření GPU a přesné percentily.
`nahled-8s.webm` je osm sekund skutečného záznamu Playwright bez zásahů
do rychlosti animace. PNG obsahují oba viewporty, detail globu i celou sekci.
Finální PNG vznikly přes SwiftShader se zastavením na skutečném snímku letu;
nativní GPU při screenshot readbacku občas vynechala WebGL vrstvu.
Video a měření pocházejí z nativní GPU; snímek z videa byl vizuálně ověřen.
Při této práci byly nástroje codebase-memory dostupné, ale tento worktree
není indexovaný (včetně negativního výsledku `check_index_coverage`);
dotčené zdroje byly zkontrolovány přímo.
