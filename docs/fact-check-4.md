# Fact-check 4: SSL certifikáty, domény, datacentrum, AI asistent, monitoring, zálohy

Kontrola podle `docs/voice.md` (Poctivost). Každou stránku `src/content/pages/<slug>.md` jsem porovnal se zdrojem `content/source/<slug>.md` (`/` ve slugu = `__` v názvu zdroje). V tabulce jsou jen tvrzení s číslem, cenou, lhůtou, parametrem nebo garancí, která ve zdroji dané stránky **nejsou**. Ověřená tvrzení nevypisuji.

| stránka | tvrzení | stav | poznámka |
| --- | --- | --- | --- |
| ssl-certifikaty | „Ceny jsou uvedeny bez DPH.“ (priceNote) a „… ročně bez DPH“ (description) | jinde: obchodni-podminky.md | V ssl-certifikaty.md o DPH nic není. VOP: „Ceny jsou uvedeny bez DPH, není-li uvedeno jinak.“ Doporučuji ověřit u ONhostu. |
| domeny | „Ne. Registr účtuje registraci domény nevratně, proto se na domény garance vrácení peněz nevztahuje.“ (FAQ) | jinde: refundace.md | refundace.md: „Garance se nevztahuje na registrace domén (registr je zpoplatňuje nevratně)“. |
| domeny | „…doménu zaregistrujeme po úhradě.“ (steps) | jinde: obchodni-podminky.md | VOP: „vystavena zálohová faktura; služba je zřízena po jejím uhrazení“. |
| datacenter | „Pronajmete celý rack, půlrack nebo jednotlivé pozice.“ (FAQ) | jinde: kolokace.md | kolokace.md: „Pronájem celých racků (42U), půl-racků nebo jednotkových prostorů (U).“ |
| funkce/ai-asistent | „Popište problém nebo projekt česky“ (steps); „AI asistent i ticketová podpora fungují v češtině.“ (FAQ) | jinde: webhosting.md | webhosting.md: „Ticketová podpora a AI asistent v češtině.“ Zdroj stránky češtinu neuvádí. |
| funkce/ai-asistent | „urgentní výpadky řešíme s reakcí do 1 hodiny, nepřetržitě“ (FAQ) | jinde: sla.md | Zdroj stránky uvádí jen „reakcí do 1 hodiny pro urgentní výpadky“. Slovo „nepřetržitě“ kryje sla.md: „reakce do 1 hodiny, řešíme nepřetržitě“. |
| funkce/monitoring | „Za každou započatou hodinu nad rámec SLA vám na vyžádání připíšeme kredit 5 % měsíční ceny.“ (FAQ) | jinde: sla.md | sla.md: 5 % měsíční ceny za každou započatou hodinu, max. 100 %, do kreditní peněženky. Strop 100 % stránka neuvádí. |
| funkce/zalohy | „Každý VPS má denní zálohy s retencí 14 dní a … ruční snapshot.“ (FAQ) | jinde: vps.md | vps.md: „Denní zálohy s retencí 14 dní a manuální snapshoty před každým nasazením.“ |

Stav „nenalezeno“ ani „rozpor“ se u přidaných tvrzení nevyskytl.

## Mimo tabulku (k informaci)
- domeny.md: zdroj si sám odporuje. Popis a karta „Přenos domény“ říkají „Přenos domény zdarma“ / „Zdarma“, tabulka ceníku ale u převodu uvádí ceny (např. .cz 199 Kč). Stránka přebírá ceny z tabulky („u .cz je to 199 Kč bez DPH“, sloupec „Převod“). Doporučuji ověřit u ONhostu, která verze platí.
- ssl-certifikaty.md: zdroj zmiňuje OV a EV certifikáty („Od bezplatného Let's Encrypt až po EV certifikáty“), v tarifech jsou ale jen DV. Stránka OV/EV nezmiňuje. Nejde o přidané tvrzení, jen o upozornění na nesoulad ve zdroji.
