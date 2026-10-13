---
slug: vps
kind: product
title: Cloud / VPS
description: "Virtuální servery KVM s NVMe, plným root přístupem a IPv4 i /64 IPv6 v ceně. Denní zálohy a DDoS ochrana. Od 149 Kč měsíčně bez DPH."
eyebrow: Virtuální servery KVM
headline: "Výkon, který nesdílíte s nikým."
lead: "Virtuální server pro aplikace, e-shopy i CI. KVM izolace, lokální NVMe a plný root přístup v každém tarifu, od 149 Kč měsíčně bez DPH."
planet: vps
included:
  - KVM virtualizace
  - NVMe SSD úložiště
  - Plný root přístup
  - IPv4 a /64 IPv6
  - Denní zálohy (14 dní)
  - Anti-DDoS ochrana
highlights:
  - title: Výkon bez hlučných sousedů
    text: "KVM izoluje vCPU, RAM i I/O mezi zákazníky. CPU vlákna máte dedikovaná, ne sdílená."
  - title: Disky pro náročná data
    text: "Lokální NVMe pole s vysokým IOPS. Pro databáze, cache i náročné aplikace."
  - title: Nasazujete bez obav
    text: "Před každým zásahem si uděláte snapshot. Denní zálohy uchováváme 14 dní a obnovu spustíte sami v klientské zóně."
  - title: Nízká latence, ochrana v ceně
    text: "Gigabitové uplinky v českém datacentru. DDoS ochranu neplatíte zvlášť."
  - title: Adresy bez příplatku
    text: "Dedikovaná IPv4 a celý /64 IPv6 prefix v každém tarifu."
  - title: Správa podle potřeby
    text: "Od holého serveru po plně spravované řešení s OS, aktualizacemi a monitoringem."
steps:
  - title: Vyberte tarif a systém
    text: "Zvolte velikost serveru a Linux, Windows Server nebo vlastní ISO na vyžádání."
  - title: Dokončete objednávku
    text: "Objednáte v klientské zóně, server zřídíme po úhradě zálohové faktury."
  - title: Přihlaste se jako root
    text: "Systém nainstalujeme automaticky při zřízení a server předáme s plným root přístupem."
specs:
  - label: Virtualizace
    value: "KVM, dedikovaná CPU vlákna"
  - label: Úložiště
    value: "Lokální NVMe SSD"
  - label: Síť
    value: "Gigabitové uplinky, české datacentrum"
  - label: IP adresy
    value: "Dedikovaná IPv4, /64 IPv6"
  - label: Linux
    value: "Debian 12, Ubuntu 24.04 LTS, AlmaLinux 9, Rocky Linux 9"
  - label: Windows
    value: "Windows Server 2022, Windows Server 2019"
  - label: Vlastní systém
    value: "Vlastní ISO na vyžádání"
  - label: Panely (volitelně)
    value: "cPanel, Plesk, DirectAdmin"
  - label: Doplňky
    value: "IPMI / KVM konzole, rDNS záznam"
  - label: Zálohy
    value: "Denně, retence 14 dní, ruční snapshoty"
  - label: SLA
    value: "99,9 % měsíčně (síť a napájení)"
plans:
  - name: VPS Nano
    price: "149 Kč"
    period: "měsíc"
    features: ["Testovací projekty a CI", "1 CPU", "RAM 1 GB", "Disk 20 GB", "Data 500 GB"]
    featured: false
  - name: VPS Starter
    price: "299 Kč"
    period: "měsíc"
    features: ["Malé aplikace a weby", "2 CPU", "RAM 2 GB", "Disk 40 GB", "Data 1 000 GB"]
    featured: false
  - name: VPS Business
    price: "599 Kč"
    period: "měsíc"
    features: ["Produkční projekty", "4 CPU", "RAM 4 GB", "Disk 80 GB", "Data 2 000 GB"]
    featured: true
  - name: VPS Pro
    price: "999 Kč"
    period: "měsíc"
    features: ["Náročné aplikace a e-shopy", "8 CPU", "RAM 8 GB", "Disk 160 GB", "Data 4 000 GB"]
    featured: false
priceNote: "Ceny jsou uvedeny bez DPH."
faq:
  - q: Mohu tarif později zvětšit?
    a: "Ano. Tarif lze kdykoli povýšit a rozdíl ceny se dopočítá poměrně. Na nižší tarif přejdete ke konci fakturačního období."
  - q: Jakou dostupnost garantujete?
    a: "99,9 % měsíčně pro síť a napájení. Při výpadku nad rámec SLA vám na vyžádání připíšeme kredit 5 % měsíční ceny za každou započatou hodinu, nejvýš 100 %."
  - q: Mohu použít vlastní systém?
    a: "Ano. Vlastní ISO je k dispozici na vyžádání. Jinak vybíráte z Debianu 12, Ubuntu 24.04 LTS, AlmaLinuxu 9, Rocky Linuxu 9 a Windows Serveru 2019 nebo 2022."
  - q: Musím server spravovat sám?
    a: "Ne. Vedle holého serveru nabízíme i plně spravované řešení s OS, aktualizacemi a monitoringem. Napište nám, jakou správu potřebujete."
  - q: Jak rychle reaguje podpora?
    a: "Na urgentní výpadky do 1 hodiny, nepřetržitě. Vysokou prioritu řešíme do 4 hodin, běžné dotazy do 1 pracovního dne."
  - q: Zavazuji se na delší dobu?
    a: "Ne. Službu můžete vypovědět kdykoli ke konci uhrazeného období."
cta:
  title: Zapněte svůj server
  text: "S výběrem tarifu i konfigurací poradíme, odpovíme do 1 hodiny."
  primary: { label: Vybrat tarif, href: "#tarify" }
  secondary: { label: Poradit se s výběrem, href: /kontakt }
related: [webhosting, dedikovane-servery, ddos-ochrana]
sample: false
---
## VPS, webhosting, nebo dedikovaný server?

- **Webhosting**, když nechcete spravovat server. Rychlý NVMe hosting od 49 Kč měsíčně bez DPH.
- **Cloud VPS**, když potřebujete root, vlastní systém a výkon, který nesdílíte s ostatními zákazníky.
- **Dedikovaný server**, když projekt potřebuje celý fyzický stroj, IPMI přístup a sestavu na míru.
