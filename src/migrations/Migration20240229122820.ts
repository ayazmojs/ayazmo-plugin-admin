import { Migration } from '@ayazmo/types';

export class Migration20240229122820 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "admin_invite" ("id" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz null, "meta" jsonb null, "email" varchar(255) not null, "accepted" boolean not null default false, "deleted_at" date null, "token" varchar(255) not null, "expires_at" date not null, constraint "admin_invite_pkey" primary key ("id"));');
    this.addSql('alter table "admin_invite" add constraint "admin_invite_email_unique" unique ("email");');
    this.addSql('create index "admin_invite_token_index" on "admin_invite" ("token");');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "admin_invite" cascade;');
  }

}
