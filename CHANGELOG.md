# Changelog

## [1.2.0](https://github.com/Iskuskov/ai-for-developers-project-387/compare/v1.1.0...v1.2.0) (2026-11-17)


### Features

* детекция регрессов аудита — связка с закрытой задачей и исправляющим PR ([d1e9379](https://github.com/Iskuskov/ai-for-developers-project-387/commit/d1e9379d9a1038bd0e7d38ff4ea375fa85463eda))


### Bug Fixes

* e2e строго после test:backend — гонка gradle-процессов на классах ([f5a9817](https://github.com/Iskuskov/ai-for-developers-project-387/commit/f5a9817065b6f34ff8c81161c63d4094c8d0201a))
* недоступность приложения — маркер NO_DATA и продолжение аудита ([6254589](https://github.com/Iskuskov/ai-for-developers-project-387/commit/62545897888661502073090540f098cc3cd4598a))
* уровень заголовка карточки на главной — h2 вместо пропущенного уровня ([#14](https://github.com/Iskuskov/ai-for-developers-project-387/issues/14)) ([f100908](https://github.com/Iskuskov/ai-for-developers-project-387/commit/f100908185314e83acc3c426c81c931a3d98268a))
* уровень заголовка карточки на главной ([#14](https://github.com/Iskuskov/ai-for-developers-project-387/issues/14)) ([ab9383b](https://github.com/Iskuskov/ai-for-developers-project-387/commit/ab9383bc281ab492e27c0b0793cc7494dcbb4b6c))

## [1.1.0](https://github.com/Iskuskov/ai-for-developers-project-387/compare/v1.0.1...v1.1.0) (2026-11-17)


### Features

* авторевью PR, бюджет запусков агента, шаблон PR и REVIEW.md ([68a78b6](https://github.com/Iskuskov/ai-for-developers-project-387/commit/68a78b613487c924078a57c30fced46a59fcb0e9))
* автотриаж новых issues воркфлоу opencode-triage ([5b77cb8](https://github.com/Iskuskov/ai-for-developers-project-387/commit/5b77cb84c126849e892253eab4032e45e5104021))
* блокировка удаления типа встречи при предстоящих записях ([#7](https://github.com/Iskuskov/ai-for-developers-project-387/issues/7)) ([9f5a83a](https://github.com/Iskuskov/ai-for-developers-project-387/commit/9f5a83a8af36fe8fa511157196754a7ebd05f267))
* браузерная проверка PR из head SHA с артефактом trace+SHA ([b2e31ef](https://github.com/Iskuskov/ai-for-developers-project-387/commit/b2e31eff751a5585d159f2ab8ed54eb5d091153b))
* дружелюбное сообщение гостю для удалённого типа встречи ([#8](https://github.com/Iskuskov/ai-for-developers-project-387/issues/8)) ([b81bdf2](https://github.com/Iskuskov/ai-for-developers-project-387/commit/b81bdf2ed3332fe1a4298da401a1691e062ac406))
* удаление типа встречи с карточки ([#6](https://github.com/Iskuskov/ai-for-developers-project-387/issues/6)) ([0064027](https://github.com/Iskuskov/ai-for-developers-project-387/commit/0064027dc9413cf5c9e0558a9e6d36a963b1241c))
* удаление типов встреч ([#6](https://github.com/Iskuskov/ai-for-developers-project-387/issues/6)) ([00cae9e](https://github.com/Iskuskov/ai-for-developers-project-387/commit/00cae9edd5c2719f5dd65352382f3b93b24f84dc))


### Bug Fixes

* бюджет считает прогоны после включения механизма ([2ae29db](https://github.com/Iskuskov/ai-for-developers-project-387/commit/2ae29db56c28c2c591f56785048f11aeb719400e))
* гнать gen:client до задач фронтенда и сериализовать файлы Vitest ([98822be](https://github.com/Iskuskov/ai-for-developers-project-387/commit/98822be181a13faf20e5b2845c73bed954e7d4df))
* закавычить GITHUB_OUTPUT в бюджет-скрипте, закрепить shellcheck локально ([ea7196e](https://github.com/Iskuskov/ai-for-developers-project-387/commit/ea7196eb1ffb0d6be4f10d9886b451d824c0f81f))
* запретить интерактивные вопросы агенту и укоротить таймаут до 15 минут ([60614d6](https://github.com/Iskuskov/ai-for-developers-project-387/commit/60614d6f87ff53ceb07e56eb8ffa06808dd7b0ed))
* обработка error SDK и атомарное удаление типа встречи ([#6](https://github.com/Iskuskov/ai-for-developers-project-387/issues/6)) ([b1f8365](https://github.com/Iskuskov/ai-for-developers-project-387/commit/b1f83650e8680b718b728212fc6f4fed2e62120c))
* перевести воркфлоу агента на бесплатную модель mimo-v2.6-flash-free ([45fead2](https://github.com/Iskuskov/ai-for-developers-project-387/commit/45fead2df08eca35714d22531e15c03931373065))
* перевести воркфлоу агента на доступную бесплатную модель big-pickle ([8878120](https://github.com/Iskuskov/ai-for-developers-project-387/commit/8878120a513f79812a46a3917c1492c5dc114213))
* пиннить экшен агента на ветке 2.0 и opencode v2.3.0 через VERSION ([f47bedd](https://github.com/Iskuskov/ai-for-developers-project-387/commit/f47beddf15db953f25c59207b08431e5291fa7dd))
* поддержка pull_request_review_comment в бюджете и репортере (issue||pull_request) ([3257a82](https://github.com/Iskuskov/ai-for-developers-project-387/commit/3257a823f757dcf7207348b99fc76a07e6dbf961))
* поднять таймаут джоба агента до 30 минут для длинных задач ([b150fce](https://github.com/Iskuskov/ai-for-developers-project-387/commit/b150fce1ab993db9dc5dfcab0749f875845526e4))
* права агента в V1-форме (external_directory allow, question deny), экшен на [@latest](https://github.com/latest) ([353de5b](https://github.com/Iskuskov/ai-for-developers-project-387/commit/353de5b1cf01a01e4c73482cc971987c0c321dbe))
* права агента в V1-форме permission — экшен ставит opencode 1.x ([dbad535](https://github.com/Iskuskov/ai-for-developers-project-387/commit/dbad535644f03134e7eb8bc9c1eef7f720d02a3f))
* право issues write для бюджет-репортера, exhausted до комментария ([cbf7b82](https://github.com/Iskuskov/ai-for-developers-project-387/commit/cbf7b82d6607d049a67a01754021191655055ae2))
* разрешить агенту чтение внешних каталогов на раннере (external_directory) ([47b4e4e](https://github.com/Iskuskov/ai-for-developers-project-387/commit/47b4e4e7b319cdc9cd968a22aa0354c6bc8fd44f))
* сообщение об ошибке загрузки типов вместо вечного лоадера ([#8](https://github.com/Iskuskov/ai-for-developers-project-387/issues/8)) ([8809cad](https://github.com/Iskuskov/ai-for-developers-project-387/commit/8809cad2fc178e85622ec51c2a5f6408341518e1))
* таймаут 25 минут для по-тикетной реализации, бюджет через переменную ([db37e59](https://github.com/Iskuskov/ai-for-developers-project-387/commit/db37e5948fd4bf959e5e63e0b65844d3edb3778b))
* учебная находка tap-targets — не пересекается с существующими задачами ([93ca119](https://github.com/Iskuskov/ai-for-developers-project-387/commit/93ca1195518393de4107254f216dce864627f8af))
* учебный отчёт через jq вместо heredoc ([189f402](https://github.com/Iskuskov/ai-for-developers-project-387/commit/189f402d7616fae0670fcc92a111232347272541))
* экшен агента из форка с прибитой версией (иммунитет к rate-limit api.github.com) ([a0f3217](https://github.com/Iskuskov/ai-for-developers-project-387/commit/a0f321763a5bb8fb6963921955496a1742ee4c43))
* явно запретить автопубликацию сессий экшеном (share=false) ([d709643](https://github.com/Iskuskov/ai-for-developers-project-387/commit/d709643660f2cefb6fda96f73e83b63e11ba4629))

## [1.0.1](https://github.com/Iskuskov/ai-for-developers-project-387/compare/v1.0.0...v1.0.1) (2026-11-15)


### Bug Fixes

* изолировать прогоны от комментариев ботов в concurrency воркфлоу агента ([bc283fb](https://github.com/Iskuskov/ai-for-developers-project-387/commit/bc283fb50aa3e933d73eb262b644373b5b8240fb))

## 1.0.0 (2026-11-14)


### Features

* add landing page with link to booking page stub ([cc82084](https://github.com/Iskuskov/ai-for-developers-project-386/commit/cc820849a88d99a0690b0e6fc1315806e8271f05))
* **backend:** GET /bookings — предстоящие Записи всех типов одним списком ([#19](https://github.com/Iskuskov/ai-for-developers-project-386/issues/19)) ([18a2e2f](https://github.com/Iskuskov/ai-for-developers-project-386/commit/18a2e2f833cc33029ee7271535128f60e2543388))
* **backend:** GET /event-types по контракту и тесты ([#15](https://github.com/Iskuskov/ai-for-developers-project-386/issues/15)) ([680b6cc](https://github.com/Iskuskov/ai-for-developers-project-386/commit/680b6cc30ac01cd08fa530fcd205a44f9f1f9ab5))
* **backend:** GET /event-types/{id} — Тип встречи по идентификатору, 404 для неизвестного ([#14](https://github.com/Iskuskov/ai-for-developers-project-386/issues/14)) ([06e5321](https://github.com/Iskuskov/ai-for-developers-project-386/commit/06e5321809814f8bb77645acec0b49327e59c05a))
* **backend:** POST /bookings — создание Записи с непересекающимися интервалами ([#18](https://github.com/Iskuskov/ai-for-developers-project-386/issues/18)) ([187db2d](https://github.com/Iskuskov/ai-for-developers-project-386/commit/187db2db15f0320ca45081b0c948326b2c298f59))
* **backend:** POST /event-types — валидация и создание Типа встречи ([#16](https://github.com/Iskuskov/ai-for-developers-project-386/issues/16)) ([b85efff](https://github.com/Iskuskov/ai-for-developers-project-386/commit/b85efffbf5a44ef5f41a2c9fb0bc1f6777723d90))
* **backend:** вычисление свободных слотов GET /slots ([#17](https://github.com/Iskuskov/ai-for-developers-project-386/issues/17)) ([a4cc888](https://github.com/Iskuskov/ai-for-developers-project-386/commit/a4cc8886d1134ba25a81dcadcdcb184e69334afc))
* **backend:** ограничение имени гостя — максимум 100 символов по контракту ([#14](https://github.com/Iskuskov/ai-for-developers-project-386/issues/14)) ([4551ddc](https://github.com/Iskuskov/ai-for-developers-project-386/commit/4551ddc7f3a3a4270c3058c1c9750cebd645e708))
* **frontend:** страница /booking на сгенерированном SDK ([#15](https://github.com/Iskuskov/ai-for-developers-project-386/issues/15)) ([71b5302](https://github.com/Iskuskov/ai-for-developers-project-386/commit/71b5302af31524fc4d0eeb79091a46478022798f))
* **frontend:** страница /event-types с формой создания на SDK ([#16](https://github.com/Iskuskov/ai-for-developers-project-386/issues/16)) ([8b95e32](https://github.com/Iskuskov/ai-for-developers-project-386/commit/8b95e3243cbc2617dbcb3295029a7099fea04938))
* **frontend:** страница Записей /bookings и ссылка «Записи» в шапке ([#19](https://github.com/Iskuskov/ai-for-developers-project-386/issues/19)) ([a8758f8](https://github.com/Iskuskov/ai-for-developers-project-386/commit/a8758f870c16ea579e5f6eddb273564549c7bf69))
* **frontend:** страница календаря слотов /booking/:eventTypeId ([#17](https://github.com/Iskuskov/ai-for-developers-project-386/issues/17)) ([a633985](https://github.com/Iskuskov/ai-for-developers-project-386/commit/a63398505910186d6b0adc218a9ccadb8efea996))
* **frontend:** форма записи под календарём слотов с инлайн-подтверждением ([#18](https://github.com/Iskuskov/ai-for-developers-project-386/issues/18)) ([c2222c5](https://github.com/Iskuskov/ai-for-developers-project-386/commit/c2222c5256fa7d4a20f95dbdb59deeaa2096d4cc))
* scaffold app skeleton with checks and CI ([2b8f727](https://github.com/Iskuskov/ai-for-developers-project-386/commit/2b8f727784865a5b80173f6523380c93e5923c99))
* **spec:** POST /event-types в контракте TypeSpec и SDK ([#16](https://github.com/Iskuskov/ai-for-developers-project-386/issues/16)) ([a479ce1](https://github.com/Iskuskov/ai-for-developers-project-386/commit/a479ce19f2174bbae12843f41f2d18badd7e3418))
* **spec:** контракт GET /bookings и регенерация SDK ([#19](https://github.com/Iskuskov/ai-for-developers-project-386/issues/19)) ([4079c75](https://github.com/Iskuskov/ai-for-developers-project-386/commit/4079c75d6cf9bf9c3073357305751ded55c0a57c))
* **spec:** контракт GET /slots и регенерация SDK ([#17](https://github.com/Iskuskov/ai-for-developers-project-386/issues/17)) ([cea12e4](https://github.com/Iskuskov/ai-for-developers-project-386/commit/cea12e413b4b295e970f8b8c456c5448f49eb3ec))
* **spec:** контракт POST /bookings и регенерация SDK ([#18](https://github.com/Iskuskov/ai-for-developers-project-386/issues/18)) ([4d1038b](https://github.com/Iskuskov/ai-for-developers-project-386/commit/4d1038b9a9037fc21345860205d75f3b8f1aede2))
* **spec:** контракт Типа встречи в TypeSpec и цепочка генерации ([#15](https://github.com/Iskuskov/ai-for-developers-project-386/issues/15)) ([f289883](https://github.com/Iskuskov/ai-for-developers-project-386/commit/f28988391ed3591ac453518bebbe911f93078243))
* главная страница и заглушка страницы записи (шаг 4) ([5a1627b](https://github.com/Iskuskov/ai-for-developers-project-386/commit/5a1627b677063313c70a8b26ac18d9f0c23e2528))


### Bug Fixes

* **backend:** даты вне 14-дневного окна записи — пустой список слотов ([#14](https://github.com/Iskuskov/ai-for-developers-project-386/issues/14)) ([84fae2a](https://github.com/Iskuskov/ai-for-developers-project-386/commit/84fae2a979e8bb3566b42ee03cf3b4cd3cb0f53e))
* **frontend:** «сегодня» в календаре слотов считается в Europe/Moscow ([#14](https://github.com/Iskuskov/ai-for-developers-project-386/issues/14)) ([0cba1ce](https://github.com/Iskuskov/ai-for-developers-project-386/commit/0cba1ce85a36eb3b4262ef3f49bdc4bec08d8abc))
* **frontend:** нейминг по глоссарию — «Типы встреч» вместо «Видов брони» ([#14](https://github.com/Iskuskov/ai-for-developers-project-386/issues/14)) ([c7e2f9e](https://github.com/Iskuskov/ai-for-developers-project-386/commit/c7e2f9ee369586b0499527944c9aa0ab7dfbc575))
