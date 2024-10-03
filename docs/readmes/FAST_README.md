# FAST README for Wistia Video Player Project 🚀

This is your quick, no-nonsense guide to understanding and running the Wistia Video Player project. If you need a high-level overview or want to get the app up and running fast, this is for you!

---

## How to Set Up and Run the App 💻

Setting up this project is super straightforward. Here’s the fastest way to get things running locally with Docker.

### 1. Clone the repo

```bash
git clone http://wistia-chsdjj@git.codesubmit.io/wistia/full-stack-create-fork-fvuxww
```

### 2. Spin up the database

```bash
# Do this in a separate terminal
cd backend
docker-compose up
```

### 3. Run the DB Migrations

```bash
cd backend
npm run migration:run
```

### 4. Set up your Environemnt Variables

```bash
cd backend
echo "WISTIA_API_TOKEN=xxxx" > .env

#verify contents
cat .env
```

### 5 Start the Backend Service

```bash
npm install
npm run start
```

### 6. Sync data into the Database

```bash
curl --location --request PATCH 'http://localhost:3000/videos/sync'
```

### 7 Run the Frontend Vue App

```bash
cd ..
cd frontend
npm install
npm run serve
```

- This will launch both the frontend (Vue.js) and backend (NestJS), and the app will be accessible at `http://localhost:3000`.

For more detailed installation steps, environment variables, or local setup instructions without Docker, check out the full [Getting Started Guide](./getting-started/README.md).

---

## Browser and OS Used 🖥️

- **Browser**: Google Chrome (latest version)
- **Operating System**: macOS Sonoma,

---

## Brief Architecture Overview 🏗️

The app is a full-stack solution built to handle video syncing, playlists, and tag management. Here’s the high-level breakdown:

- **Frontend**: Built with **Vue.js** and **TypeScript** for a responsive, modular UI. State management is handled by **Vuex**, and the app is thoroughly tested with **Jest**
- **Backend**: Powered by **NestJS**, the backend handles syncing video data from the Wistia API and storing it in **PostgreSQL**. It also manages caching using **Redis** for faster load times and reduced API calls.

- **Database**: **PostgreSQL** is used to store video metadata (title, thumbnail, duration) and tags. TypeORM manages the schema and relationships.

- **Caching**: Redis is used to cache playlists and video data, reducing the load on the Wistia API and improving app performance under heavy traffic.

---

## Performance Characteristics ⚡

Here’s how I designed the app to stay performant:

- **Caching with Redis**: I cache video playlists and tag data to minimize API calls to Wistia. This keeps the app responsive, even when there’s high traffic or large video libraries.
- **Asynchronous Data Sync**: Syncing with the Wistia API is handled asynchronously, which means I can update video data without blocking the user experience. The app remains responsive while syncing happens in the background.
- **Efficient Database Queries**: We’ve indexed key fields in PostgreSQL (like video visibility and Wistia hashed ID), which speeds up queries and ensures smooth interaction with the database.

---

## What I Learned & What We'd Do Differently 💡

Throughout the development of this project, I encountered various challenges and had a lot of takeaways. Here are the key learnings that shaped our approach:

### Key Learnings

#### **Caching/Local Storage is a Game Changer (But Comes with Trade-offs)**:

One of the biggest wins was implementing **Redis** for caching. The difference in performance when fetching playlists or videos was night and day once I introduced Redis. It drastically reduced load times and API calls to Wistia, keeping the user experience smooth, even with a large video library.

I also saw that the Wistia API is cleanly separated for data purposes, but that means we needed to utilize this strategy of caching and local storage (in our DB) to make sure we don't make N calls to Wistia's API and get rate limited.

However, **managing cache invalidation** has complexity to it. I had to ensure that cached data stayed in sync with the actual video data in PostgreSQL and Wistia. If I did this again, I'd spend more time planning the cache invalidation strategy upfront to avoid extra work later.

#### **Asynchronous Syncing Is Essential for Good UX**:

Syncing data from external APIs (like Wistia) can take time, and if it blocks the user, it creates a poor experience. Moving that process to run asynchronously in the background was a major win. Users don’t have to wait for the app to finish syncing before they can interact with it. It also reduces the perception of lag or slowness.

But, I had to carefully manage error handling when syncing in the background. It’s easy to miss errors that occur during these async operations, so I implemented robust logging and retry mechanisms to handle API failures gracefully.

#### **PostgreSQL & TypeORM Migrations**:

Using **TypeORM** for migrations was great for managing our database schema and keeping everything in sync between local development and production. However, I learned that it's important to thoroughly plan your schema and indexing strategy early on to avoid painful database migrations later.

Adding indexes on important fields (like video visibility and Wistia hashed IDs) early in the project made database queries much more efficient, which really helped as the app scaled. However, next time I would start with **even more detailed database planning** to avoid future refactors.

#### **Component Reusability & Modularity**:

On the frontend side, building with **Vue.js** allowed us to structure the UI using reusable components. This made it much easier to add features (like playlists and tag management) without re-writing the same UI logic. Vue’s component-driven architecture was a real time-saver.

That said, as I added features, some components became overly complex. Next time, we’d focus on **breaking down components further** and using more granular, single-responsibility components from the start to keep everything more maintainable.

### What I'd Do Differently

#### **Better Handling of Data Syncing**:

If I were starting from scratch, I'd make a better way to sync data between Wistia and our application. Right now, we use a manual endpoint for demonstrative purposes. However, in reality, this isn't very performant (as we do everything in one fell swoop). We would be better off with a **asynchronous job queue** that runs in the background, periodically validating and auditing data between Wistia and our database.

We may also utilize **webhooks** from Wistia in order to make sure real-time updates reach our system without having to consistently poll Wistia.

#### **More Thorough Planning for Production Readiness**:

While this app is designed with scalability in mind, we’d invest more time early on in implementing **rate limiting**, **API authentication** (like JWT), and better logging/monitoring strategies. These aren’t critical in development but become hugely important once the app is live and dealing with real-world traffic.

#### **Improved Testing Strategy**:

Testing is something I handled well, but there’s always room for improvement. I focused a lot on **unit tests** but would have benefitted from more **integration tests** and **end-to-end tests** later on. Integration tests and E2E tests would have ensured that our frontend-backend interactions were working smoothly, particularly as the app frows in complexity.

---

## Other Notes 📝

- **Scalability**: The project is built with scalability in mind. NestJS and Docker make it easy to containerize and deploy in any cloud environment, while Redis ensures that performance won’t degrade as the user base or video library grows.

- **Security**: If taken to production, we’d introduce proper authentication (e.g., OAuth or JWT), rate limiting for API requests, and HTTPS for secure data transmission.

---

For more details or a deeper dive into the architecture, features, and testing, check out the full [Documentation](./README.md). If you want to understand more about production readiness, we've got you covered in our [Production Readiness Guide](./production-readiness/README.md).
