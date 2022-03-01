import { Migration } from '@mikro-orm/migrations';

export class Migration20220227170729 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "users" ("uuid" varchar(64) not null, "name" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "phone" varchar(255) null, "address" varchar(255) null);',
    );
    this.addSql(
      'alter table "users" add constraint "users_email_unique" unique ("email");',
    );
    this.addSql(
      'alter table "users" add constraint "users_pkey" primary key ("uuid");',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "users" cascade;');
  }
}
