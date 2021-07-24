import "reflect-metadata"; // НАДО ИМПОРТИРОВАТЬ ИЛИ КОД НЕ БУДЕТ РАБОТАТЬ! ЭТО ВСЁ ИЗ-ЗА ДЕКОРАТОРОВ В ТС-Е
import { MikroORM } from "@mikro-orm/core"
import express from "express"
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";

import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { __prod__ } from './constants';
import microConfig from './mikro-orm.config';

const PORT = 4000

const main = async () => {
  const orm = await MikroORM.init(microConfig)
  await orm.getMigrator().up() // Запустит все миграции

  const app = express()

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        HelloResolver,
        PostResolver
      ],
      validate: true
    }),
    context: () => ({ em: orm.em }) // Как я понял, сюда можно передавать всякое, что будет доступно в констекстах графовских зарпосов
  })

  apolloServer.applyMiddleware({ app })

  app.listen(PORT, () => {
    console.log(`Server on: http://localhost:${PORT}`)
  })
}

main().catch(err => {
  console.log(err)
})
