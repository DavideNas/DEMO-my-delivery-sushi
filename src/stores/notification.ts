import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { NotificationType, NotificationItem } from '@/types/notification'

export const useNotificationStore = defineStore('notification', () => {
  // Array of active notifications on screen
  const notifications = ref<NotificationItem[]>([])

  const remove = (id: string) => {
    notifications.value = notifications.value.filter((n) => n.id !== id)
  }

  const show = (msg: string, type: NotificationType = 'info', duration = 4000) => {
    const id = `${Date.now()}-${Math.random()}`


    const item: NotificationItem = {
      id,
      message:msg,
      type,
      timeout: duration
    }

    // Adds the new notification to the top (or bottom) of the stack
    notifications.value.push(item)

    // Independent self-removal for each individual toast
    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }
  }

  return {
    notifications,
    show,
    remove
  }
})
