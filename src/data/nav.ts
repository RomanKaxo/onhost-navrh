// Navigace podle sitemapy onhost.cz (39 stránek), seskupená podle toho, co návštěvník hledá.
export interface NavItem { label: string; href: string; note?: string }
export interface NavGroup { label: string; items: NavItem[] }

export const nav: NavGroup[] = [
  { label: 'Hosting', items: [
    { label: 'Webhosting', href: 'webhosting', note: 'Weby a firemní prezentace' },
    { label: 'WordPress hosting', href: 'wordpress-hosting', note: 'Optimalizováno pro WordPress' },
    { label: 'Managed hosting', href: 'managed-hosting', note: 'Správu převezmeme za vás' },
    { label: 'Gamehosting', href: 'gamehosting', note: 'Herní servery' },
    { label: 'Reseller hosting', href: 'reseller-hosting', note: 'Hosting pro vaše klienty' },
    { label: 'Website builder', href: 'website-builder', note: 'Web bez programování' },
  ]},
  { label: 'Servery', items: [
    { label: 'VPS', href: 'vps', note: 'Virtuální servery' },
    { label: 'Dedikované servery', href: 'dedikovane-servery', note: 'Celý stroj jen pro vás' },
    { label: 'Kolokace', href: 'kolokace', note: 'Váš hardware u nás' },
    { label: 'Databáze', href: 'databaze', note: 'Spravované databáze' },
    { label: 'Datacentrum', href: 'datacenter', note: 'Kde vaše data žijí' },
  ]},
  { label: 'Domény a bezpečnost', items: [
    { label: 'Domény', href: 'domeny', note: 'Registrace a převody' },
    { label: 'SSL certifikáty', href: 'ssl-certifikaty', note: 'Šifrované spojení' },
    { label: 'DDoS ochrana', href: 'ddos-ochrana', note: 'Ochrana před útoky' },
    { label: 'E-mail hosting', href: 'mailhosting', note: 'Firemní pošta' },
    { label: 'E-mail security', href: 'email-security', note: 'Ochrana pošty' },
  ]},
  { label: 'Pro vývojáře', items: [
    { label: 'Developer', href: 'developer', note: 'Nástroje pro vývojáře' },
    { label: 'AI asistent', href: 'funkce/ai-asistent', note: 'Pomocník v panelu' },
    { label: 'Monitoring', href: 'funkce/monitoring', note: 'Přehled o dostupnosti' },
    { label: 'Zálohy', href: 'funkce/zalohy', note: 'Data v bezpečí' },
  ]},
  { label: 'Podpora', items: [
    { label: 'Podpora', href: 'podpora' },
    { label: 'Znalostní báze', href: 'znalostni-baze' },
    { label: 'Časté dotazy', href: 'faq' },
    { label: 'Blog', href: 'blog' },
    { label: 'Kontakt', href: 'kontakt' },
    { label: 'O nás', href: 'o-nas' },
  ]},
];

export const legal: NavItem[] = [
  { label: 'Obchodní podmínky', href: 'obchodni-podminky' },
  { label: 'Ochrana osobních údajů', href: 'gdpr' },
  { label: 'Cookies', href: 'cookies' },
  { label: 'SLA', href: 'sla' },
  { label: 'Refundace', href: 'refundace' },
];

export const url = (path = '') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path}`.replace(/\/$/, '') || '/';
