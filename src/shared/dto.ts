import { ArgsType, InputType, registerEnumType, Field, ID, Int } from "type-graphql";
import { IsUUID, IsIn, IsDate } from "class-validator";

export enum Sort {
  ASC = "ASC",
  DESC = "DESC",
}
registerEnumType(Sort, { name: "Sort" });

@ArgsType()
export class IdDTO {
  @Field(() => ID)
  @IsUUID()
  id: string;
}

@ArgsType()
export class PaginationDTO {
  @Field(() => Int, { defaultValue: 0 })
  limit: number;

  @Field(() => Int, { defaultValue: 0 })
  offset: number;

  @Field(() => Sort, { defaultValue: Sort.DESC })
  @IsIn([Sort.ASC, Sort.DESC])
  sort: Sort;
}

@InputType()
export class DateFilterDTO {
  @Field(() => Date, { nullable: true })
  @IsDate()
  from?: Date;

  @Field(() => Date, { nullable: true })
  @IsDate()
  to?: Date;
}
