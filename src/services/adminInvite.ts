import { BasePluginService } from '@ayazmo/core'
import { AyazmoContainer, PluginConfig, FindOneOptions } from '@ayazmo/types'
import crypto from 'crypto'
import AdminInvite from '../entities/AdminInvite.js'

// 1 day
const DEFAULT_VALID_INVITE_DURATION = 60 * 60 * 24

export default class AdminService extends BasePluginService {
  public eventService

  public static EVENTS = {
    ADMIN_INVITE: 'admin.invite',
  }

  constructor(container: AyazmoContainer, pluginOptions: PluginConfig) {
    super(container, pluginOptions);
    this.eventService = container.eventService;
  }

  async findInviteByToken(token: string, options?: FindOneOptions<AdminInvite, any>): Promise<AdminInvite | null> {
    return this.em.findOne(AdminInvite, { token, accepted: false }, options)
  }

  async createInvite(email: string) {
    if (!email) {
      return null
    }

    const token = crypto.randomBytes(20).toString('hex')
    const link = this.createInviteLink(token)
    const newInvite = this.em.create(AdminInvite, {
      email,
      token,
      accepted: false,
      deleted_at: undefined,
      expires_at: new Date((new Date()).getTime() + DEFAULT_VALID_INVITE_DURATION)
    })
    await this.em.flush()

    this.eventService.publish(AdminService.EVENTS.ADMIN_INVITE, { email, link });

    return newInvite
  }

  createInviteLink(token: string): string {
    const baseURL = `${process.env.NEXTAUTH_URL}/create-account`
    const url = new URL(baseURL)
    url.searchParams.append('token', token)

    return url.href
  }

  async count(where = {}) {
    return this.em.count(AdminInvite, where)
  }

}