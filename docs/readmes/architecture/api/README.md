# API Design and Endpoints Overview

This document provides an overview of how the API is designed, the core principles we followed, and a breakdown of the key endpoints. Whether you're curious about how data flows through the system or you want to understand the reasoning behind certain design choices, we've got you covered!

---

## API Design Principles

Our API was designed with a few core principles in mind:

- **Simplicity**: We aimed to keep the API as simple and intuitive as possible. Each endpoint is designed for a specific task, avoiding unnecessary complexity.
- **Consistency**: Every endpoint follows RESTful conventions. This ensures that the API is predictable, making it easier for developers to interact with.

- **Efficiency**: We use caching (with Redis) to minimize the number of external calls to Wistia and reduce the load on our database. This leads to faster response times for commonly accessed data.

- **Scalability**: As the project grows, we can easily extend the API without breaking existing functionality. Versioning strategies and endpoint flexibility allow us to evolve the API over time.

---

## RESTful Design

We went with a **RESTful** approach for the API because it provides a solid foundation that most developers are familiar with. Here’s why:

- **Clear resource structure**: REST revolves around resources, which in our case include videos, tags, and playlists. This makes it easy to map functionality to endpoints.
- **Simple and predictable**: By following REST conventions, the API remains predictable. Actions like retrieving data (`GET`), creating resources (`POST`), and updating resources (`PATCH`) are standardized.

- **Scalability**: REST is inherently scalable and can be extended with new resources or endpoints as needed. While GraphQL was considered, REST was chosen to keep things simple and reliable for now.

For more insight into this decision, check out our [API Trade-offs](./tradeoffs.md) document.

---

## Key Endpoints

Here’s a breakdown of the most important endpoints in our API:

### 1. **Video Endpoints**

Videos are at the heart of our application, so we have a range of endpoints for interacting with them:

- **GET /videos**: Fetches a list of all videos. This is a paginated endpoint to ensure we don’t overwhelm the client with too much data at once.

- **GET /videos/:id**: Retrieves detailed information about a specific video, including its Wistia hashed ID, play count, and custom attributes like `visible`.

- **PATCH /videos/sync**: Triggers a manual sync with the Wistia API to update our local database with the latest video data. This ensures our app stays in sync with Wistia without making constant API calls.

### 2. **Tag Endpoints**

Tags help organize and filter videos, so we have endpoints dedicated to managing them:

- **GET /tags**: Returns a list of all available tags, useful for filtering or categorizing videos.
- **POST /tags**: Allows the creation of new tags. This is useful for users or admins who want to introduce new ways to categorize content.

### 3. **Playlist Endpoints**

Our app supports playlists, allowing users to group and watch videos in sequence:

- **GET /playlists**: Retrieves all playlists along with their associated videos.
- **POST /playlists**: Creates a new playlist, allowing users to customize their video experience.

---

## Caching Strategy

We use **Redis** for caching frequently accessed data (like video lists and tags). This helps reduce the number of database queries and external API calls, significantly improving performance for high-traffic endpoints.

- **Why caching?**: Without caching, frequently hitting the database or Wistia API would introduce latency, especially for popular videos or playlists. Redis allows us to store data in memory for fast retrieval.

- **Expiration**: Cached data is set to expire after a certain period to ensure users always see up-to-date content. For example, video lists are refreshed after each sync with Wistia, ensuring we have the latest data without overloading our services.

---

## Future Considerations

While the current API design works well for our needs, we’re keeping a few things in mind for future scalability:

- **GraphQL**: While we opted for REST due to its simplicity, we might introduce **GraphQL** in the future. This would give clients more flexibility in querying exactly the data they need, reducing over-fetching and under-fetching.

- **Rate Limiting**: As the app scales, implementing rate limiting might become necessary to ensure fair usage and prevent abuse. This would ensure our API can handle high traffic while maintaining performance.

- **Versioning**: We’re committed to backward compatibility, so versioning will be introduced as the API evolves. This ensures new features or changes don’t break existing clients.

---

## Wrapping Up

That’s an overview of our API design! The goal was to keep things simple, efficient, and scalable while making it easy for developers to interact with our system. If you want more insight into the design decisions we made, check out our [API Trade-offs](./tradeoffs.md) and [Pre-emptive Questions](./preemptive-questions.md) documents for additional context.
