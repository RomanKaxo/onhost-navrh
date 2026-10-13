---
slug: znalostni-baze/jak-nastavit-dns-zaznamy
kind: article
title: Jak nastavit DNS záznamy pro vaši doménu
description: "Jak nastavit záznamy A, CNAME, MX a TXT pro web a e-mail, kde DNS změnit a za jak dlouho se změna projeví."
eyebrow: DNS a domény
lead: "Propojíte svou doménu s webem a e-mailem pomocí záznamů A, CNAME, MX a TXT."
cta:
  title: Potřebujete pomoc?
  text: "Nenašli jste odpověď? Otevřete ticket a náš tým vám pomůže."
  primary: { label: Napsat podpoře, href: /kontakt }
  secondary: { label: Zpět do znalostní báze, href: /znalostni-baze }
related: [znalostni-baze/jak-vytvorit-emailovou-schranku, domeny]
sample: false
---
DNS (Domain Name System) překládá doménová jména na IP adresy. Aby web a e-mail fungovaly, potřebujete nastavit záznamy popsané níže.

## Kde DNS změnit

DNS záznamy upravíte na jednom ze dvou míst:

- u svého registrátora domén (např. WEDOS),
- v klientské zóně ONhost v sekci **Domény → Záznamy DNS**.

## Postup

1. Otevřete správu DNS: v klientské zóně sekci **Domény → Záznamy DNS**, nebo administraci u svého registrátora.
2. Nastavte **A záznam**, který propojí doménu s IP adresou serveru.
3. Pro www přidejte **CNAME záznam**, který míří na hlavní doménu.
4. Pro příjem e-mailů nastavte **MX záznamy** na poštovní server.
5. Podle potřeby přidejte **TXT záznamy** pro SPF, DKIM a DMARC nebo pro ověření vlastnictví domény.
6. Počkejte, až se změna projeví.

> **Pozor:** Změna DNS se projeví za 15–60 minut (TTL), ale může trvat až 24 hodin.

## Přehled záznamů

### A záznam: doména a server

Propojí doménu s IP adresou serveru. Příklad:

```
onhost.cz.  IN  A  185.1.2.3
```

### CNAME záznam: alias

Přesměruje jednu doménu na jinou. Typicky se používá pro www:

```
www.onhost.cz.  IN  CNAME  onhost.cz.
```

### MX záznamy: příjem e-mailů

Určují poštovní server, který přijímá e-maily. Mají prioritu: nižší číslo znamená vyšší prioritu.

```
onhost.cz.  IN  MX  10  mail.onhost.cz.
```

### TXT záznamy: ověření

Slouží k ověření e-mailů (SPF, DKIM, DMARC) a také k ověření vlastnictví domény, například pro Google Search Console.

> **Tip:** Doména a IP adresa v příkladech jsou jen ukázka. Nahraďte je svou doménou a adresou svého serveru.

## Nefunguje to?

- **Změna se zatím neprojevila.** Může trvat až 24 hodin. Dejte jí čas.
- **Záznamy jsou správně, ale nic se neděje.** Ověřte, že je upravujete na správném místě: u registrátora, nebo v klientské zóně ONhost.
- **E-maily nechodí.** Zkontrolujte MX záznamy a jejich prioritu.
- **Pořád nic?** [Otevřete ticket](/podpora) a náš tým vám pomůže.
