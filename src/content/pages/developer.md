---
slug: developer
kind: product
title: Developer Tools
description: "Hosting pro vývojáře. SSH, Git deploy, REST API, Composer, Node.js, WP-CLI a staging prostředí. Plná kontrola nad prostředím."
eyebrow: Hosting pro vývojáře
lead: "SSH, Git, REST API a plná kontrola nad prostředím. Hosting navržený pro vývojáře."
planet: developer
highlights:
  - title: Git & Deploy
    text: "Push-to-deploy přes SSH. Composer install a migrace se spustí automaticky."
  - title: PHP 8.3 a rozšíření
    text: "Vyberte verzi PHP, nastavte php.ini a zapněte rozšíření. Vše přes panel."
  - title: MySQL a MariaDB
    text: "Plný přístup přes phpMyAdmin nebo SSH tunel. Importy bez limitů."
  - title: Redis a Memcached
    text: "Sdílené cache instance pro session, fronty a objektovou cache."
  - title: Let's Encrypt automaticky
    text: "SSL pro všechny domény a subdomény. Bez ručního zásahu."
  - title: REST API
    text: "Spravujte DNS, domény, služby a monitoring programově."
cta:
  title: Vyberte tarif pro svůj projekt
  text: "Tarify s SSH přístupem a Git deploy workflow. Naši technici znají PHP, Laravel i Nginx a rádi pomůžou."
  primary: { label: Zobrazit hostingové tarify, href: /webhosting }
  secondary: { label: Technická podpora, href: /podpora }
sample: false
---
## Moderní stack pro moderní projekty

Dáváme vývojářům plný přístup k serverovému prostředí. Nasazujte přes Git. Závislosti spravujte přes Composer. Deployment automatizujte webhooky.

- **PHP 8.1, 8.2, 8.3** — verzi přepnete za běhu
- **SSH přístup** — plná kontrola
- **Git deploy** — push = deploy
- **Composer, WP-CLI, Node.js**
- **Staging prostředí** — otestujte změny před nasazením
- **REST API** — správa účtu a služeb

## Ukázka Git deploy workflow

```bash
# Přidejte OnHost jako remote
git remote add onhost \
  ssh://onhost.cz/~/repo.git

# Push = automatický deploy
git push onhost main

# Výstup
remote: Deploying to production...
remote: Composer install OK
remote: Migrations OK
remote: ✓ Deploy complete
```

## Kam dál

- **Dokumentace API** — kompletní referenční dokumentace REST API s příklady.
- **Hostingové tarify** — vyberte tarif s SSH přístupem a Git deploy workflow.
- **Technická podpora** — naši technici znají PHP, Laravel i Nginx.
