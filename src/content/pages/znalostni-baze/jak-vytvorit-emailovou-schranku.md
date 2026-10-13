---
slug: znalostni-baze/jak-vytvorit-emailovou-schranku
kind: article
title: Jak vytvořit e-mailovou schránku
description: "Vytvořte e-mailovou schránku na vlastní doméně za pár sekund. Postup, nastavení IMAP, POP3, SMTP a webmail."
eyebrow: E-mail
lead: "Vytvořte e-mailovou schránku na vlastní doméně za pár sekund."
cta:
  title: Potřebujete pomoc?
  text: "Nenašli jste odpověď? Otevřete ticket a náš tým vám pomůže."
  primary: { label: Kontaktovat podporu, href: /kontakt }
  secondary: { label: Zpět do znalostní báze, href: /znalostni-baze }
sample: false
---
## Vytvoření e-mailové schránky

S hostingem ONhost snadno vytvoříte schránky jako info@vasefirma.cz nebo podpora@vasefirma.cz.

### Postup vytvoření schránky

1. Přihlaste se do zákaznické zóny.
2. Přejděte na **Moje služby** a vyberte hosting.
3. Klikněte na **E-mailové schránky → Přidat schránku**.
4. Zadejte název schránky, doménu a heslo.
5. Klikněte na **Vytvořit**.

### Přístupy k e-mailu

| Služba | Adresa | Port |
| --- | --- | --- |
| Webmail | `https://mail.vasedomena.cz` (odkudkoli) | — |
| IMAP | `imap.vasedomena.cz` | 993 (SSL) |
| POP3 | `pop.vasedomena.cz` | 995 (SSL) |
| SMTP (odesílání) | `smtp.vasedomena.cz` | 587 (STARTTLS) |

### MX záznamy pro příjem

Příjem e-mailů funguje automaticky, pokud MX záznamy domény ukazují na naše servery. Podrobnosti najdete v článku [Jak nastavit DNS záznamy](/znalostni-baze/jak-nastavit-dns-zaznamy).
