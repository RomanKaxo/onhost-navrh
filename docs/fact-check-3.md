# Fact-check 3: dedikované servery, kolokace, DDoS ochrana, databáze, developer

Kontrola podle `docs/voice.md` (Poctivost). Každá stránka `src/content/pages/<slug>.md` je porovnaná se zdrojem `content/source/<slug>.md`. Tabulka uvádí jen tvrzení s číslem, cenou, lhůtou, parametrem nebo garancí, která ve zdroji dané stránky **nejsou**. Ověřená tvrzení nevypisuji.

| stránka | tvrzení | stav | poznámka |
| --- | --- | --- | --- |
| dedikovane-servery | „Po úhradě zálohové faktury server zřídíme…“ (steps) | jinde: obchodni-podminky.md | VOP: „vystavena zálohová faktura; služba je zřízena po jejím uhrazení“. |
| dedikovane-servery | SLA „99,9 % měsíčně (síť a napájení)“ (specs, FAQ) | jinde: sla.md | Zdroj stránky uvádí jen „SLA 99,9 %“. Upřesnění „měsíčně (síť a napájení)“ je v sla.md. |
| dedikovane-servery | „Při výpadku nad rámec SLA vám na vyžádání připíšeme kredit podle SLA.“ (FAQ) | jinde: sla.md | sla.md: 5 % měsíční ceny za každou započatou hodinu, max. 100 %, do kreditní peněženky. |
| ddos-ochrana | „kolokace volitelně“ (specs: Dostupnost) | jinde: kolokace.md | kolokace.md: „Volitelná DDoS filtrační vrstva na síťovém hraničním routeru“. |
| ddos-ochrana | „Dedikované servery mají pokročilou DDoS ochranu a na vyžádání i BGP session. U kolokace je filtrační vrstva na hraničním routeru volitelná.“ (FAQ) | jinde: dedikovane-servery.md, kolokace.md | Obsahově sedí s oběma zdroji. |
| databaze | „Ceny jsou uvedeny bez DPH.“ (priceNote) | jinde: obchodni-podminky.md | V databaze.md o DPH nic není. VOP: „Ceny jsou uvedeny bez DPH, není-li uvedeno jinak.“ Doporučuji ověřit u ONhostu, protože zdroj stránky to výslovně neuvádí. |
| databaze | Správa databáze a automatické aktualizace jen v tarifech Pro a Enterprise (highlights, plans, FAQ) | nenalezeno | Ve zdroji jsou buňky tabulky tarifů prázdné (fajfky se nestáhly), takže rozdělení funkcí mezi tarify z podkladu nevyplývá. Zdroj naopak píše obecně: „Plně spravováno: aktualizace, zálohy a monitoring zajišťujeme my.“ |
| databaze | „Kontrolní panel“ jen u tarifů Starter (plans) | rozpor | Ze zdroje se rozdělení po tarifech nedá ověřit. Zdroj i stránka (included, steps, highlights) přitom mluví o webovém panelu pro všechny. Tarify Pro a Enterprise ho v seznamu nemají. |
| developer | Přístup „SSH, SFTP, FTP (dle tarifu)“; „Mají SSH všechny tarify? Ne.“ (specs, FAQ) | jinde: faq.md | faq.md: „dle tarifu FTP/SFTP/SSH přístup“. Zdroj stránky zmiňuje jen SSH. |
| developer | „Cloud VPS: plný root přístup, KVM virtualizace a vlastní systém, od 149 Kč měsíčně bez DPH“ (FAQ) | jinde: vps.md | vps.md: „plným root přístupem… VPS od 149 Kč/měs. bez DPH“. Formulaci „vlastní systém“ kryje „vlastní ISO“. |
| developer | „Na urgentní výpadky reagujeme do 1 hodiny, nepřetržitě.“ (FAQ) | jinde: sla.md, podpora.md | sla.md: „reakce do 1 hodiny, řešíme nepřetržitě“. |

U stránky **kolokace** jsem nenašel žádné tvrzení mimo její zdroj.

## Mimo tabulku (k informaci)
- kolokace.md: zdroj sám uvádí dvě různá čísla, „Tier III — SLA 99,982% dostupnost“ a „SLA záruka 99,99%“. Stránka je odlišuje („Standard: Tier III, dostupnost 99,982 %“ a „SLA kolokace 99,99 %“). V sla.md kolokace uvedená není. Doporučuji ověřit u ONhostu.
- databaze.md: stránka vynechala řádky „Vysoká dostupnost“ a „Garancia vrácení peněz“ z tabulky tarifů. Nejde o přidané tvrzení, jen o vynechání.
