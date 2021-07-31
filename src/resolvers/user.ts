import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import argon2 from "argon2"

import { MyContext } from "src/types";
import { User } from "../entities/User";
import { COOKIE_NAME } from "../constants";
// import { EntityManager } from "@mikro-orm/postgresql";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;

  @Field(() => String)
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string
  @Field()
  message: string
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true }) // ВЫСТАВЛЯТЬ ВЕЗДЕ, ГДЕ МОЖЕТ БЫТЬ NULL или будет дропать ошибку
  errors?: FieldError[]

  @Field(() => User, { nullable: true })
  user?: User
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(
    @Ctx() { req, em }: MyContext
  ) {
    // you are not logged in
    if (!req.session.userId) {
      return null
    }
    const user = await em.findOne(User, { id: req.session.userId })
    return user
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse | undefined> {
    // Вот все эти валидации можно выносить в отдельные декораторы или попробовать обрабатывать с помощью MIDDLEWARE

    if (options.username.length <= 2) {
      return {
        errors: [{
          field: "username",
          message: "Username must be greater than 2 symbols"
        }]
      }
    }

    if (options.password.length <= 3) {
      return {
        errors: [{
          field: "password",
          message: "Password must be greater than 3 symbols"
        }]
      }
    }

    const hashedPassword = await argon2.hash(options.password)

    let user;
    try {
      // 
      const _user = em.create(User, {
        username: options.username,
        password: hashedPassword
      })
      await em.persistAndFlush(_user)

      user = await em.findOne(User, {
        username: options.username
      }) || undefined
      // const result = await (em as EntityManager)
      //   .createQueryBuilder(User)
      //   .getKnexQuery()
      //   .insert({
      //     username: options.username,
      //     password: hashedPassword,
      //     created_at: new Date(),
      //     updated_at: new Date(),
      //   })
      //   .returning("*");
      // user = await result[0];

    } catch (error) {
      if (error.code === '23505') {
        return {
          errors: [{
            field: "username",
            message: "Username already taken"
          }]
        }
      }
    }
    return { user }
  }

  // Чтобы куки работали, установи в консоли Графа "request.credentials": "include"
  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, {
      username: options.username
    })

    if (!user) {
      return {
        errors: [{
          field: "username",
          message: "That username doesn`t exists"
        }]
      }
    }

    const valid = await argon2.verify(user.password, options.password)
    if (!valid) {
      return {
        errors: [{
          field: "password",
          message: "Incorrect password"
        }]
      }
    }

    // Установить куки у юзера. Сделает его залогиненным
    req.session.userId = user.id

    return { user }
  }

  @Mutation(() => Boolean)
  logout(
    @Ctx() { req, res }: MyContext
  ) {
    // req.session.destroy - метод берётся из библиотеки "express-session"
    return new Promise(resolve => req.session.destroy((err: any) => {
      res.clearCookie(COOKIE_NAME)
      if (err) {
        console.log("Logout_Err: ", err)
        resolve(false)
        return
      }
      resolve(true)
    }))
  }
}