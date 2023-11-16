import EnvironmentLoader from '@/services/EnvironmentLoader'
import NotificationService from '@/services/NotificationService'
import type { NotificationItem } from '@/services/types'
import { defineStore } from 'pinia'

interface State {
  unreadCount: number
  notifications: NotificationItem[]
  source: EventSource[] | null
  selectedNotification: NotificationItem | null
}

const ACKNOWLEDGEMENT = 'ACK'

const baseUrl = () => {
  return EnvironmentLoader.getConfig().baseUrl + '/notifications/subscribe/'
}

const newNotification = (event: MessageEvent, add: (no: NotificationItem) => void) => {
  const notification = JSON.parse(event.data)
  add(notification)
}

export const useNotificationStore = defineStore('notification', {
  state: () =>
    ({
      notifications: [] as NotificationItem[],
      unreadCount: 0
    } as State),
  actions: {
    addNotification(no: NotificationItem) {
      if (no.subject === ACKNOWLEDGEMENT) return
      this.notifications.push({
        ...no,
        read: false
      })
    },
    getNotifications() {
      return this.notifications
    },
    reloadCount() {
      NotificationService.count().then((count) => (this.unreadCount = count))
    },
    setNotifications(notifications: NotificationItem[]) {
      notifications.forEach((n) => this.addNotification(n))
    },
    connectToSource(ids: string[]) {
      NotificationService.inbox().then(this.setNotifications)
      this.source = ids.map((id) => {
        const source = new EventSource(baseUrl() + id)
        source.addEventListener('notification', (e) => newNotification(e, this.addNotification))
        return source
      })
    },
    disConnectFromSource() {
      this.source?.map((e) => e.close())
    },
    markRead(id: string) {
      this.notifications = this.notifications.map((n) => {
        if (n.id === id) {
          n.read = true
        }
        return n
      })
      NotificationService.markAsRead(id).then(() => this.reloadCount())
    },
    markAllRead(userId: string) {
      this.notifications = this.notifications.map((n) => {
        n.read = true
        return n
      })
      NotificationService.markAllAsRead(userId).then(() => this.reloadCount())
    },
    setSelectedNotification(notification: NotificationItem) {
      this.selectedNotification = notification
      this.markRead(notification.id)
    }
  }
})
