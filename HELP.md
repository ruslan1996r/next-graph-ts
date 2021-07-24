<!-- УРОК: https://www.youtube.com/watch?v=I6ypD7qv3Z8&ab_channel=BenAwad -->
<!-- РЕПОЗИТОРИЙ: https://github.com/benawad/lireddit -->

<!-- MICRO_ORM -->
Чтобы всё заработало, в файле `package.json` нужно создать конфиг-файл и добавить это:
"mikro-orm": {
  "useTsNode": true,
  "configPaths": [
    "./src/mikro-orm.config.ts",
    "./dist/mikro-orm.config.js"
  ]
}

<!-- ЗАПУСК -->
Сперва `yarn watch` - чтобы запустить typescript
Затем `yarn dev` - чтобы следить за изменёнными файлами в дисте