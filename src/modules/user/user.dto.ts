import { ArgsType, InputType, registerEnumType, Field, Int } from "type-graphql";
import { Length, Matches, IsEmail, IsIn } from "class-validator";
import { DateFilterDTO, PaginationDTO, IdDTO } from "../../shared/dto";

enum Sex {
  MALE = "MALE",
  FEMALE = "FEMALE",
}
registerEnumType(Sex, { name: "Sex" });
export { IdDTO };

@ArgsType()
export class UserPasswordDTO {
  @Field()
  @Length(6, 20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: "Password too weak",
  })
  password: string;

  @Field()
  @Length(6, 20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: "Password too weak",
  })
  confirm: string;
}

@ArgsType()
export class CreateUserDTO extends UserPasswordDTO {
  @Field()
  @Length(5, 15)
  @Matches(/^\S*$/, { message: "Username must not include spaces" })
  username: string;

  @Field()
  @IsEmail()
  email: string;

  @Field(() => Int)
  age: number;

  @Field(() => Sex)
  sex: Sex;
}

@InputType()
export class UserFilterDTO extends DateFilterDTO {
  @Field({ defaultValue: false })
  deepFilter: boolean;

  @Field({ nullable: true })
  username: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  ageFrom: Date;

  @Field({ nullable: true })
  ageTo: Date;

  @Field(() => Sex, { nullable: true })
  sex: Sex;
}

@ArgsType()
export class UserPaginationDTO extends PaginationDTO {
  @Field({ defaultValue: "createdAt" })
  @IsIn(["username", "email", "age", "sex", "createdAt", "updatedAt"])
  by: string;
}

@ArgsType()
export class UpdateUserDTO extends IdDTO {
  @Field({ nullable: true })
  @Length(5, 15)
  @Matches(/^\S*$/, { message: "Username must not include spaces" })
  username: string;

  @Field({ nullable: true })
  @IsEmail()
  email: string;

  @Field(() => Int, { nullable: true })
  age: number;

  @Field(() => Sex, { nullable: true })
  sex: Sex;

  @Field()
  password: string;
}

@ArgsType()
export class UpdateUserPasswordDTO extends UserPasswordDTO {
  @Field()
  old: string;
}
