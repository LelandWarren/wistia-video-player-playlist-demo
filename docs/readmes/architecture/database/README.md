# Database Architecture Overview

Let’s dive into the heart of our data—our database! This document covers how we’ve structured our database, the key entities, and the relationships between them. We’ll also walk through why we made certain design choices and how the database helps support the overall functionality of the project.

---

## Database Technology: PostgreSQL + TypeORM

We’ve opted to use **PostgreSQL** as our database management system, along with **TypeORM** for object-relational mapping. Here’s why:

- **PostgreSQL**: It’s powerful, open-source, and highly reliable. It also provides great support for relational data and complex queries, making it perfect for handling our video and tag relationships.
- **TypeORM**: This ORM integrates seamlessly with **NestJS**, supports TypeScript, and makes managing database entities, relationships, and migrations straightforward. It’s designed for scalability, helping us grow our schema as the project evolves.

For more details on our ORM choice, check out the [Backend Trade-offs](../backend/tradeoffs.md) document.

---

## Key Entities

### 1. **Video Entity**

The **Video** entity is the backbone of our application. Each video entry represents a video from Wistia, along with some custom metadata that’s specific to our app.

- **Key Fields**:
  - `id`: The unique identifier for the video in our database.
  - `wistiaHashedId`: The Wistia-specific hashed ID, which we use to embed and reference the video.
  - `title`: The video’s title.
  - `plays`: The number of times the video has been played.
  - `thumbnailUrl`: A URL to the video’s thumbnail image.
  - `visible`: A custom boolean field we added to control video visibility in our app.
  - `duration`: The length of the video (in seconds).
- **Relationships**:
  - **Many-to-Many**: Videos can have multiple tags, and tags can apply to multiple videos. This is represented via a join table between the `videos` and `tags` entities.

### 2. **Tag Entity**

The **Tag** entity allows us to categorize and filter videos. Users can add multiple tags to a video, making it easier to search and organize content.

- **Key Fields**:
  - `id`: The unique identifier for each tag.
  - `name`: The name of the tag (e.g., “Tutorial”, “Product Demo”).
- **Relationships**:
  - **Many-to-Many**: Each tag can apply to multiple videos, and a video can have many tags. This is managed through a join table (`video_tags`), ensuring the relationship is flexible and scalable.

---

## Database Relationships

Our database structure follows a **many-to-many relationship** model between **videos** and **tags**. Here’s why:

- **Why Many-to-Many?**: This allows us to link multiple tags to a single video and vice versa, offering flexibility in categorizing videos. As the content grows, users can filter videos by tags, enhancing the user experience.

- **Join Table (`video_tags`)**: To efficiently manage this many-to-many relationship, we use a join table called `video_tags`, which stores the association between videos and their tags. This design keeps the database normalized and queryable.

For more details on why we chose this structure over alternatives like JSONB columns, check out our [Database Trade-offs](./tradeoffs.md) document.

---

## Why Store API Data in the Database?

You might wonder—why store Wistia video data in our own database when we can just call the API? There are a few important reasons:

- **Scalability**: As the app scales and more users interact with videos, constantly hitting the Wistia API for every request would introduce latency and potentially exhaust rate limits. Storing video data locally ensures faster response times and reduces dependency on external services.

- **Custom Fields**: Wistia doesn’t store custom attributes like `visible` (which controls whether a video is publicly shown). By keeping this data in our own database, we can customize it and maintain full control over video visibility.

---

## Migrations

We use **TypeORM** migrations to manage database schema changes over time. This helps us evolve the database structure without losing data or breaking the app.

- **Why Migrations?**: As the project grows, we’ll likely need to add or modify tables, fields, or relationships. Migrations allow us to apply these changes incrementally and consistently across development, staging, and production environments.

- **Example Migrations**:
  - Creating the `videos` and `tags` tables.
  - Setting up the `video_tags` join table for the many-to-many relationship.

You can find the actual migration files in the `/migrations` folder, which ensure the schema is up-to-date in all environments.

---

## Performance Considerations

We’ve taken a few steps to optimize the database for performance:

- **Indexing**: We’ve added indexes to commonly queried fields, such as `wistiaHashedId` and `title`, to improve query performance.
- **Caching**: Redis is used to cache frequently accessed data, such as video playlists, reducing the need to constantly hit the database for common queries.

Caching and indexing work hand-in-hand to ensure the database scales as the number of videos and tags grows.

---

## Future Improvements

While the current database structure works well for now, here are some potential future improvements:

- **Sharding/Partitioning**: As the dataset grows, we may explore database sharding or partitioning strategies to handle even larger amounts of data efficiently.
- **Full-Text Search**: For more complex search functionality, we could introduce full-text search indexes on fields like `title` or `tags`, enhancing user search experiences.
- **Read Replicas**: If database read traffic increases significantly, we could introduce read replicas to distribute the load and keep performance high.

---

## Wrapping Up

That’s the lowdown on how we’ve structured the database! The current setup is designed to be flexible and scalable, with many-to-many relationships between videos and tags, custom attributes that Wistia doesn’t provide, and migration support to help us evolve the schema over time.

If you have more questions or want to dive deeper into the schema design, check out the [Database Trade-offs](./tradeoffs.md) and [Pre-emptive Questions](./preemptive-questions.md) documents for more insight.
