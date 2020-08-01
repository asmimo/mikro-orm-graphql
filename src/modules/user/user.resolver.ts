import { Resolver, Mutation, Query, Args, Ctx, Arg } from "type-graphql";
import { User } from "./user.entity";
import {
  CreateUserDTO,
  UserFilterDTO,
  UserPaginationDTO,
  IdDTO,
  UpdateUserDTO,
  UpdateUserPasswordDTO,
} from "./user.dto";
import { BaseContext } from "../../types/context";

@Resolver(User)
export class UserResolver {
  @Mutation(() => User)
  async createUser(@Ctx() { em }: BaseContext, @Args() dto: CreateUserDTO): Promise<User> {
    // @ts-ignore
    return em.getRepository(User).createUser(dto);
  }

  @Query(() => [User])
  async getUsers(
    @Ctx() { em }: BaseContext,
    @Arg("filter", { nullable: true }) filter: UserFilterDTO,
    @Args() pagination: UserPaginationDTO,
  ): Promise<User[]> {
    // @ts-ignore
    return em.getRepository(User).getUsers(filter, pagination);
  }

  @Query(() => User)
  async getUser(@Ctx() { em }: BaseContext, @Args() { id }: IdDTO): Promise<User> {
    // @ts-ignore
    return em.getRepository(User).getUser(id);
  }

  @Mutation(() => User)
  async updateUser(@Ctx() { em }: BaseContext, @Args() { id }: IdDTO, @Args() dto: UpdateUserDTO): Promise<User> {
    // @ts-ignore
    return em.getRepository(User).updateUser(id, dto);
  }

  @Mutation(() => User)
  async updateUserPassword(
    @Ctx() { em }: BaseContext,
    @Args() { id }: IdDTO,
    @Args() dto: UpdateUserPasswordDTO,
  ): Promise<User> {
    // @ts-ignore
    return em.getRepository(User).updateUserPassword(id, dto);
  }

  @Mutation(() => Boolean)
  async deleteUser(@Ctx() { em }: BaseContext, @Args() { id }: IdDTO): Promise<boolean> {
    // @ts-ignore
    return em.getRepository(User).deleteUser(id);
  }
}
