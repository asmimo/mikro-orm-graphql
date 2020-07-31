import { Options } from "mikro-orm";
import { BaseEntity } from "./globals/entity";
import { User } from "./modules/user/user.entity";

const config: Options = {
  type: "postgresql",
  clientUrl: "postgres://postgres:test@localhost:5432/mikro",
  entities: [BaseEntity, User],
  migrations: {
    path: "./src/migrations",
  },
};

export default config;
