# Backend Architecture Overview

Welcome to the backend of our project! 🌐 This backend is built with **NestJS**, a Node.js framework that makes developing scalable and maintainable applications a breeze. Our primary focus here is syncing and managing video data from Wistia, handling tags, and exposing a public API for the frontend to consume. Let’s break it all down so you can get a feel for how things work under the hood.

---

## Framework: NestJS + TypeScript

We chose **NestJS** for its modular architecture, which helps keep the code organized and scalable. Combined with **TypeScript**, we ensure type safety and reduce the risk of bugs.

- **NestJS**: Offers an intuitive, modular system for building scalable server-side applications.
- **TypeScript**: Provides static typing, which means fewer runtime errors and more reliable code.

For a deeper dive into our decision-making process, check out our [Backend Trade-offs](./tradeoffs.md) document.

---

## Project Structure

Here’s an overview of the key directories and their purposes:

- **`src/`**: The heart of the backend codebase.
  - **`app.module.ts`**: The root module that brings all services, controllers, and modules together.
  - **`videos/`**: Handles all logic related to videos, including syncing with Wistia, managing video data, and exposing API endpoints.
  - **`tags/`**: Manages tags, including CRUD operations and their relationship with videos.
  - **`sync/`**: Contains the logic for syncing video data from Wistia with our database.
  - **`dtos/`**: Data Transfer Objects for request validation and structuring API responses.
  - **`redis/`**: Redis configuration and caching logic to optimize performance.
  - **`migrations/`**: Database migration files for schema changes.

This structure keeps everything modular and easy to maintain.

---

## Key Modules

### **Videos Module**

The **`videos/`** module is the core of the app, handling all video-related logic. It interacts with both the database and the Wistia API to sync, manage, and expose video data.

- **Video Entity**: Defines the structure of video data (e.g., ID, title, visibility, tags, plays).
- **VideosService**: Handles business logic for fetching, updating, and syncing videos.
- **VideosController**: Exposes REST API endpoints for fetching videos and managing visibility.
- **Wistia Sync**: Periodically syncs videos with the Wistia API to keep local data up to date.

Check out the [Video Sync](../features/video-sync.md) document for a deeper dive into the syncing logic.

### **Tags Module**

The **`tags/`** module handles video tagging functionality, allowing users to categorize videos with relevant tags.

- **Tag Entity**: Defines the structure of a tag (e.g., ID, name, associated videos).
- **TagsService**: Contains logic for creating, fetching, and updating tags.
- **TagsController**: Exposes API endpoints for managing tags.

For more on how we handle tags, visit the [Tag Management](../features/tag-management.md) document.

### **Sync Module**

The **`sync/`** module ensures that the data in our local database is kept in sync with external sources, like Wistia.

- **SyncService**: This service is responsible for fetching data from the Wistia API and updating the local database. It also handles updating tags and video metadata (e.g., plays, visibility).
- **Redis Cache**: After syncing, the Redis cache is invalidated to ensure that fresh data is always available.

### **Redis Module**

Caching is handled through **Redis**, which helps us store video playlists and avoid redundant database queries.

- **Caching Playlists**: Playlists are cached for performance, and the cache is invalidated when videos or their visibility are updated.
- **Redis Integration**: The `RedisModule` configures the Redis client and provides it to services that require caching functionality.

---

## Database and Migrations

We use **TypeORM** as our Object Relational Mapper (ORM) to interact with the database. **Migrations** are used to manage schema changes over time, ensuring that we can update the database structure as the project evolves.

- **Migrations**: Our migration files modify the schema, such as creating the `videos` and `tags` tables. These migrations are run during deployment to ensure the database is up-to-date.

To learn more about our database structure, check out the [Database Schema](../database/README.md).

---

## API Layer

We expose a RESTful API that allows the frontend to interact with videos, tags, and other resources. Key endpoints include:

- **GET /videos**: Fetches a list of videos, possibly filtered by visibility.
- **PATCH /videos/sync**: Triggers the video sync with Wistia.
- **PATCH /videos/:id/visibility**: Toggles the visibility of a specific video.

The **ApiClientService** interacts with the Wistia API, making calls to fetch video data, update video stats, and handle errors gracefully.

For a full list of API endpoints, see our [API Documentation](../api/README.md).

---

## Testing Strategy

We use **Jest** for unit testing, ensuring that our services and controllers function as expected. Our tests cover:

- **Video Sync Logic**: Ensuring videos are correctly synced with Wistia.
- **Redis Cache**: Testing that caching and invalidation work as expected.
- **REST API**: Verifying that the API responds correctly to requests.

---

## Wrapping Up

This backend is designed to be modular, scalable, and maintainable, with a focus on syncing videos from Wistia, managing video tags, and providing a clean API for the frontend. By using NestJS, TypeScript, and Redis, we’ve built a robust foundation that can handle future growth and complexity.

If you have any questions about the backend or want to explore specific areas, check out the related documentation or dive into the code! We’ve also anticipated some common questions, so head over to [Backend Pre-emptive Questions](./preemptive-questions.md) for more info.
