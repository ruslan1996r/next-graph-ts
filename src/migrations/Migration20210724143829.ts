import { Migration } from '@mikro-orm/migrations';

export class Migration20210724143829 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "creted_at" timestamptz(0) not null default \'NOW()\', "updated_at" timestamptz(0) not null, "username" text not null, "password" text not null);');
    this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');

    // this.addSql('alter table "post" drop constraint if exists "post_creted_at_check";');
    // this.addSql('alter table "post" alter column "creted_at" type timestamptz(0) using ("creted_at"::timestamptz(0));');
    // this.addSql('alter table "post" alter column "creted_at" set default \'NOW()\';');
  }

}