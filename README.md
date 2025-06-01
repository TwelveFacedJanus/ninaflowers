<div align="center">
  <h1> Nina Flowers | Open Source</h1>
  <p>by Numbers Technogies </p>
</div>

![alt text](https://github.com/TwelveFacedJanus/ninaflowers/blob/main/docs/sc1.png)

---

## О проекте
Если в кратце, то это сайт для магазина цветов Nina Flowers с админ панелью в телеграм.

Все букеты добавляются в БД (PostgresSQL) прямо из телеграм и серверная часть сайта обращается к БД, чтобы та вернула все букеты. В итоге, у меня нет полноценного CRUD-API приложения для БД, но, думаю, это не столь важно

## Скрипты

```sh
update.sh
```
Скрипт для установки обновления прямо с гита. То есть, мы завершаем контейнеры и удаляем контейнер из docker, чтобы потом скачать новый web и начинать работу с обновленной версией

## Запуск и зависимости
Из зависимостей требуется только `docker-compose`. А для запуска `git clone https://github.com/TwelveFacedJanus/ninaflowers.git && cd ninaflowers && docker-compose up -d`
