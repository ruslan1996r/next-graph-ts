import "reflect-metadata"; // НАДО ИМПОРТИРОВАТЬ ИЛИ КОД НЕ БУДЕТ РАБОТАТЬ! ЭТО ВСЁ ИЗ-ЗА ДЕКОРАТОРОВ В ТС-Е
import { MikroORM } from "@mikro-orm/core"
import express from "express"
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import redis from "redis"
import session from "express-session"
import connectRedis from "connect-redis"
import cors from "cors"

import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { COOKIE_NAME, __prod__ } from './constants';
import microConfig from './mikro-orm.config';
import { MyContext } from './types';
import { UserResolver } from './resolvers/user';

const PORT = 4000

const main = async () => {
  const orm = await MikroORM.init(microConfig)
  await orm.getMigrator().up() // Запустит все миграции

  const app = express()

  const RedisStore = connectRedis(session)
  const redisClient = redis.createClient({
    host: "127.0.0.1",
    port: 6379
  })

  app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
  }))
  // Это должно быть раньше, чем подключение Аполло, потому что мы будем юзать Редис внутри Аполло
  app.use(
    session({
      name: COOKIE_NAME,//"qid",
      store: new RedisStore({
        client: redisClient,
        disableTouch: true
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: "lax", // csrf protecting
        secure: __prod__ // cookie only works in https. Установит этот флаг только на проде (предполагается, что там будет https)
      },
      saveUninitialized: false, // Смотри в HELP.md
      secret: "redis_secret",
      resave: false
    })
  )

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        HelloResolver,
        PostResolver,
        UserResolver
      ],
      validate: false
    }),
    // Как я понял, сюда можно передавать всякое, что будет доступно в констекстах графовских зарпосов
    context: ({ req, res }): MyContext => ({ em: orm.em, req, res })
  })

  apolloServer.applyMiddleware({ app, cors: false })

  app.listen(PORT, () => {
    console.log(`Server on: http://localhost:${PORT}`)
  })
}

main().catch(err => {
  console.log(err)
})
