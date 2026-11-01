# QA ovládání ONHOST

Audit z 1. listopadu 2026 pokrývá 42 generovaných stránek včetně 404 a obou laboratoří při šířkách 1440 a 390 px. Důkazy jsou mimo Git v `/home/roman/Documents/ONHOST/qa-tlacitka-2026-11-01/INVENTAR.md`.

## Opakování

```sh
rtk npm ci
rtk npm run build
rtk proxy npm run preview -- --host 127.0.0.1 --port 4322
rtk proxy uv run --with playwright python scripts/qa-buttons.py --output /tmp/onhost-qa --screenshots
rtk proxy uv run --with playwright python scripts/qa-styles.py --output /tmp/onhost-qa-styles
rtk proxy uv run --with playwright python scripts/qa-flows.py --output /tmp/onhost-qa-flows
rtk proxy node scripts/check-content.mjs
```

Python Playwright běží prostřednictvím uv mimo závislosti projektu. Prohlížeč Chromium musí být dostupný v jeho cache. Preview musí zůstat spuštěné a po dobu průchodu se nesmí přestavovat `dist`.

`qa-buttons.py` podporuje `--shard 1/3` až `--shard 3/3`, `--routes /kontakt /faq`, `--widths 390` a vlastní `--base-url`. Každé části dej samostatnou výstupní složku.

## Rozsah kontrol

- Každý viditelný odkaz dostane skutečný klik. Navigace je při hromadném průchodu zachycena, každý unikátní cíl se samostatně načte přes HTTP. U víceřádkových odkazů se kliká na skutečný textový fragment.
- Desktopová a mobilní menu, FAQ a vypínače se otevřou i zavřou; ověřuje se Escape, Tab, ArrowDown, mezerník a návrat fokusu. Zavřené desktopové panely musí být inertní.
- Kontrolují se konzole, obrázky, kotvy, oříznutý obsah, šířka dokumentu a štítky tarifů. Snímky se pořizují po průchodu celou stránkou a hydrataci glóbu.
- Hover a focus se porovnávají na reprezentantech přesných kombinací tříd a kontextu každé stránky. CSS přechody se při této kontrole vypínají kvůli jednoznačnému měření stavů.
- Samostatné uživatelské průchody zachovávají skutečnou navigaci: doménový formulář, článek → kontakt, menu → webhosting → tarify, 404 → úvod. Globus se ověří myší, emulovaným dotykem a šipkami, včetně statického stavu při omezeném pohybu.

## Externí omezení

Živý web `https://onhost.cz/kontakt` odkazuje do klientské zóny na `https://admin.onhost.cz/panel`. Tato oficiální adresa vracela při auditu HTTP 403 z testovacího prostředí. Test tuto skutečnost zaznamená a skončí nenulovým návratovým kódem. Přihlášení a objednávku je potřeba ověřit v přístupném prohlížeči nebo u správce ONhost.

Návrh nepředstírá skutečnou kontrolu dostupnosti domény. Zachová zadanou hodnotu a nabídne klientskou zónu. Kontakt a odběr novinek výslovně vedou na živý web. Označené ilustrace klientské zóny obsahují pouze kreslené ukázky ovládání.
