import { Migration } from '@mikro-orm/migrations';

export class Migration20210724124039 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "post" drop constraint if exists "post_creted_at_check";');
    this.addSql('alter table "post" alter column "creted_at" type timestamptz(0) using ("creted_at"::timestamptz(0));');
    this.addSql('alter table "post" alter column "creted_at" set default \'NOW()\';');
  }

}
