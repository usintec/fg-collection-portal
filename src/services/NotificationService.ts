import { BaseService } from './BaseService'
import type {
  RootAPIResponse,
  NotificationInbox,
  NotificationItem,
  PaginatedResult,
  ISetting
} from './types'

interface NotificationCount {
  newNotifications: number
}

class NotificationService extends BaseService {
  constructor() {
    super('notifications')
  }

  readonly inbox = async () => {
    const url = this.getUrl('inbox?order=desc&pageSize=20&SortColumn=createdOn')
    const response = await this.doRequest<RootAPIResponse<PaginatedResult<NotificationInbox>>>({
      method: 'GET',
      url
    })
    return response.value.result.map(this.toNotificationsItem)
  }

  private toNotificationsItem = (response: NotificationInbox): NotificationItem => {
    console.log(response.createdOn, new Date(response.createdOn))
    return {
      id: response.notificationInboxId,
      userId: '',
      status: response.status,
      content: response.content,
      subject: response.subject,
      recipientId: '',
      recipientType: '',
      createdOn: new Date(response.createdOn),
      read: false,
      isHtml: response.isHtml
    }
  }

  readonly markAsRead = async (id: string) => {
    const url = this.getUrl('read')
    await this.doRequest<RootAPIResponse<NotificationItem>>({
      method: 'PATCH',
      url,
      body: {
        notificationId: id
      }
    })
  }

  readonly markAllAsRead = async (userId: string) => {
    const url = this.getUrl('all', 'read')
    await this.doRequest<RootAPIResponse<NotificationItem>>({
      method: 'PATCH',
      url,
      body: this.uniqueRequestGUID({
        userId
      })
    })
  }

  readonly count = async () => {
    const url = this.getUrl('inbox', 'count')
    const response = await this.doRequest<RootAPIResponse<NotificationCount>>({
      url,
      method: 'GET'
    })
    return response.value.newNotifications
  }

  //email configuration settings endpoint
  readonly createEmailSetting = async (data: Partial<ISetting>) => {
    const url = this.getUrl('settings')
    const response = await this.doRequest<RootAPIResponse<{ settingId: string }>>({
      url,
      method: 'POST',
      body: this.uniqueRequestGUID(data)
    })
    return response.value
  }
  readonly updateEmailSetting = async (data: Partial<ISetting>) => {
    const url = this.getUrl('settings')
    const response = await this.doRequest<RootAPIResponse<{ settingId: string }>>({
      url,
      method: 'PUT',
      body: this.uniqueRequestGUID(data)
    })
    return response.value
  }
  readonly getEmailSettings = async () => {
    const url = this.getUrl('settings')
    const response = await this.doRequest<RootAPIResponse<ISetting[]>>({
      url,
      method: 'GET',
      options: {
        noToken: true
      }
    })
    return response.value
  }
  readonly deleteEmailSetting = async (settingId: string) => {
    const url = this.getUrl(`settings/${settingId}`)
    const response = await this.doRequest<RootAPIResponse<{ settingId: string }>>({
      url,
      method: 'DELETE',
      options: {}
    })
    return response.value
  }
}

export default new NotificationService()
