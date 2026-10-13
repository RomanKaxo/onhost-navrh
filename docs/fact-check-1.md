# Kontrola faktů 1

Rozsah: `home`, `webhosting`, `wordpress-hosting`, `managed-hosting`, `gamehosting`.
Každou stránku v `src/content/pages/<slug>.md` jsem porovnal s jejím zdrojem v `content/source/<slug>.md`. Pravidla jsou v `docs/voice.md` v části Poctivost.
Tabulka obsahuje jen tvrzení s číslem, cenou, lhůtou, parametrem nebo garancí, která ve zdroji dané stránky nejsou. Ověřená tvrzení neuvádím.

| stránka | tvrzení | stav | poznámka |
| --- | --- | --- | --- |
| home | „NVMe discích s PHP 8.3 a OPcache“ (highlights) | jinde: webhosting.md | Ve zdroji home.md je jen NVMe a PHP 8.3, OPcache tam chybí. |
| home | „Dostupnost kontrolujeme každou minutu“ (highlights) | jinde: webhosting.md | home.md uvádí jen „Monitoring 24/7“. |
| home | „u platby kartou obvykle do minuty“ (steps, FAQ) | jinde: faq.md | Řádek 137. |
| home | „S přenosem webu, e-mailů i domény vám zdarma pomůže podpora“ | jinde: faq.md | Řádek 141. |
| home | „Tarif kdykoli zvýšit, rozdíl se dopočítá poměrně; snížit ke konci fakturačního období“ | jinde: faq.md | Řádek 145. Zdroje se liší v tom, jak se doplatek počítá. webhosting.md (ř. 581) píše: „přeplatek za aktuální měsíc se přičte jako kredit“. Mechanismus je potřeba sjednotit. |
| home | „Kartou přes Comgate (Visa, Mastercard), převodem nebo z kreditu“ | jinde: faq.md | Řádek 166. |
| home | „Zrušíte kdykoli ke konci uhrazeného období, bez výpovědní lhůty“ | jinde: faq.md | Řádek 196. |
| home | „U nových webhostingových tarifů 30denní garance vrácení peněz“ | jinde: refundace.md | Řádek 77. faq.md uvádí jen „u webhostingu“. |
| home | „Na urgentní výpadky reagujeme do 1 hodiny, 24/7“ | jinde: podpora.md | Řádek 142, také funkce__monitoring.md ř. 197. |
| home | „AI asistent v klientské zóně odpovídá okamžitě“ | jinde: podpora.md | Řádek 101, také faq.md ř. 192. |
| home | „SLA garantuje dostupnost 99,9 % měsíčně“ | jinde: sla.md | home.md uvádí „99,9% SLA“, ale bez „měsíčně“. Upřesnění je v sla.md ř. 78. |
| webhosting | „30denní garance vrácení peněz“ (description, FAQ, CTA) | jinde: refundace.md | Řádek 77. |
| webhosting | „Garance se nevztahuje na registraci domén“, „bez udání důvodu“ | jinde: refundace.md | Řádek 77. Podle zdroje se garance nevztahuje ani na služby zřízené na míru, stránka to vynechává. |
| webhosting | „Platit kartou, bankovním převodem nebo z kreditu“ (steps) | jinde: faq.md | Řádek 166. |
| webhosting | „Web nahrajete přes FTP či SFTP; s přenosem pomůžeme zdarma“ (steps) | jinde: faq.md | Řádky 141 a 183. Návod je ve znalostni-baze__jak-nahrat-web-pres-ftp-sftp.md. |
| webhosting | „PHP výchozí 8.3, verzi přepnete v klientské zóně“ (specs) | jinde: znalostni-baze__jak-zmenit-verzi-php.md | Řádek 85. Zdroje se v rozsahu verzí liší: KB uvádí 7.4–8.3, srovnávací tabulka ve webhosting.md 8.0–8.3. Stránka žádný rozsah neuvádí. |
| webhosting | „Databáze: MySQL, MariaDB“ (specs) | jinde: home.md | Ve webhosting.md je jen MySQL. home.md uvádí „PHP 8.3 / MySQL / MariaDB“. |
| webhosting | „FTP/SFTP, SSH podle tarifu“ (specs) | jinde: faq.md | Řádek 183. |
| webhosting | „SLA: dostupnost 99,9 % měsíčně“ (specs, FAQ) | jinde: sla.md | webhosting.md uvádí „99.9%“, ale bez „měsíčně“. |
| webhosting | „Při nedodržení SLA na vyžádání připíšeme kompenzaci do kreditu“ (FAQ) | jinde: sla.md | Řádek 91: kredit 5 % měsíční ceny za hodinu, nejvýš 100 %. |
| wordpress-hosting | „Tarif později kdykoli zvýšíte“ (steps) | jinde: faq.md | Řádek 145. |
| wordpress-hosting | „Kdykoli zvýšit, rozdíl poměrně; snížit ke konci fakturačního období“ (FAQ) | jinde: faq.md | Řádek 145. Mechanismus se liší od webhosting.md, viz řádek home výše. |
| managed-hosting | „Službu můžete kdykoli vypovědět ke konci uhrazeného období“ (FAQ) | jinde: faq.md | Řádek 196. Jde o obecné pravidlo, managed-hosting.md o závazku nic neříká. |
| gamehosting | „Sáhněte po VPS s plným root přístupem“ (FAQ) | jinde: vps.md | Řádek 71. |

## Rozpory uvnitř zdrojů (k zvážení)

Tato tvrzení na stránkách ve zdroji jsou. Zdroj si ale sám odporuje, proto je uvádím zvlášť.

- **webhosting – retence záloh.** Stránka uvádí 14 dní pro všechny tarify. webhosting.md uvádí v boxu „V ceně každého tarifu“ 14 dní, ale srovnávací tabulka (Start/Business/Agency) dává Startu jen 7 dní. Tabulka navíc obsahuje jiné tarify a parametry (Agency 249 Kč, Start 10 GB), než má ceník, který stránka přebírá.
- **gamehosting – ping.** Stránka uvádí „pod 5 ms“ podle gamehosting.md. Recenze v home.md uvádí „pod 20 ms“. Stránka recenzi nepoužívá.
- **home – automatické zřízení a WordPress na 1 klik.** V home.md mají poznámku „(mock režim)“. faq.md ř. 137 popisuje zřízení jako plně automatické bez této výhrady. Stav je potřeba ověřit před spuštěním.

Nenalezeno: žádné tvrzení. Všechna nalezená mají podklad v jiném souboru `content/source/*.md`.
