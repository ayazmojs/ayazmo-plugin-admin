import { Entity, Property, Opt } from '@ayazmo/types';
import { BaseEntity } from '@ayazmo/core';

@Entity()
export default class Admin extends BaseEntity {

  @Property({ nullable: true })
  first_name: string & Opt;

  @Property({ nullable: true })
  last_name: string & Opt;

  @Property({ lazy: true, nullable: true })
  password_hash!: string;

  @Property({ default: false })
  email_verified: boolean;

  @Property({ unique: true })
  email!: string;

  @Property({ nullable: true })
  avatar?: string & Opt;

  @Property({ default: 'new' })
  status: string & Opt;

  @Property({ type: 'date', nullable: true })
  deleted_at?: Date & Opt;


  constructor(first_name: string, last_name: string, email: string, password_hash: string, email_verified: boolean, status: string, deleted_at?: Date, avatar?: string) {
    super();
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.password_hash = password_hash;
    this.email_verified = email_verified ?? false;
    this.status = status ?? 'new';
    this.deleted_at = deleted_at;
    this.avatar = avatar;
  }
}