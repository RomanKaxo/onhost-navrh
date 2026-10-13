---
slug: znalostni-baze/jak-vytvorit-emailovou-schranku
kind: article
title: Jak vytvořit e-mailovou schránku
description: "Jak za pár sekund vytvořit e-mailovou schránku na vlastní doméně a nastavit webmail, IMAP, POP3 a SMTP."
eyebrow: E-mail
lead: "Za pár sekund si založíte schránku na vlastní doméně a připojíte ji k webmailu nebo poštovnímu programu."
cta:
  title: Potřebujete pomoc?
  text: "Nenašli jste odpověď? Otevřete ticket a náš tým vám pomůže."
  primary: { label: Napsat podpoře, href: /kontakt }
  secondary: { label: Zpět do znalostní báze, href: /znalostni-baze }
related: [znalostni-baze/jak-nastavit-dns-zaznamy, mailhosting]
sample: false
---
S hostingem ONhost snadno vytvoříte schránky jako info@vasefirma.cz nebo podpora@vasefirma.cz.

## Postup

1. Přihlaste se do klientské zóny.
2. Přejděte na **Moje služby** a vyberte hosting.
3. Klikněte na **E-mailové schránky → Přidat schránku**.
4. Zadejte název schránky, doménu a heslo.
5. Klikněte na **Vytvořit**.

## Přístup k e-mailu

Do schránky se dostanete přes webmail odkudkoli, nebo si ji nastavíte v poštovním programu:

| Služba | Adresa | Port |
| --- | --- | --- |
| Webmail | `https://mail.vasedomena.cz` | — |
| IMAP | `imap.vasedomena.cz` | 993 (SSL) |
| POP3 | `pop.vasedomena.cz` | 995 (SSL) |
| SMTP (odesílání) | `smtp.vasedomena.cz` | 587 (STARTTLS) |

> **Tip:** Místo `vasedomena.cz` doplňte svou doménu.

## Příjem e-mailů a MX záznamy

Příjem e-mailů funguje automaticky, pokud MX záznamy domény ukazují na naše servery. Jak je nastavit, popisuje návod [Jak nastavit DNS záznamy](/znalostni-baze/jak-nastavit-dns-zaznamy).

## Nefunguje to?

- **E-maily nepřicházejí.** Zkontrolujte, že MX záznamy domény ukazují na servery ONhost.
- **Poštovní program se nepřipojí.** Porovnejte server, port a zabezpečení s tabulkou výše (SSL u IMAP a POP3, STARTTLS u SMTP).
- **Pořád nic?** [Otevřete ticket](/podpora) a náš tým vám pomůže.
