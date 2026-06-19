export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nexxo.design'
export const SITE_NAME = 'Nexxo'
export const CONTACT_WHATSAPP = 'https://wa.me/57XXXXXXXXXX'
export const CONTACT_CALENDLY = 'https://calendly.com/nexxo/intro'

// Nav links — update when routes are finalised
export const NAV_LINKS = [
  { href: '/work',      label: 'Work' },
  { href: '/nosotros',  label: 'Estudio' },
  { href: '/journal',   label: 'Journal' },
  { href: '/contact',   label: 'Contacto' },
] as const
