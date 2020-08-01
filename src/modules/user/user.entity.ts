import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "../../globals/entity";
import { ObjectType, Field, Int } from "type-graphql";
import bcrypt from "bcryptjs";
import { CustomUserRepository } from "./user.repository";

@ObjectType()
@Entity({ customRepository: () => CustomUserRepository })
export class User extends BaseEntity {
  @Field()
  @Property({ unique: true })
  username: string;

  @Field()
  @Property({ unique: true })
  email: string;

  @Property()
  password: string;

  @Field(() => Int)
  @Property()
  age: number;

  @Field()
  @Property()
  sex: string;

  async hashPassword(): Promise<void> {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }

  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
