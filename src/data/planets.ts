// Každý produkt má vlastní planetu, vždy jen z barev brandmanuálu.
// c1 = světlá strana, c2 = tmavší pás, ring = prstenec, moons = počet měsíců.
export interface PlanetLook { c1: string; c2: string; ring?: boolean; moons?: number; bands?: boolean }
const pink = '#E91E7A', hot = '#F72585', lilac = '#BB88EB', lilac200 = '#E0BEFF', lilac50 = '#F1E2FF', brand = '#3C096C';
export const planets: Record<string, PlanetLook> = {
  web: {c1: hot, c2: brand, ring: true, moons: 1},
  wordpress: {c1: lilac, c2: brand, moons: 1, bands: true},
  managed: {c1: lilac200, c2: pink, ring: true},
  game: {c1: hot, c2: '#7a1a8a', moons: 2, bands: true},
  reseller: {c1: lilac, c2: pink, moons: 3},
  builder: {c1: lilac50, c2: lilac, ring: true},
  mail: {c1: lilac200, c2: brand, moons: 1},
  'email-security': {c1: pink, c2: brand, ring: true, bands: true},
  vps: {c1: lilac, c2: '#2C0A3E', moons: 2, bands: true},
  dedicated: {c1: pink, c2: '#2C0A3E', ring: true, moons: 1},
  colo: {c1: lilac200, c2: '#2C0A3E', bands: true},
  ddos: {c1: hot, c2: brand, ring: true, bands: true},
  database: {c1: lilac, c2: pink, ring: true, moons: 1},
  developer: {c1: lilac50, c2: brand, moons: 2},
  ssl: {c1: lilac200, c2: pink, moons: 1},
  domains: {c1: pink, c2: lilac, ring: true},
  datacenter: {c1: lilac, c2: brand, ring: true, moons: 3},
  ai: {c1: hot, c2: lilac, moons: 1, bands: true},
  monitoring: {c1: lilac200, c2: brand, ring: true},
  backups: {c1: lilac, c2: '#2C0A3E', moons: 2},
  support: {c1: pink, c2: brand, moons: 1},
  company: {c1: lilac, c2: brand, ring: true},
  knowledge: {c1: lilac200, c2: brand, bands: true, moons: 1},
  legal: {c1: lilac50, c2: brand},
};
export const planetFor = (key?: string): PlanetLook => planets[key ?? ''] ?? planets.web;
