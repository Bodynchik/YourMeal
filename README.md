### Інструкції щодо встановлення та запуску проєкту

**Склонуйте репозиторій:**

```bash 
git clone https://github.com/Bodynchik/DataByO.git
```

**Створіть docker image:**

```bash
docker build -t my-site .
```

**Запустіть docker container:**

```bash
docker run -p 3000:3000 -p 8080:8080 my-site
```

Щоб запуститит проєкт перейдіть за посиланням http://localhost:8080
