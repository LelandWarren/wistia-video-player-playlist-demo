# Getting Started with the Wistia Video Player Project 🎬

Hey there! So excited you’re diving into the Wistia Video Player project. In this guide, you’ll find everything you need to set up the app locally, from prerequisites to configuration.

---

## TL;DR for the Pros 🏃‍♂️💨

If you're already familiar with setting up apps like this and just need the commands, here's the quick version. Otherwise, keep scrolling for the full setup guide!

```bash
# Clone the repo
git clone http://wistia-chsdjj@git.codesubmit.io/wistia/full-stack-create-fork-fvuxww

# Navigate into the project directory
cd full-stack-create-fork-fvuxww

# Spin up the backend and PostgreSQL
cd backend
docker-compose up

# Run the DB migrations
npm run migration:run

# Set up env vars, replace with your WISTIA token
echo "WISTIA_API_TOKEN=xxxx" > .env

# Start the backend
npm install
npm run start

# Sync data into the database
curl --location --request PATCH 'http://localhost:3000/videos/sync'

# Start the frontend
cd ../frontend
npm install
npm run serve
```

And boom, the app will be live on `http://localhost:3000`! 🎉

---

## Detailed Setup Guide 🛠️

### 1. Prerequisites

Before getting started, make sure you have the following installed:

- **Docker** (latest version): For containerizing the app.
- **Node.js** (version 14+): You’ll need this for running the app locally.
- **npm** (or **yarn**): For package management.
- **PostgreSQL** (optional if you want to run the DB without Docker).

For more details on prerequisites, check out the [Prerequisites Guide](./prerequisites.md).

### 2. Installation

If you’re using Docker (which we highly recommend for simplicity), follow these steps:

```bash
# 1. Clone the repo
git clone http://wistia-chsdjj@git.codesubmit.io/wistia/full-stack-create-fork-fvuxww

# 2. Navigate to the project directory
cd full-stack-create-fork-fvuxww
```

Now let’s spin up the backend, database, and frontend.

#### Spin Up the Backend and Database

```bash
# In a separate terminal, go to the backend directory
cd backend

# Start PostgreSQL and the backend using Docker
docker-compose up
```

This will run PostgreSQL and the backend services on your machine. You can check the logs to make sure everything’s running smoothly!

#### Run Database Migrations

Next, we need to set up the database schema by running the migrations.

```bash
npm run migration:run
```

#### Start the Backend Service

Now that the database is set up, we can start the backend service.

```bash
npm install
npm run start
```

#### Sync Data from Wistia

Once the backend is up and running, let’s sync data from Wistia to the local PostgreSQL database.

```bash
curl --location --request PATCH 'http://localhost:3000/videos/sync'
```

This will pull the video data from the Wistia API and store it in your local DB.

#### Start the Frontend App

```bash
# Navigate to the frontend directory
cd ../frontend

# Install dependencies
npm install

# Run the frontend
npm run serve
```

The app will now be accessible at `http://localhost:3000`. 🎉

---

## Configuration 🔧

This app uses environment variables to configure different aspects of the backend and frontend. You'll need to set your WISTIA_API_TOKEN in an .env file

```
WISTIA_API_TOKEN=xxxxxxxxx
```

---

## Troubleshooting 🛠️

Things not going smoothly? Don’t worry, we’ve all been there! Head over to the [Troubleshooting Guide](./troubleshooting.md) for help with common issues like Docker not starting, migration errors, or frontend build issues.

---

## What’s Next? 🚀

Once the app is up and running, feel free to explore the key features! Here are some great places to start:

- **Architecture**: Learn more about the high-level architecture of the app in the [Architecture Overview](../architecture/README.md).
- **Features**: Check out the app’s key functionalities in the [Features Guide](../features/README.md).
- **Testing**: Want to run some tests? Check out our [Testing Guide](../testing/README.md).

---

That’s it! 🎉 Hope this guide helped you get started smoothly. If you have any questions or run into issues, don’t hesitate to check the [Troubleshooting Guide](./troubleshooting.md)
