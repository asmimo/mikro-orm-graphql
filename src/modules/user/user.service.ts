import { DI } from "../../server";
import { User } from "./user.entity";
import { CreateUserDTO, UserFilterDTO, UserPaginationDTO, UpdateUserDTO, UpdateUserPasswordDTO } from "./user.dto";

export default class UserService {
  protected readonly userRepo = DI.orm.em.getRepository(User);

  async createUser(dto: CreateUserDTO): Promise<User> {
    const { username, email, password, confirm, age, sex } = dto;

    if (password !== confirm) {
      throw new Error("match fail");
    }

    const user = this.userRepo.create({
      username,
      email,
      password,
      age,
      sex,
    });
    try {
      await user.hashPassword();
      await this.userRepo.persist(user, true);
    } catch (error) {
      if (error.code === "23505") {
        const rxp = /\(([^)]+)\)/;
        const key = rxp.exec(error.detail);
        if (key) {
          throw new Error(`${key[1]} already exists`);
        }
      } else {
        throw new Error(error);
      }
    }

    return user;
  }

  async getUsers(filter: UserFilterDTO, pagination: UserPaginationDTO): Promise<User[]> {
    const query = this.userRepo.createQueryBuilder("user");

    if (filter) {
      const { username, email } = filter;
      if (username != null) {
        query.where({ username: { $like: username } });
      }
      if (email != null) {
        query.andWhere("user.email like :email", [email]);
      }
    }

    const { limit, offset, sort, by } = pagination;
    query
      .limit(limit)
      .offset(offset)
      .orderBy({ [by]: sort });

    console.log(query.getQuery(), query.getParams());

    return query.getResult();
  }

  async getUser(id: string): Promise<User> {
    const user = await this.userRepo.findOne({ id });

    if (!user) {
      throw new Error("not found");
    }
    return user;
  }

  async updateUser(id: string, dto: UpdateUserDTO): Promise<User> {
    const { username, email, age, sex, password } = dto;
    const user = await this.getUser(id);

    if (!(await user.comparePassword(password))) {
      throw new Error("incorrect credentials");
    }

    user.username = username;
    user.email = email;
    user.age = age;
    user.sex = sex;
    try {
      await this.userRepo.persist(user, true);
    } catch (error) {
      if (error.code === "23505") {
        const rxp = /\(([^)]+)\)/;
        const key = rxp.exec(error.detail);
        if (key) {
          throw new Error(`${key[1]} already exists`);
        }
      } else {
        throw new Error(error);
      }
    }

    return user;
  }

  async updateUserPassword(id: string, dto: UpdateUserPasswordDTO): Promise<User> {
    const { old, password, confirm } = dto;
    const user = await this.getUser(id);

    if (password !== confirm) {
      throw new Error("match fail");
    }
    if (!(await user.comparePassword(old))) {
      throw new Error("incorrect credentials");
    }
    if (old === password) {
      throw new Error("duplicate");
    }

    user.password = password;
    try {
      await user.hashPassword();
      await this.userRepo.persist(user, true);
    } catch (error) {
      throw new Error(error);
    }

    return user;
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      const result = await this.userRepo.remove({ id }, true);

      return result ? true : false;
    } catch (error) {
      throw new Error(error);
    }
  }
}
