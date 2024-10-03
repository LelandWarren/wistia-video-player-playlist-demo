# Troubleshooting Guide

Hey, running into some issues? Don’t worry, troubleshooting is part of the process, and we’re here to help you get unstuck. Below are some common problems and their solutions. If you’re not seeing your issue here, feel free to take a peek at the other docs like [installation](./installation.md).

## 1. Docker Issues

### Docker not starting properly

If Docker isn’t starting correctly, here are a few things to check:

- **Is Docker Desktop running?** Make sure you’ve opened Docker Desktop (or whatever Docker version you’re using) and that it's fully started.
- **Not enough memory allocated**: Docker can sometimes hit memory limits, especially if you have other services running. Increase the memory allocation in Docker settings:

  - Go to Docker Desktop → Preferences → Resources → Memory and increase the allocation.

- **Port conflicts**: Check if another process is already using the port Docker is trying to bind to (commonly port 5432 for PostgreSQL).

```
lsof -i :5432
```

If something else is running, either stop that process or change the port in your `docker-compose.yml` file.

---

## 2. Database Issues

### PostgreSQL container not starting

If the PostgreSQL container won’t start, check Docker logs for clues:

```
docker-compose logs db
```

Common problems include:

- **Volume permissions**: Sometimes Docker doesn’t have permission to write to your system. Try running Docker with elevated permissions (`sudo` on Linux or adjust file/folder permissions on macOS).
- **Corrupted volumes**: If you’ve used this container before, the volume might be corrupted. Try removing the volume and recreating it:

```
docker-compose down -v
docker-compose up
```

### Can’t connect to the database

If the backend is having trouble connecting to PostgreSQL, ensure that the database is running and that the connection settings in your `.env` file are correct.

Check that your `DATABASE_URL` or `DB_HOST` variables match what’s set in the `docker-compose.yml` file.

---

## 3. Backend Service Issues

### Backend service won’t start

If the backend service refuses to start, here’s a quick checklist:

- **Did you install dependencies?** Run `npm install` in the `backend` directory.
- **Missing environment variables?** Make sure your `.env` file is properly set up (see the [installation guide](./installation.md)).

- **Error message in logs?** Check the error messages in the console or logs:

```
npm run start
```

The logs should give you a clear indication of what’s wrong (e.g., missing dependencies, database connection errors, etc.).

---

## 4. Frontend Issues

### Vue app won’t load

If your frontend app isn’t loading, try these steps:

- **Missing dependencies**: Did you run `npm install` in the `frontend` directory? If not, install the necessary packages and try again.

- **API errors**: Make sure the backend is running properly. If the frontend can’t communicate with the backend, you’ll likely see errors in the browser’s dev tools (open with `F12` or `Ctrl+Shift+I`).

- **Vue CLI issues**: If the Vue CLI isn’t behaving, try clearing the cache and reinstalling packages:

```
npm cache clean --force
rm -rf node_modules
npm install
```

Then try running the app again.

---

## 5. Syncing Data Issues

### Data not syncing from Wistia

If you’ve run the sync command but the data isn’t coming through, make sure:

- **Backend is running**: The sync command will only work if the backend service is up and listening on `http://localhost:3000`.

- **API token is correct**: Double-check your `WISTIA_API_TOKEN` in the `.env` file

- **Endpoint errors**: If there are any issues, check the response from the sync request by running:

```
curl --location --request PATCH 'http://localhost:3000/videos/sync'
```

If you see an error, it will give you a clue on what’s going wrong (authentication, network issues, etc.).

---

## 6. Common Fixes

### Clear npm cache

If things are behaving strangely or you’re getting weird errors, try clearing the npm cache:

```
npm cache clean --force
```

### Restart Docker containers

Sometimes a simple restart of your Docker containers can fix issues:

```
docker-compose down
docker-compose up
```

### Rebuild everything

If you feel like you’ve tried everything and it’s still not working, try removing and reinstalling all dependencies:

```
rm -rf node_modules
npm install
docker-compose down -v
docker-compose up --build
```

This will give you a fresh start with clean dependencies and containers.

---

## 7. Endpoints getting stale data?

You might have some stale redis for some reason. No worries, for this project, you can just flush the cache (wouldn't recommend on production, but development is fine)

```
cd backend
redis-cli
FLUSHALL
```

You got this! 💪
