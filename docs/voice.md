# Tón a textace ONhostu

_Platí pro všechny texty návrhu. Doplňuje `docs/brief.md` (fakta, schéma, logo)._

## Komu píšeme
Majitel malé firmy, freelancer, vývojář nebo správce e-shopu. Nechce studovat servery; chce, aby web běžel, a když ne, aby to někdo vyřešil. Vývojář chce přesné parametry bez marketingové vaty.

## Jak zníme
- **Klidná jistota.** Prémiovost dělá přesnost a vzduch, ne hlasitost. Žádné vykřičníky, žádné „nejlepší“, „revoluční“, „bezkonkurenční“.
- **Nejdřív užitek, pak důkaz.** Věta říká, co zákazník získá; hned za ní stojí mechanismus nebo číslo, které to dokládá („Zálohujeme každou noc. Obnovu spustíte jedním kliknutím v klientské zóně.“).
- **Krátké věty, aktivní slovesa, vykání** (malé „vy/váš“). Jedna myšlenka na větu.
- **Odborné termíny tam, kde je čtenář čeká** (root, DNS, PHP, NVMe), jinak česky („zálohy“, ne „backupy“).
- **Vesmír jen jako koření:** nejvýš jedna metafora na stránku, a to v nadpisu (H1 nebo výzva k akci), nikdy ve faktech. Slovník: zapnout, start, oběžná dráha, souhvězdí, vesmír. Motiv vypínače („zapnout“) je hlavní.

## Struktura stránky produktu
| Pole | Pravidlo |
| --- | --- |
| `title` | Název produktu, jak ho zná nabídka („Webhosting“). Používá se v navigaci a v `<title>`. |
| `headline` | Velký nadpis H1: výsledek pro zákazníka, max. 7 slov („Web, který prostě běží.“). |
| `eyebrow` | 1–3 slova, kategorie („Hosting pro weby“). |
| `lead` | 1–2 věty, max. ~170 znaků: pro koho + výsledek + jeden konkrétní důkaz. |
| `included` | 3–6 krátkých položek „v ceně“ (2–4 slova, bez teček). |
| `highlights` | 3–6 výhod. `title` = užitek ve 2–5 slovech; `text` = jak to funguje + fakt, max. ~150 znaků. |
| `steps` | Volitelně 3 kroky „jak začít“ (titulek + 1 věta). Jen skutečný postup. |
| `specs` | Volitelně technické parametry z živého webu (`label`/`value`), pro vývojáře. |
| `plans` | Jen ceny a parametry z živého webu, beze změny čísel. |
| `priceNote` | Např. „Ceny jsou uvedeny bez DPH.“ |
| `faq` | 3–6 skutečných námitek (cena, migrace, závazek, rychlost podpory, růst). Odpověď začíná „Ano.“/„Ne.“ nebo faktem. |
| `cta` | `title` = výzva (smí nést metaforu), `text` = 1 věta, tlačítka = sloveso + předmět („Vybrat tarif“, „Ověřit doménu“, „Napsat podpoře“). |
| `related` | 2–3 slugy příbuzných stránek. |

## Poctivost (závazné)
- Každé číslo, lhůta, parametr nebo garance musí být v `content/source/*.md`. Co tam není, nepíšeme — nebo to označíme `sample: true` a v textu komentářem `<!-- ukázkový text -->`.
- Žádné recenze, počty zákazníků, ocenění ani srovnání s konkurencí, pokud nejsou v podkladech.
- Ceny přebíráme přesně (včetně „bez DPH“, je-li uvedeno).

## Slovník
klientská zóna · tarif · doména · SSL certifikát · zálohy · NVMe disk · podpora · ticket · AI asistent · datacentrum (ne „datacenter“ v textu; slug zůstává) · ONhost (v textu takto).
