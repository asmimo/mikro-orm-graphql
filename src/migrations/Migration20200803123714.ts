import { Migration } from '@mikro-orm/migrations';

export class Migration20200803123714 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" jsonb not null, "created_at" jsonb not null, "updated_at" jsonb not null, "username" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "age" int4 not null, "sex" varchar(255) not null);');
    this.addSql('alter table "user" add constraint "user_pkey" primary key ("id");');
    this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
  }

}
