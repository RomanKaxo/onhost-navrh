---
slug: znalostni-baze/jak-nahrat-web-pres-ftp-sftp
kind: article
title: Jak nahrát web přes FTP nebo SFTP
description: "Kde najdete přístupové údaje FTP/SFTP, jak nastavit FileZillu a do které složky nahrát soubory webu."
eyebrow: Správa souborů
lead: "Nahrajete soubory svého webu na hosting přes FTP nebo SFTP, například v bezplatném programu FileZilla."
cta:
  title: Potřebujete pomoc?
  text: "Nenašli jste odpověď? Otevřete ticket a náš tým vám pomůže."
  primary: { label: Napsat podpoře, href: /kontakt }
  secondary: { label: Zpět do znalostní báze, href: /znalostni-baze }
related: [znalostni-baze/jak-zmenit-verzi-php, webhosting]
sample: false
---
K nahrání souborů na hosting potřebujete klienta FTP nebo SFTP. Doporučujeme FileZillu. Je zdarma pro Windows, Mac i Linux.

## Krok 1: Najděte přístupové údaje

1. Přihlaste se do klientské zóny.
2. Přejděte do sekce **Moje služby**.
3. Klikněte na název své služby.
4. V sekci **Přístupové údaje** najdete FTP host, uživatelské jméno a heslo.

## Krok 2: Nastavte FileZillu

Do FileZilly zadejte tyto údaje:

| Pole | Hodnota |
| --- | --- |
| Host | `ftp.onhost.cz` (nebo IP serveru) |
| Uživatel | váš FTP login |
| Heslo | vaše FTP heslo |
| Port | 21 (FTP) nebo 22 (SFTP) |

## Krok 3: Nahrajte soubory do správné složky

Webové soubory patří do složky `public_html` nebo `httpdocs`. Jako hlavní stránka se zobrazí soubor `index.php` nebo `index.html`.

## Nefunguje to?

- **Nedaří se přihlásit.** Porovnejte host, uživatelské jméno a heslo s údaji v sekci **Přístupové údaje**.
- **Spojení se nenaváže.** Zkontrolujte port: 21 pro FTP, 22 pro SFTP.
- **Web nezobrazuje nové soubory.** Ověřte, že leží ve složce `public_html` nebo `httpdocs` a že hlavní stránka se jmenuje `index.php` nebo `index.html`.
- **Pořád nic?** [Otevřete ticket](/podpora) a náš tým vám pomůže.
