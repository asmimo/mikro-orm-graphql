import { EntityRepository } from "@mikro-orm/postgresql";
import { User } from "./user.entity";
import { CreateUserDTO, UserFilterDTO, UserPaginationDTO, UpdateUserDTO, UpdateUserPasswordDTO } from "./user.dto";

export class CustomUserRepository extends EntityRepository<User> {
  async createUser(dto: CreateUserDTO): Promise<User> {
    const { username, email, password, confirm, age, sex } = dto;

    if (password !== confirm) {
      throw new Error("match fail");
    }

    const user = this.create({
      username,
      email,
      password,
      age,
      sex,
    });
    try {
      await user.hashPassword();
      await this.persist(user).flush();
    } catch (error) {
      if (error.code === "23505") {
        const rxp = /\(([^)]+)\)/;
        const key = rxp.exec(error.detail);
        if (key) {
          throw new Error(`${key[1]} already exists`);
        }
      }
      throw new Error(error);
    }

    return user;
  }

  async getUsers(filter: UserFilterDTO, pagination: UserPaginationDTO): Promise<User[]> {
    const qb = this.createQueryBuilder("user");

    if (filter) {
      const { deepFilter, username, email, sex, from, to } = filter;
      const operator = deepFilter ? "$and" : "$or";
      if (username != null) {
        qb.where({ username: { $ilike: `%${username}%` } }, operator);
      }
      if (email != null) {
        qb.where({ email: { $ilike: `%${email}%` } }, operator);
      }
      if (sex != null) {
        qb.where({ sex }, operator);
      }
      if (from || to) {
        if (from && to) {
          qb.where(`created_at between ? and ?`, [from, to], operator);
        } else {
          throw new Error("provide both dates");
        }
      }
    }

    const { limit, offset, sort, by } = pagination;
    qb.limit(limit)
      .offset(offset)
      .orderBy({ [by]: sort });

    return qb.getResult();
  }

  async getUser(id: string): Promise<User> {
    const user = await this.findOne({ id });

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
      await this.persist(user).flush();
    } catch (error) {
      if (error.code === "23505") {
        const rxp = /\(([^)]+)\)/;
        const key = rxp.exec(error.detail);
        if (key) {
          throw new Error(`${key[1]} already exists`);
        }
      }
      throw new Error(error);
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
      await this.persist(user).flush();
    } catch (error) {
      throw new Error(error);
    }

    return user;
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      const result = await this.nativeDelete({ id });

      return result ? true : false;
    } catch (error) {
      throw new Error(error);
    }
  }
}
