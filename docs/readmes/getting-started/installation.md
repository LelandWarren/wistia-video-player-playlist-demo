# Installation Guide

Hey! Excited to get started? Let’s walk through the process step-by-step to get everything up and running. Don't worry—this guide is comprehensive but simple, and I'll make sure you know exactly what to do. If you hit any bumps along the way, our [troubleshooting guide](./troubleshooting.md) has your back! 🎉

## 1. Clone the Repo

First things first, let's clone the repository to your local machine. Make sure you’ve got Git installed (if not, check out the [prerequisites guide](./prerequisites.md)).

```
git clone http://wistia-chsdjj@git.codesubmit.io/wistia/full-stack-create-fork-fvuxww
```

Once that’s done, you’ll have all the project files on your local machine. Ready? Let’s move on!

## 2. Spin up the Database

We’re using Docker to keep things clean and isolated. Head over to the backend directory, then run the database using Docker Compose.

```

# Do this in a separate terminal

cd backend
docker-compose up
```

This will set up your PostgreSQL database in a container. Wait until Docker is done starting up everything—it’ll let you know when it's ready!

## 3. Run the DB Migrations

Now that the database is running, let's make sure it's structured properly. Migrations are basically scripts that set up your database tables and columns.

```
cd backend
npm run migration:run
```

That’s it! Your database is now ready to store data.

## 4. Set Up Your Environment Variables

This app requires some environment variables to run smoothly. Specifically, you’ll need to set up your `WISTIA_API_TOKEN` (and other variables if needed). Let’s get that `.env` file set up:

```
cd backend
echo "WISTIA_API_TOKEN=xxxx" > .env

# verify contents

cat .env
```

Replace `xxxx` with your actual Wistia API token.

## 5. Start the Backend Service

Time to get the backend up and running! Install the necessary dependencies and then start the service:

```
npm install
npm run start
```

The backend should now be up and listening on `http://localhost:3000`. 🎉

## 6. Sync Data into the Database

With the backend running, we need to pull in some initial video data from Wistia into your database. Run the following curl command:

```
curl --location --request PATCH 'http://localhost:3000/videos/sync'
```

This will sync all the data you need from Wistia and load it into your PostgreSQL database. 🔄

## 7. Run the Frontend Vue App

Last but definitely not least, let’s get the frontend up and running. Navigate to the frontend directory, install dependencies, and fire up the Vue app:

```
cd ..
cd frontend
npm install
npm run serve
```

The frontend will now be running locally at `http://localhost:8080`. Open that in your browser, and boom—you’re live! 🚀

---

If you’ve followed along this far, congrats! You’ve got the app running both backend and frontend. If anything went sideways, no worries—head over to the [troubleshooting guide](./troubleshooting.md) for solutions to common issues.
