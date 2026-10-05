export const guestPrimaryNavigation = [
  ['home', 'Главная'],
  ['nearby', 'Рядом'],
  ['qr', 'QR'],
  ['events', 'Афиша'],
  ['more', 'Ещё'],
] as const

export const guestAccountPages = new Set([
  'profile', 'bonuses', 'history', 'favorites', 'notifications', 'communications', 'review',
])
