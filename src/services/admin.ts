import { BasePluginService } from '@ayazmo/core';
import { AyazmoContainer, PluginConfig, FindOneOptions } from '@ayazmo/types';
import argon2 from 'argon2';
import Admin from '../entities/Admin.js';

export default class AdminService extends BasePluginService {
  public eventService

  constructor(container: AyazmoContainer, pluginOptions: PluginConfig) {
    super(container, pluginOptions);
    this.eventService = container.eventService;
  }

  async findAdminByEmail(email: string, options?: FindOneOptions<Admin, any>): Promise<Admin | null> {
    return this.em.findOne(Admin, { email: email }, options)
  }

  async login(username: string, password: string): Promise<Admin | null> {
    const admin = await this.findAdminByEmail(username, {
      populate: ['password_hash']
    });

    if (!admin) {
      return null
    }

    const passwordIsValid = await this.verifyPassword(password, admin.password_hash);

    if (!passwordIsValid) {
      return null
    }

    return admin
  }

  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    try {
      return await argon2.verify(hashedPassword, plainPassword);
    } catch (err) {
      // Handle any unexpected errors during verification
      console.error(err);
      return false;
    }
  }

  async findAllAdminUsers() {
    return this.em.find(Admin, {})
  }

  async count() {
    return this.em.count(Admin, {})
  }

  async create(email: string, plainPassword: string, first_name: string, last_name: string) {
    console.log({ plainPassword })
    const hashedPassword = await argon2.hash(plainPassword);

    const admin = this.em.create(Admin, {
      email,
      password_hash: hashedPassword,
      first_name,
      last_name,
      email_verified: true,
      status: 'active'
    })

    await this.em.flush()

    return admin
  }
}