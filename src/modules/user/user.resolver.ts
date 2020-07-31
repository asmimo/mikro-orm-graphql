import { Resolver, Mutation, Query, Args, Arg } from "type-graphql";
import { User } from "./user.entity";
import UserService from "./user.service";
import {
  CreateUserDTO,
  UserFilterDTO,
  UserPaginationDTO,
  IdDTO,
  UpdateUserDTO,
  UpdateUserPasswordDTO,
} from "./user.dto";

@Resolver(User)
export class UserResolver {
  public readonly userService = new UserService();

  @Mutation(() => User)
  async createUser(@Args() dto: CreateUserDTO): Promise<User> {
    return this.userService.createUser(dto);
  }

  @Query(() => [User])
  async getUsers(
    @Arg("filter", { nullable: true }) filter: UserFilterDTO,
    @Args() pagination: UserPaginationDTO,
  ): Promise<User[]> {
    return this.userService.getUsers(filter, pagination);
  }

  @Query(() => User)
  async getUser(@Args() { id }: IdDTO): Promise<User> {
    return this.userService.getUser(id);
  }

  @Mutation(() => User)
  async updateUser(@Args() { id }: IdDTO, @Args() dto: UpdateUserDTO): Promise<User> {
    return this.userService.updateUser(id, dto);
  }

  @Mutation(() => User)
  async updateUserPassword(@Args() { id }: IdDTO, @Args() dto: UpdateUserPasswordDTO): Promise<User> {
    return this.userService.updateUserPassword(id, dto);
  }

  @Mutation(() => Boolean)
  async deleteUser(@Args() { id }: IdDTO): Promise<boolean> {
    return this.userService.deleteUser(id);
  }
}
