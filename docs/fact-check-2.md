# Kontrola faktů 2

Rozsah: `reseller-hosting`, `website-builder`, `mailhosting`, `email-security`, `vps`.
Postup: porovnala se stránka `src/content/pages/<slug>.md` se zdrojem `content/source/<slug>.md` podle pravidel poctivosti v `docs/voice.md`. Níže jsou jen tvrzení s číslem, cenou, lhůtou, parametrem nebo garancí, která ve zdroji dané stránky nejsou. Ověřená tvrzení se nevypisují.

| stránka | tvrzení | stav | poznámka |
| --- | --- | --- | --- |
| reseller-hosting | „bez DPH“ (`description`, `priceNote`: „Ceny jsou uvedeny bez DPH.“) | jinde: obchodni-podminky.md | Zdroj uvádí jen „Kč499 /měs.“ atd. Obchodní podmínky: „Ceny jsou uvedeny bez DPH, není-li uvedeno jinak.“ Jde o obecné pravidlo, ne o údaj u reselleru. |
| website-builder | „WordPress si nainstalujte jedním kliknutím“ (FAQ) | jinde: webhosting.md | webhosting.md: „WordPress na 1 klik“. |
| website-builder | „Tarify začínají na 49 Kč měsíčně bez DPH“ (FAQ) | jinde: webhosting.md | Zdroj builderu uvádí „od 49 Kč/měs.“ bez zmínky o DPH. Formulaci „bez DPH“ potvrzuje webhosting.md (popis i poznámka k cenám). |
| mailhosting | Webmail `mail.vasedomena.cz` (`specs`) | jinde: znalostni-baze__jak-vytvorit-emailovou-schranku.md | |
| mailhosting | IMAP `imap.vasedomena.cz`, port 993 (SSL) (`specs`) | jinde: znalostni-baze__jak-vytvorit-emailovou-schranku.md | |
| mailhosting | POP3 `pop.vasedomena.cz`, port 995 (SSL) (`specs`) | jinde: znalostni-baze__jak-vytvorit-emailovou-schranku.md | |
| mailhosting | SMTP `smtp.vasedomena.cz`, port 587 (STARTTLS) (`specs`) | jinde: znalostni-baze__jak-vytvorit-emailovou-schranku.md | |
| email-security | „Ceny jsou uvedeny bez DPH.“ (`priceNote`) | jinde: obchodni-podminky.md | Zdroj stránky o DPH nic neuvádí. Platí jen obecné pravidlo z obchodních podmínek. |
| vps | „server zřídíme po úhradě zálohové faktury“ (krok 2) | jinde: obchodni-podminky.md | „Na základě objednávky je vystavena zálohová faktura; služba je zřízena po jejím uhrazení.“ |
| vps | SLA „99,9 % měsíčně (síť a napájení)“ (`specs`, FAQ) | jinde: sla.md | Shoda doslova. sla.md navíc vylučuje plánovanou údržbu oznámenou alespoň 24 h předem. Stránka tuto výjimku neuvádí. |
| vps | Kredit 5 % měsíční ceny za každou započatou hodinu, nejvýš 100 % (FAQ) | jinde: sla.md | Shoda. Podle sla.md se kredit připisuje do kreditní peněženky. |
| vps | Reakce podpory: urgentní do 1 h nepřetržitě, vysoká do 4 h, běžná do 1 pracovního dne (FAQ) | jinde: sla.md | Shoda. |
| vps | Povýšení kdykoli s poměrným doplatkem, přechod na nižší tarif ke konci fakturačního období (FAQ) | jinde: faq.md | faq.md to uvádí obecně, ne konkrétně pro VPS. |
| vps | „Službu můžete vypovědět kdykoli ke konci uhrazeného období“ (FAQ) | jinde: obchodni-podminky.md | Shoda. |
| vps | „Webhosting … od 49 Kč měsíčně bez DPH“ (tělo stránky) | jinde: webhosting.md | Zdroj VPS uvádí „od 49 Kč/měs.“ bez zmínky o DPH. |

Žádné tvrzení není ve stavu „nenalezeno“ ani „rozpor“ se zdroji.

## Rozpory uvnitř zdrojů (k ověření s ONhostem)

- **reseller-hosting.md:** v sekci „Zahrnuto ve všech plánech“ stojí „Neomezený počet zákazníků“, ale tarify uvádějí limit 10, 30 a 100 zákazníků. Stránka správně používá limity z tarifů a „neomezený“ vynechává.
- **mailhosting.md:** podtitulek tarifu Mail Enterprise zní „Neomezené schránky“, ale parametr uvádí „E-MAILY 250“. Stránka používá 250 a to sedí i s „250 u Managed WordPress“.
