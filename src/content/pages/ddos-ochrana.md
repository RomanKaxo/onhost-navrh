---
slug: ddos-ochrana
kind: product
title: DDoS ochrana
description: "Automatická DDoS ochrana L3, L4 a L7 s WAF pro webhosting, VPS i dedikované servery. Mitigace během sekund, bez příplatku v každém tarifu."
eyebrow: Bezpečnost sítě
headline: "Útok odfiltrujeme. Návštěvníci projdou dál."
lead: "Automatická ochrana pro webhosting, VPS i dedikované servery. Útok rozpoznáme a potlačíme během sekund, základní ochranu máte v ceně."
planet: ddos
included:
  - Ochrana L3/L4/L7
  - Automatická mitigace
  - ModSecurity WAF
  - Rate limiting
  - Monitoring 24/7
highlights:
  - title: Reakce během sekund
    text: "Detekce i potlačení útoku proběhnou automaticky, bez zásahu administrátora."
  - title: Kapacita na velké útoky
    text: "Síťová kapacita 100 Gbps+ pro filtraci volumetrických útoků."
  - title: Chráněná aplikace
    text: "ModSecurity s OWASP Core Rule Set blokuje SQL injection, XSS a další útoky na web."
  - title: Čistý provoz až k vám
    text: "Provoz vede přes scrubbing centrum. Útok se tam odfiltruje, legitimní požadavky projdou bez zpomalení."
  - title: Pravidla, která se učí
    text: "Systémy vyhodnocují vzorce útoků a pravidla upravují v reálném čase."
  - title: Dohled nepřetržitě
    text: "Síťový provoz sledujeme 24/7 a na anomálie upozorňujeme okamžitě."
specs:
  - label: L3, síťová vrstva
    value: "IP flood, spoofing"
  - label: L4, transportní vrstva
    value: "TCP/UDP flood"
  - label: L7, aplikační vrstva
    value: "HTTP flood, slowloris"
  - label: WAF
    value: "ModSecurity, OWASP Core Rule Set"
  - label: Kapacita
    value: "100 Gbps+"
  - label: Detekce a mitigace
    value: "Automaticky, během sekund"
  - label: Doplňkové mechanismy
    value: "Rate limiting, IP reputace, scrubbing"
  - label: Dostupnost
    value: "Webhosting, VPS a dedikované servery bez příplatku; kolokace volitelně"
faq:
  - q: Platím za ochranu navíc?
    a: "Ne. Základní DDoS ochrana je součástí všech hostingových, VPS i dedikovaných tarifů."
  - q: Musím ochranu zapínat nebo nastavovat?
    a: "Ne. Detekce i mitigace běží automaticky 24 hodin denně, bez zásahu administrátora."
  - q: Zpomalí filtrace můj web?
    a: "Ne. Provoz filtrujeme v reálném čase a legitimní návštěvníci se k vám dostanou bez zpomalení."
  - q: Chrání i před útoky na samotnou aplikaci?
    a: "Ano. Na vrstvě L7 filtrujeme HTTP flood a slowloris, ModSecurity WAF s OWASP Core Rule Set blokuje SQL injection a XSS."
  - q: Jak je to u dedikovaných serverů a kolokace?
    a: "Dedikované servery mají pokročilou DDoS ochranu a na vyžádání i BGP session. U kolokace je filtrační vrstva na hraničním routeru volitelná."
cta:
  title: Zapněte hosting s ochranou v ceně
  text: "Základní DDoS ochrana je součástí všech hostingových, VPS i dedikovaných tarifů."
  primary: { label: Vybrat VPS, href: /vps }
  secondary: { label: Vybrat webhosting, href: /webhosting }
related: [vps, dedikovane-servery, webhosting]
sample: false
---
## Jak ochrana funguje

1. Veškerý příchozí provoz prochází naší síťovou vrstvou.
2. Systém v reálném čase rozpozná podezřelé požadavky podle vzorců útoků, rate limitů a IP reputace.
3. Útok se odfiltruje ve scrubbing centru.
4. Legitimní návštěvníci se k vám dostanou bez zpomalení.
