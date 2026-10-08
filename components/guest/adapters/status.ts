import type {MiraMode} from '@/components/design-system/tokens'

export type GuestPresentationTone = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'pending'
export type GuestStatusPresentation = { tone: GuestPresentationTone; label: string }

const order: Record<string, GuestStatusPresentation> = {
  created: {tone: 'info', label: 'Заказ создан'},
  submitted: {tone: 'pending', label: 'Заказ отправлен'},
  accepted: {tone: 'info', label: 'Принят кухней'},
  in_progress: {tone: 'warning', label: 'Готовится'},
  ready: {tone: 'success', label: 'Готово'},
  served: {tone: 'success', label: 'Подано'},
  completed: {tone: 'success', label: 'Завершён'},
  error: {tone: 'error', label: 'Ошибка передачи'},
  cancelled: {tone: 'neutral', label: 'Отменён'},
}
const call: Record<string, GuestStatusPresentation> = {
  created: {tone: 'pending', label: 'Запрос отправлен'},
  accepted: {tone: 'info', label: 'Принят сотрудником'},
  completed: {tone: 'success', label: 'Завершён'},
  cancelled: {tone: 'neutral', label: 'Отменён'},
}
const payment: Record<string, GuestStatusPresentation> = {
  pending: {tone: 'pending', label: 'Ожидает подтверждения'},
  succeeded: {tone: 'success', label: 'Оплата подтверждена'},
  failed: {tone: 'error', label: 'Не удалось оплатить'},
}
const unknown: GuestStatusPresentation = {tone: 'neutral', label: 'Статус уточняется'}

export const orderStatusPresentation = (status: string) => order[status] ?? unknown
export const callStatusPresentation = (status: string) => call[status] ?? unknown
export const paymentStatusPresentation = (status: string) => payment[status] ?? unknown
export const guestProductionMode: MiraMode = 'brand-dark'
