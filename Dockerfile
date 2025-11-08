# 1. Используем официальный образ NodeJs
FROM node:22

# 2. Устанавливаем рабочую директорию
WORKDIR /app

# 3. Копируем зависимости и устанавливаем
COPY . .
RUN yarn install --frozen-lockfile

# 4. Сборка проекта NestJS
RUN yarn run build

# 5. Открываем нужный порт
EXPOSE 4000

# 6. Запуск прод-сервера
CMD ["yarn", "run", "start:prod"]
