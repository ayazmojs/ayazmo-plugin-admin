import { Migration } from '@ayazmo/types';

export class Migration20240222122119 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "admin" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz null, "meta" jsonb null, "first_name" varchar(255) null, "last_name" varchar(255) null, "password_hash" varchar(255) null, "email_verified" boolean not null default false, "email" varchar(255) not null, "avatar" varchar(255) null, "status" varchar(255) not null default \'new\', "deleted_at" date null, constraint "admin_pkey" primary key ("id"));');
    this.addSql('alter table "admin" add constraint "admin_email_unique" unique ("email");');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "admin" cascade;');
  }

}