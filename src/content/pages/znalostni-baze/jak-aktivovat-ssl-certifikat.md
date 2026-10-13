---
slug: znalostni-baze/jak-aktivovat-ssl-certifikat
kind: article
title: Jak aktivovat SSL certifikát na hostingu
description: "SSL certifikát Let's Encrypt je v ceně hostingu a aktivuje se automaticky. Návod na přesměrování na HTTPS."
eyebrow: SSL a bezpečnost
lead: "SSL certifikát Let's Encrypt je v ceně hostingu a aktivuje se automaticky."
cta:
  title: Potřebujete pomoc?
  text: "Nenašli jste odpověď? Otevřete ticket a náš tým vám pomůže."
  primary: { label: Kontaktovat podporu, href: /kontakt }
  secondary: { label: Zpět do znalostní báze, href: /znalostni-baze }
sample: false
---
## SSL certifikát na ONhostu

Každý webhosting zahrnuje bezplatný SSL certifikát Let's Encrypt. Aktivuje se automaticky, jakmile nasměrujete DNS na náš server.

### Automatická aktivace

1. Nastavte A záznam domény na IP adresu svého hostingového serveru.
2. Počkejte na propagaci DNS (15–60 minut).
3. SSL certifikát se aktivuje automaticky do hodiny.

### Přesměrování HTTP → HTTPS

Chcete web automaticky přesměrovat na HTTPS? Přidejte do souboru `.htaccess` ve složce `public_html`:

```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### Obnovení certifikátu

Certifikát Let's Encrypt platí 90 dní a obnovuje se automaticky. Nemusíte nic dělat.

### Prémiový SSL

Potřebujete rozšířenou validaci (OV/EV) nebo wildcard certifikát? [Napište nám přes kontaktní formulář](/kontakt).
