---
slug: znalostni-baze/jak-zmenit-verzi-php
kind: article
title: Jak změnit verzi PHP na hostingu
description: "Verzi PHP změníte v klientské zóně bez restartu serveru a bez výpadku. Podporujeme PHP 7.4 až 8.3, výchozí je PHP 8.3."
eyebrow: Webhosting
lead: "Přepnete svůj web na jinou verzi PHP přímo v klientské zóně, bez restartu serveru a bez výpadku."
cta:
  title: Potřebujete pomoc?
  text: "Nenašli jste odpověď? Otevřete ticket a náš tým vám pomůže."
  primary: { label: Napsat podpoře, href: /kontakt }
  secondary: { label: Zpět do znalostní báze, href: /znalostni-baze }
related: [znalostni-baze/jak-nahrat-web-pres-ftp-sftp, webhosting]
sample: false
---
Všechny tarify ONhost podporují PHP 7.4, 8.0, 8.1, 8.2 a 8.3. Výchozí verze je PHP 8.3.

## Postup

1. Přihlaste se do klientské zóny.
2. Přejděte do sekce **Moje služby** a klikněte na název služby.
3. V záložce **Nastavení PHP** vyberte požadovanou verzi.
4. Hotovo. Změna se projeví okamžitě a bez výpadku.

## Kterou verzi zvolit

- **Nový projekt:** doporučujeme PHP 8.3.
- **WordPress 6.x:** vyžaduje alespoň PHP 7.4, ideálně 8.1 a vyšší.

## Jak zjistit aktuální verzi PHP

1. Ve složce `public_html` vytvořte soubor `phpinfo.php` s tímto obsahem:

   ```php
   <?php phpinfo(); ?>
   ```

2. Otevřete ho v prohlížeči: `https://vasedomena.cz/phpinfo.php`. Uvidíte podrobné informace o konfiguraci PHP.
3. Po ověření soubor smažte.

> **Pozor:** Soubor `phpinfo.php` na serveru nenechávejte. Podrobnosti o konfiguraci PHP by jinak viděl každý, kdo jeho adresu otevře.

## Nefunguje to?

- **Web po změně nefunguje správně.** Stejným postupem vyberte v záložce **Nastavení PHP** původní verzi.
- **Nevíte, jaká verze právě běží.** Ověřte ji souborem `phpinfo.php` podle návodu výše.
- **Pořád nic?** [Otevřete ticket](/podpora) a náš tým vám pomůže.
