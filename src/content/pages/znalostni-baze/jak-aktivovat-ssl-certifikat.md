---
slug: znalostni-baze/jak-aktivovat-ssl-certifikat
kind: article
title: Jak aktivovat SSL certifikát na hostingu
description: "SSL certifikát Let's Encrypt je v ceně každého webhostingu a aktivuje se sám. Jak zapnout HTTPS a přesměrovat na něj celý web."
eyebrow: SSL a bezpečnost
lead: "Po tomto návodu poběží váš web na HTTPS s bezplatným certifikátem Let's Encrypt, který se obnovuje sám."
cta:
  title: Potřebujete pomoc?
  text: "Nenašli jste odpověď? Otevřete ticket a náš tým vám pomůže."
  primary: { label: Napsat podpoře, href: /kontakt }
  secondary: { label: Zpět do znalostní báze, href: /znalostni-baze }
related: [znalostni-baze/jak-nastavit-dns-zaznamy, ssl-certifikaty]
sample: false
---
Každý webhosting ONhost zahrnuje bezplatný SSL certifikát Let's Encrypt. Aktivuje se automaticky, jakmile nasměrujete DNS na náš server.

## Postup

1. Nastavte **A záznam** domény na IP adresu svého hostingového serveru.
2. Počkejte, až se změna DNS projeví. Obvykle to trvá 15–60 minut.
3. SSL certifikát se pak aktivuje automaticky do hodiny. Nic dalšího nastavovat nemusíte.

> **Tip:** Jak upravit A záznam, popisuje návod [Jak nastavit DNS záznamy](/znalostni-baze/jak-nastavit-dns-zaznamy).

## Přesměrování z HTTP na HTTPS

Chcete, aby web automaticky přesměroval návštěvníky na HTTPS? Přidejte do souboru `.htaccess` ve složce `public_html` tyto řádky:

```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

## Obnovení certifikátu

Certifikát Let's Encrypt platí 90 dní a obnovuje se automaticky. Nemusíte nic dělat.

## Prémiový SSL certifikát

Potřebujete rozšířenou validaci (OV/EV) nebo wildcard certifikát? [Napište nám přes kontaktní formulář](/kontakt).

## Nefunguje to?

- **Certifikát se neaktivoval.** Ověřte, že A záznam domény ukazuje na IP adresu vašeho hostingového serveru.
- **Změnu DNS jste udělali nedávno.** Dejte jí čas: obvykle se projeví za 15–60 minut a certifikát se pak aktivuje do hodiny.
- **Pořád nic?** [Otevřete ticket](/podpora) a napište, o kterou doménu jde. Pomůžeme vám.
