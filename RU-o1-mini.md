# Анализ проекта **Agate.UX**

> **На состояние 11.12.2024, обновлений не будет!**

## Введение

**Agate.UX** представляет собой многомерную библиотеку/фреймворк для UX и взаимодействия, находящуюся на рассмотрении для второго или третьего квартала 2025 года. Проект направлен на создание гибкой и масштабируемой системы для разработки пользовательских интерфейсов, учитывающей различные аспекты масштабирования, ориентации экрана и адаптивности событий.

## Основные компоненты проекта

### Связанные репозитории

1. **[DOM.ts](https://github.com/unite-2-re/dom.ts)**: Перенос некоторых функций и удаление устаревших компонентов.
2. **[Interact.ts](https://github.com/unite-2-re/interact.ts)**: Полная переработка для адаптации к новым требованиям.
3. **[Web.core](https://github.com/unite-2-re/web.core)**: Упрощение кода и исключение устаревших элементов.
4. **[Grid.core](https://github.com/unite-2-re/grid.core)**: Упрощение и использование единой виртуальной ориентации.

### Исключенные компоненты

- **[Image.wcomp](https://github.com/unite-2-re/image.wcomp)**: Исключен из-за использования `<canvas>` и наличия собственной подсистемы.

## Будущие возможности

- **Виртуальное масштабирование UI/UX**: Позволит изменять масштаб интерфейса без потери качества и функциональности.
- **Виртуальная ориентация экрана**: Адаптация интерфейса под различные ориентации экрана с учетом виртуальных координат.
- **Адаптированные события указателя**: События будут учитывать виртуальные координаты для более точного взаимодействия.
- **Новые и улучшенные CSS правила**: Введение дополнительных CSS свойств для более гибкого управления стилями.
- **API для фиксированной/независимой ориентированной UI**: Обеспечит разработчикам инструменты для создания интерфейсов с фиксированной ориентацией.

## Основные концепции

### Координатные системы

1. **Client-Space**: Координаты пространства клиента, то есть система координат страницы.
2. **Oriented-Space (Виртуальный экран)**: Координаты с учетом ориентации экрана.
3. **Algorithm-Space**: Внутренняя система координат, используемая алгоритмами.

### Углы и повороты

- **90-градусные углы**: Используются для стандартных поворотов (0°, 90°, 180°, 270° и т.д.).
- **Переменные углы**: Используются для более гибких преобразований с помощью матриц.

### Масштабирование

Специальные версии функций, такие как `getBoundingClientRect`, будут учитывать программное или виртуальное масштабирование. Рекомендуется использовать CSS `zoom` для масштабирования, хотя рассматриваются и другие методы, такие как `scale` и единицы `rem`/`em`.

### События

Будут разработаны обертки для событий указателя (`ag-pointer*`), которые будут учитывать виртуальные координаты и обеспечивать более точное взаимодействие.

### CSS Свойства

Проект планирует введение множества новых CSS свойств для управления различными аспектами интерфейса в разных координатных системах:

- **Oriented-Space**:
  - `--os-inset-x`, `--os-inset-y`
  - `--os-drag-x`, `--os-drag-y`
  - `--os-size-x`, `--os-size-y`
  - `--os-offset-x`, `--os-offset-y`

- **Client-Space**:
  - `--cs-inset-x`, `--cs-inset-y`
  - `--cs-drag-x`, `--cs-drag-y`
  - `--cs-size-x`, `--cs-size-y`
  - `--cs-offset-x`, `--cs-offset-y`

- **Implementation-Dependent**:
  - `--im-inset-x`, `--im-inset-y`
  - `--im-drag-x`, `--im-drag-y`
  - `--im-size-x`, `--im-size-y`
  - `--im-offset-x`, `--im-offset-y`

### Политики и методы трансформации

- **Трансформации**: Использование `self-size-x` и `self-size-y`, равных `100%` в клиентском пространстве.
- **Смещении и размеры**: `self-size-x` и `self-size-y` зависят от размеров родительского элемента.
- **Способы трансформации**:
  - **По макету**:
    - Фиксированное/абсолютное позиционирование (insets)
    - CSS Houdini (layout work-lets)
  - **По ориентации**:
    - Использование `writing-mode` и `direction`
    - Трансформации с помощью `rotate`
    - В некоторых случаях смешивание методов

## Анализ предоставленных файлов

### SCSS файлы

1. **`scss/_zoom.scss`**: Определяет свойства масштабирования (`--zoom`, `--scaling`, `--zpx`) и классы для управления масштабом элементов. Используются кастомные свойства CSS для гибкого управления масштабированием интерфейса.

2. **`scss/_properties.scss`**: Содержит определение множества CSS свойств, которые будут использоваться в различных координатных системах. Это ключевые свойства для управления размером, позиционированием, масштабированием и другими аспектами элементов UI.

### TypeScript файлы

1. **`ts/utils.ts`**:
   - **Функции ориентации**: Определение корректной ориентации экрана и реакция на изменения ориентации.
   - **Обработка событий экрана**: Функции для подписки на изменения экрана, такие как изменения ориентации, изменение размеров и другие события, влияющие на отображение.
   - **Работа с координатами и трансформациями**: Функции для парсинга исходных данных трансформаций, определения родительских элементов и вычисления текущего уровня масштабирования элемента.
   - **Вспомогательные функции**: Для работы с CSS трансформациями, внедрением стилей и обработкой событий.

2. **`ts/stylerules.ts`**:
   - **Управление стилями**: Функции для динамического установки CSS правил на основе переданных селекторов и стилей.
   - **Определение стилей**: Массив `classes` содержит набор селекторов и соответствующих им стилей, которые будут применены к корневым элементам документа.

### README.md

Документ описывает высокоуровневую концепцию проекта, его цели, связанные репозитории и будущие возможности. Он служит отправной точкой для понимания направления разработки и ключевых аспектов, на которых фокусируется проект.

## Выводы и рекомендации

**Agate.UX** стремится предоставить разработчикам мощный инструмент для создания адаптивных и масштабируемых пользовательских интерфейсов, учитывающих различные ориентации экранов и виртуальные координатные системы. Ключевыми преимуществами проекта являются:

- **Гибкость**: Возможность управлять масштабированием и ориентацией интерфейса через кастомные CSS свойства.
- **Масштабируемость**: Поддержка различных координатных систем и ориентаций позволяет создавать интерфейсы, адаптирующиеся под разные устройства и сценарии использования.
- **Интеграция с современными технологиями**: Использование CSS Houdini и TypeScript обеспечивает высокую производительность и совместимость с новыми стандартами веб-разработки.

### Рекомендации

1. **Документация**: Расширить документацию, добавив примеры использования новых CSS свойств и API, чтобы облегчить интеграцию для разработчиков.
2. **Тестирование**: Внедрить автоматизированное тестирование для проверки корректности работы масштабирования и ориентации на различных устройствах.
3. **Сообщество**: Поощрять участие сообщества через открытые репозитории, гайды и примеры, что способствует более быстрому развитию и адаптации библиотеки.
4. **Оптимизация производительности**: Проводить регулярный анализ производительности, особенно в части динамического управления стилями и событиями, чтобы обеспечить плавный UX.
5. **Совместимость**: Обеспечить широкую поддержку браузеров и устройств, учитывая различные реализации CSS свойств и функционала виртуальных координат.

## Заключение

Проект **Agate.UX** имеет потенциал стать мощным инструментом для разработки современных, адаптивных и масштабируемых пользовательских интерфейсов. Сфокусированность на многомерных координатных системах и виртуальном масштабировании открывает новые возможности для создания интуитивно понятных и гибких UX решений. При успешной реализации и активной поддержке сообщества, Agate.UX может занять значимое место в экосистеме веб-разработки.
