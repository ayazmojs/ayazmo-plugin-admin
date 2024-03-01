import { Entity, Property, Opt } from '@ayazmo/types';
import { BaseEntity } from '@ayazmo/core';

@Entity()
export default class AdminInvite extends BaseEntity {

  @Property({ unique: true })
  email!: string;

  @Property({ default: false })
  accepted?: boolean;

  @Property({ type: 'date', nullable: true })
  deleted_at?: Date & Opt;

  @Property({ index: true })
  token: string

  @Property({ type: 'date' })
  expires_at: Date


  constructor(email: string, token: string, expires_at: Date, deleted_at?: Date) {
    super();
    this.email = email;
    this.deleted_at = deleted_at;
    this.token = token;
    this.expires_at = expires_at;
  }
}