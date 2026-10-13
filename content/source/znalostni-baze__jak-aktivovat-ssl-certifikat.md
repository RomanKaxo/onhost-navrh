---
url: https://onhost.cz/znalostni-baze/jak-aktivovat-ssl-certifikat
title: "Jak aktivovat SSL certifikát na hostingu — Znalostní báze OnHost — Onhost.cz"
description: "Let's Encrypt SSL certifikát je v ceně hostingu a aktivuje se automaticky."
---

## Nadpisy
H1: Jak aktivovat SSL certifikát na hostingu
H2: SSL certifikát na Onhost.cz
H3: Automatická aktivace
H3: Přesměrování HTTP → HTTPS
H3: Obnovení certifikátu
H3: Prémiový SSL

## Text
Onhost…
        
    

    
    
        
            
                novinka
                Spouštíme nové NVMe servery.
            
            
                
                    
        
        🇨🇿 CS
    
        
        🇬🇧 EN
    
    
                    
                    
                
            
        
    

    
        
            
                
                    
                        
                        
                    
                
                
            
        
    

    
    
    
    
    
        
            
                
                    
                        SSL a bezpečnost
                        Jak aktivovat SSL certifikát na hostingu
                                                    Let's Encrypt SSL certifikát je v ceně hostingu a aktivuje se automaticky.
                                            
                
            
        
    

    
    
        
            

                
                
                    
                        
                            SSL certifikát na Onhost.cz
Každý webhosting zahrnuje bezplatný Let's Encrypt SSL certifikát, který se aktivuje automaticky po nastavení DNS na náš server.
Automatická aktivace

Nastavte A záznam domény na IP adresu vašeho hostingového serveru.
Počkejte na propagaci DNS (15–60 minut).
SSL certifikát se aktivuje automaticky do hodiny.

Přesměrování HTTP → HTTPS
Pro automatické přesměrování přidejte do souboru .htaccess ve složce public_html:
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
Obnovení certifikátu
Let's Encrypt certifikát platí 90 dní a obnovuje se automaticky. Nemusíte nic dělat.
Prémiový SSL
Pokud potřebujete rozšířenou validaci (OV/EV) nebo wildcard certifikát, kontaktujte nás na kontaktním formuláři.
                        
                    

                    
                    
                        
                            Zpět do znalostní báze
                        
                    
                

                
                

                    
                    
                    
                        Potřebujete pomoc?
                        Nenašli jste odpověď? Otevřete ticket a náš tým vám pomůže.
                        Kontaktovat podporu
                    

                    
                        Rychlé odkazy
                        
                            Celá znalostní báze
                            Časté dotazy
                            Blog a novinky
