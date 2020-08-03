import { PrimaryKey, Property } from "mikro-orm";
import { ObjectType, Field, ID } from "type-graphql";
import { v4 } from "uuid";

@ObjectType()
export abstract class BaseEntity {
  @Field(() => ID)
  @PrimaryKey()
  id = v4();

  @Field(() => Date)
  @Property()
  createdAt = new Date();

  @Field(() => Date)
  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}
