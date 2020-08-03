import { Options } from "mikro-orm";
import { BaseEntity } from "./shared/entity";

const config: Options = {
  type: "postgresql",
  clientUrl: "postgres://postgres:test@localhost:5432/mikro",
  entities: [BaseEntity, "src/modules/**/*.entity.{ts,js}", "dist/modules/**/*.entity.{ts,js}"],
  migrations: {
    path: "src/migrations",
  },
};

export default config;
