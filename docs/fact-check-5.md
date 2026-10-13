# Fact-check 5: O nás, kontakt, podpora, časté dotazy, blog

Kontrola podle `docs/voice.md` (Poctivost). Každou stránku `src/content/pages/<slug>.md` jsem porovnal se zdrojem `content/source/<slug>.md`. V tabulce jsou jen tvrzení s číslem, cenou, lhůtou, parametrem nebo garancí, která ve zdroji dané stránky **nejsou**. Ověřená tvrzení nevypisuji.

| stránka | tvrzení | stav | poznámka |
| --- | --- | --- | --- |
| o-nas | „NVMe webhosting s SSL a monitoringem od 49 Kč měsíčně bez DPH.“ (cta.text) | jinde: webhosting.md | Cenu 49 Kč/měs. uvádí i zdroj o-nas.md, údaj „bez DPH“ ale ne. webhosting.md: „Tarify od 49 Kč/měs. bez DPH“ a „Ceny jsou uvedeny bez DPH.“ |

Na stránkách kontakt, podpora, faq a blog jsem žádné přidané tvrzení tohoto typu nenašel. Stav „nenalezeno“ ani „rozpor“ se nevyskytl.

## Mimo tabulku (k informaci)
- kontakt: odpověď ve FAQ vyjmenovává návody ve znalostní bázi „DNS, e-mail, SSL, nahrávání přes FTP a změnu verze PHP“. Zdroj kontakt.md uvádí „DNS, e-mail, SSL, WordPress a zálohy“. Nejde o číslo ani garanci a návody na FTP a PHP existují (`znalostni-baze__jak-nahrat-web-pres-ftp-sftp.md`, `znalostni-baze__jak-zmenit-verzi-php.md`). Výčet se jen liší od zdroje stránky.
- kontakt: tvrzení v CTA „průběh sledujete v reálném čase a zůstane vám v historii“ ve zdroji kontakt.md není. Má oporu v podpora.md. Je to funkce, ne číslo.
- blog.md (zdroj): karta „Kontaktujte nás“ slibuje „odpovíme do hodiny“, zdroj faq.md ale u ticketu uvádí „do 1 pracovního dne“. Stránka blog tento slib nepřebírá, jde jen o nesoulad mezi zdroji. Doporučuji ověřit u ONhostu.
- kontakt.md (zdroj): rozdílné PSČ (627 00 / 62800) a dva fakturační e-maily. Stránka to už nese jako komentář `<!-- ověřit -->`.
