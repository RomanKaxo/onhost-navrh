---
slug: developer
kind: product
title: Developer Tools
description: "Hosting pro vývojáře: SSH, Git push-to-deploy, Composer, Node.js, WP-CLI, staging, PHP 8.1–8.3 a REST API pro správu služeb."
eyebrow: Hosting pro vývojáře
headline: "Nasazujete přes git push. Zbytek proběhne sám."
lead: "Pro vývojáře, kteří chtějí plnou kontrolu nad prostředím: SSH, push-to-deploy přes Git, Composer, Node.js a REST API pro správu služeb."
planet: developer
included:
  - SSH přístup
  - Git deploy
  - PHP 8.1 až 8.3
  - Composer, WP-CLI, Node.js
  - Staging prostředí
  - REST API
highlights:
  - title: Push je deploy
    text: "Push-to-deploy přes SSH. Composer install a migrace se spustí automaticky."
  - title: PHP podle projektu
    text: "Verzi 8.1, 8.2 nebo 8.3 přepnete za běhu. php.ini a rozšíření nastavíte v panelu."
  - title: Plný přístup k databázím
    text: "MySQL a MariaDB přes phpMyAdmin nebo SSH tunel. Importy bez limitů."
  - title: Cache po ruce
    text: "Sdílené instance Redis a Memcached pro session, fronty a objektovou cache."
  - title: HTTPS bez ruční práce
    text: "Let's Encrypt pro všechny domény a subdomény, bez ručního zásahu."
  - title: Automatizace přes API
    text: "DNS, domény, služby i monitoring spravujete programově přes REST API."
steps:
  - title: Vyberte tarif s SSH
    text: "Zvolte hostingový tarif s SSH přístupem a Git deploy workflow."
  - title: Propojte repozitář
    text: "Hosting přidáte do svého Git repozitáře jako remote přes SSH."
  - title: Pushněte
    text: "Jeden git push spustí deploy včetně Composer install a migrací."
specs:
  - label: PHP
    value: "8.1, 8.2, 8.3; přepínání za běhu, vlastní php.ini"
  - label: Přístup
    value: "SSH, SFTP, FTP (dle tarifu)"
  - label: Deploy
    value: "Git push-to-deploy přes SSH, webhooky"
  - label: Nástroje
    value: "Composer, WP-CLI, Node.js"
  - label: Databáze
    value: "MySQL, MariaDB; phpMyAdmin, SSH tunel"
  - label: Cache
    value: "Redis, Memcached (sdílené instance)"
  - label: SSL
    value: "Let's Encrypt, automaticky pro domény i subdomény"
  - label: API
    value: "REST: DNS, domény, služby, monitoring"
  - label: Prostředí
    value: "Staging před nasazením do produkce"
faq:
  - q: Mají SSH všechny tarify?
    a: "Ne. SSH, stejně jako FTP a SFTP, je k dispozici podle tarifu. Při výběru hledejte tarif s SSH přístupem a Git deploy."
  - q: Co se stane po git push?
    a: "Spustí se automatický deploy: Composer install a migrace. Průběh vidíte přímo ve výstupu příkazu."
  - q: Mohu změny vyzkoušet před nasazením?
    a: "Ano. Ve staging prostředí otestujete změny dřív, než půjdou do produkce."
  - q: Potřebuji root přístup. Je to možné?
    a: "Ano, na Cloud VPS. Ten nabízí plný root přístup, KVM virtualizaci a vlastní systém, od 149 Kč měsíčně bez DPH."
  - q: Poradí podpora i s frameworkem?
    a: "Ano. Naši technici znají PHP, Laravel i Nginx. Na urgentní výpadky reagujeme do 1 hodiny, nepřetržitě."
cta:
  title: Zapněte deploy na jeden příkaz
  text: "Vyberte hostingový tarif s SSH přístupem a Git deploy workflow."
  primary: { label: Vybrat hosting, href: /webhosting }
  secondary: { label: Napsat podpoře, href: /podpora }
related: [webhosting, vps, databaze]
sample: false
---
## Jak vypadá deploy přes Git

```bash
# Push = automatický deploy
git push

# Výstup
remote: Deploying to production...
remote: Composer install OK
remote: Migrations OK
remote: ✓ Deploy complete
```
