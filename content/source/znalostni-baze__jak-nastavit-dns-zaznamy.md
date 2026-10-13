---
url: https://onhost.cz/znalostni-baze/jak-nastavit-dns-zaznamy
title: "Jak nastavit DNS záznamy pro vaši doménu — Znalostní báze OnHost — Onhost.cz"
description: "Průvodce nastavením A, CNAME, MX a TXT záznamů krok za krokem."
---

## Nadpisy
H1: Jak nastavit DNS záznamy pro vaši doménu
H2: Základní DNS záznamy
H3: A záznam
H3: CNAME záznam
H3: MX záznamy
H3: TXT záznamy
H2: Kde změnit DNS?

## Text
Onhost…
        
    

    
    
        
            
                novinka
                Spouštíme nové NVMe servery.
            
            
                
                    
        
        🇨🇿 CS
    
        
        🇬🇧 EN
    
    
                    
                    
                
            
        
    

    
        
            
                
                    
                        
                        
                    
                
                
            
        
    

    
    
    
    
    
        
            
                
                    
                        DNS a domény
                        Jak nastavit DNS záznamy pro vaši doménu
                                                    Průvodce nastavením A, CNAME, MX a TXT záznamů krok za krokem.
                                            
                
            
        
    

    
    
        
            

                
                
                    
                        
                            Základní DNS záznamy
DNS (Domain Name System) překládá doménová jména na IP adresy. Pro správnou funkci webu a e-mailu potřebujete nastavit tyto záznamy:
A záznam
Propojuje doménu s IP adresou serveru. Příklad:
onhost.cz.  IN  A  185.1.2.3
CNAME záznam
Alias — přesměrovává jednu doménu na jinou. Typicky se používá pro www:
www.onhost.cz.  IN  CNAME  onhost.cz.
MX záznamy
Definují poštovní server pro přijímání e-mailů. Mají prioritu (nižší číslo = vyšší priorita):
onhost.cz.  IN  MX  10  mail.onhost.cz.
TXT záznamy
Slouží pro SPF, DKIM a DMARC ověření e-mailů, a také pro ověření vlastnictví domény (Google Search Console, apod.).
Kde změnit DNS?
DNS záznamy upravujete u svého registrátora domén (např. WEDOS) nebo v zákaznické zóně Onhost.cz v sekci Domény → Záznamy DNS.
Pozor: Změna DNS se projeví za 15–60 minut (TTL), ale může trvat až 24 hodin.
                        
                    

                    
                    
                        
                            Zpět do znalostní báze
                        
                    
                

                
                

                    
                    
                    
                        Potřebujete pomoc?
                        Nenašli jste odpověď? Otevřete ticket a náš tým vám pomůže.
                        Kontaktovat podporu
                    

                    
                        Rychlé odkazy
                        
                            Celá znalostní báze
                            Časté dotazy
                            Blog a novinky
