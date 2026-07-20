const NOTIFICATION_TYPES = ['success', 'error', 'info', 'warning'] as const;
export type NotificationType = typeof NOTIFICATION_TYPES[number]

export interface NotificationItem {
  id: string
  message: string
  type: NotificationType
  timeout: number
}

