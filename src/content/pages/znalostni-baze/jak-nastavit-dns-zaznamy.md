---
slug: znalostni-baze/jak-nastavit-dns-zaznamy
kind: article
title: Jak nastavit DNS záznamy pro vaši doménu
description: "Průvodce nastavením záznamů A, CNAME, MX a TXT krok za krokem. Kde DNS změnit a za jak dlouho se změna projeví."
eyebrow: DNS a domény
lead: "Průvodce nastavením záznamů A, CNAME, MX a TXT krok za krokem."
cta:
  title: Potřebujete pomoc?
  text: "Nenašli jste odpověď? Otevřete ticket a náš tým vám pomůže."
  primary: { label: Kontaktovat podporu, href: /kontakt }
  secondary: { label: Zpět do znalostní báze, href: /znalostni-baze }
sample: false
---
## Základní DNS záznamy

DNS (Domain Name System) překládá doménová jména na IP adresy. Aby web a e-mail fungovaly, nastavte tyto záznamy.

### A záznam

Propojí doménu s IP adresou serveru. Příklad:

```
onhost.cz.  IN  A  185.1.2.3
```

### CNAME záznam

Alias. Přesměruje jednu doménu na jinou. Typicky se používá pro www:

```
www.onhost.cz.  IN  CNAME  onhost.cz.
```

### MX záznamy

Určují poštovní server, který přijímá e-maily. Mají prioritu: nižší číslo znamená vyšší prioritu.

```
onhost.cz.  IN  MX  10  mail.onhost.cz.
```

### TXT záznamy

Slouží k ověření e-mailů (SPF, DKIM, DMARC). Ověříte jimi také vlastnictví domény, například pro Google Search Console.

## Kde změnit DNS?

DNS záznamy upravíte u svého registrátora domén (např. WEDOS). Nebo v zákaznické zóně ONhost v sekci **Domény → Záznamy DNS**.

> **Pozor:** Změna DNS se obvykle projeví za 15–60 minut (TTL). Může ale trvat až 24 hodin.
