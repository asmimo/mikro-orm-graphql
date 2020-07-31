import express from "express";
import { ApolloServer } from "apollo-server-express";
import { MikroORM, RequestContext } from "mikro-orm";
import config from "./mikro-orm.config";
import { buildSchema } from "type-graphql";

export const DI = {} as {
  orm: MikroORM;
};
// Init Server
(async () => {
  const app = express();
  const port = process.env.PORT ? Number(process.env.PORT) : 3010;

  try {
    DI.orm = await MikroORM.init(config);

    const apolloServer = new ApolloServer({
      schema: await buildSchema({
        resolvers: [__dirname + "/modules/**/*.resolver.{ts,js}"],
        emitSchemaFile: false,
      }),
      context: ({ req, res }) => ({ req, res }),
    });

    app.use((_req, _res, next) => {
      RequestContext.create(DI.orm.em, next);
    });

    apolloServer.applyMiddleware({ app });

    app.listen(port, "0.0.0.0", () => console.log(`Server running on port: ${port}`));
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
})();
