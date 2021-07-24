<!-- УРОК: https://www.youtube.com/watch?v=I6ypD7qv3Z8&ab_channel=BenAwad -->
<!-- РЕПОЗИТОРИЙ: https://github.com/benawad/lireddit -->
<!-- ОСТАНОВИЛСЯ: 1:58:30, Логин, редис. https://youtu.be/I6ypD7qv3Z8?t=7114 -->

<!-- GRAPH_QL -->
Для тестирования логина убедить, что в консоли GraphQL `"request.credentials": "include",`

<!-- MICRO_ORM -->
Чтобы всё заработало, в файле `package.json` нужно создать конфиг-файл и добавить это:
"mikro-orm": {
  "useTsNode": true,
  "configPaths": [
    "./src/mikro-orm.config.ts",
    "./dist/mikro-orm.config.js"
  ]
}

<!-- Чтобы сделать миграцию -->
- Создать сущность
- Добавить в `orm.config` -> `entities`

<!-- ЗАПУСК -->
Сперва `yarn watch` - чтобы запустить typescript
Затем `yarn dev` - чтобы следить за изменёнными файлами в дисте

<!-- REDIS -->
Чтобы Redis заработал, нужно запустить сервер:
Redis-сервер находится по пути: `E:\Redis-latest\redis-server` (Старый сервак: E:\Redis-2.4.5\64bit\redis-server)
`saveUninitialized: false`
https://coderoad.ru/40381401/%D0%9A%D0%BE%D0%B3%D0%B4%D0%B0-%D0%B8%D1%81%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D1%8C-saveUninitialized-%D0%B8-resave-%D0%B2-%D1%8D%D0%BA%D1%81%D0%BF%D1%80%D0%B5%D1%81%D1%81-%D1%81%D0%B5%D1%81%D1%81%D0%B8%D0%B8

