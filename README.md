
# 📚 RUXEL

![Project Logo](https://a.d-cd.net/8enQ5WjBQ4p_mAivZVp0l6HkPNc-1920.jpg)

## 📋 Описание проекта 

**RUXEL** — редактор формул для работы с табличными данными

---

## ⚙️ Установка

Для запуска проекта локально выполните следующие шаги:

### Шаг 1: Установка Python

1. Убедитесь, что у вас установлен Python версии 3.11 . Если нет, скачайте его с [официального сайта Python](https://www.python.org/downloads/).
2. Проверьте установку Python командой:
   
   ```bash
   python --version
   ```
Шаг 2: Установка зависимостей
   ```bash
   pip install -r requirements.txt
   ```
Шаг 3: Установка Node.js и npm
Установите Node.js и npm с официального сайта Node.js.
Проверьте, что установка прошла успешно:
   ```
   npm -v
   ```
Шаг 5: Перейдите в директорию client и установите зависимости:
   ```bash
   cd client
   npm install -g pnpm
   pnpm i
   ```

🚀 Запуск проекта
Запуск бэкенда (Django)
Запустите сервер Django:
   ```bash
   python manage.py runserver
   ```
Сервер Django будет доступен по адресу: http://127.0.0.1:8000/.

Запуск фронтенда (React)
   ```bash
   cd client
   ```
Запустите React-приложение:
   ```bash
   pnpm run dev
   ```

🛠️ Используемые технологии
Backend: Django, Django REST Framework
Frontend: React
Database: Sqlite
