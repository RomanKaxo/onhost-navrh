---
slug: znalostni-baze/jak-nahrat-web-pres-ftp-sftp
kind: article
title: Jak nahrát web přes FTP nebo SFTP
description: "Kde najdete přístupové údaje FTP/SFTP, jak nastavit FileZillu a do které složky nahrát soubory webu."
eyebrow: Správa souborů
lead: "Přístupové údaje FTP/SFTP najdete v zákaznickém panelu ve správě služby."
cta:
  title: Potřebujete pomoc?
  text: "Nenašli jste odpověď? Otevřete ticket a náš tým vám pomůže."
  primary: { label: Kontaktovat podporu, href: /kontakt }
  secondary: { label: Zpět do znalostní báze, href: /znalostni-baze }
sample: false
---
## Nahrávání souborů přes FTP/SFTP

K nahrání souborů na hosting potřebujete klienta FTP nebo SFTP. Doporučujeme FileZillu. Je zdarma pro Windows, Mac i Linux.

### Kde najdu přihlašovací údaje?

Údaje FTP/SFTP najdete v zákaznickém panelu:

1. Přihlaste se do zákaznické zóny.
2. Přejděte do sekce **Moje služby**.
3. Klikněte na název své služby.
4. V sekci **Přístupové údaje** najdete FTP host, uživatelské jméno a heslo.

### Nastavení FileZilly

| Pole | Hodnota |
| --- | --- |
| Host | `ftp.onhost.cz` (nebo IP serveru) |
| Uživatel | váš FTP login |
| Heslo | vaše FTP heslo |
| Port | 21 (FTP) nebo 22 (SFTP) |

### Kam nahrát soubory?

Webové soubory patří do složky `public_html` nebo `httpdocs`. Soubor `index.php` nebo `index.html` se zobrazí jako hlavní stránka.
