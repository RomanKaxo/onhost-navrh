---
slug: znalostni-baze/jak-zmenit-verzi-php
kind: article
title: Jak změnit verzi PHP na hostingu
description: "Verzi PHP změníte v zákaznickém panelu bez restartu serveru. Podporujeme PHP 7.4 až 8.3, výchozí je PHP 8.3."
eyebrow: Webhosting
lead: "Verzi PHP změníte v zákaznickém panelu bez restartu serveru."
cta:
  title: Potřebujete pomoc?
  text: "Nenašli jste odpověď? Otevřete ticket a náš tým vám pomůže."
  primary: { label: Kontaktovat podporu, href: /kontakt }
  secondary: { label: Zpět do znalostní báze, href: /znalostni-baze }
sample: false
---
## Změna verze PHP

Všechny plány ONhost podporují PHP 7.4, 8.0, 8.1, 8.2 a 8.3. Výchozí verze je PHP 8.3.

### Jak změnit verzi?

1. Přihlaste se do zákaznické zóny.
2. Přejděte do sekce **Moje služby → název služby**.
3. V záložce **Nastavení PHP** vyberte požadovanou verzi.
4. Změna se projeví okamžitě a bez výpadku.

### Jak zjistit aktuální verzi PHP

Ve složce `public_html` vytvořte soubor `phpinfo.php` s tímto obsahem:

```php
<?php phpinfo(); ?>
```

Otevřete ho v prohlížeči (`https://vasedomena.cz/phpinfo.php`). Uvidíte podrobné informace o konfiguraci PHP.

> **Důležité:** Po ověření soubor smažte.

### Doporučená verze

Pro nové projekty doporučujeme PHP 8.3. WordPress 6.x vyžaduje alespoň PHP 7.4, ideálně 8.1 a vyšší.
