import { defineStore } from 'pinia'
import { ref } from 'vue'

export type NotificationType = 'success' | 'error' | 'info' | 'warning'

export const useNotificationStore = defineStore('notification', () => {
    const isVisible = ref(false)
    const message = ref('')
    const type = ref<NotificationType>('info')
    const timeout = ref(4000)

    const show = (msg: string, notificationType: NotificationType = 'info', duration = 4000) => {
        message.value = msg
        type.value = notificationType
        timeout.value = duration
        isVisible.value = true
    }

    const hide = () => {
        isVisible.value = false
    }

    return {
        isVisible,
        message,
        type, 
        timeout,
        show,
        hide
    }
})