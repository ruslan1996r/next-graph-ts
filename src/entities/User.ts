import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User {
  @Field()
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({ type: "date", default: "NOW()" })
  cretedAt = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field(() => String)
  @Property({ type: "text", unique: true })
  username!: string;

  // @Field(() => String) // Здесь не будет этого декоратора, так как мы не хотим получать это поле из базы
  @Property({ type: "text" })
  password!: string;
}