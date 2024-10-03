# Pre-emptive Questions and Answers: Database Architecture

We know that good database design raises a lot of questions—so we’re here to answer some of the most common ones. Below, we’ll cover everything from why we chose PostgreSQL to the reasoning behind our table schema. Let’s dive in!

---

## 1. Why PostgreSQL?

We chose **PostgreSQL** for a few key reasons:

- **Relational Data**: Our data is highly structured, with clear relationships between entities (like videos and tags). PostgreSQL is designed for handling these types of relationships with ease.
- **ACID Compliance**: PostgreSQL guarantees **Atomicity, Consistency, Isolation, and Durability** (ACID), which is crucial for maintaining data integrity. This means we can handle transactions with confidence, knowing that our data won’t get into an inconsistent state.

- **Scalability**: PostgreSQL is known for handling large datasets and complex queries efficiently. As we scale, PostgreSQL can scale with us, ensuring we maintain performance even with a growing user base.

- **Community & Ecosystem**: PostgreSQL has a strong, active community, and its ecosystem of extensions and tools makes it easy to extend and enhance as our needs evolve.

---

## 2. Why not NoSQL?

Good question! NoSQL databases like MongoDB are great for certain use cases, but they didn’t quite fit the bill for our project:

- **Relational Data**: Our data is highly structured, with clear relationships between videos and tags, which is what relational databases are designed for. In NoSQL, we’d have to deal with more complex queries and data denormalization, which doesn’t suit our needs.
- **Consistency Over Flexibility**: NoSQL is great if you need flexibility in your schema or you’re dealing with unstructured data. However, we benefit more from the consistency and structure that PostgreSQL provides. We need to ensure that our data stays relational and consistent as it grows.

In short, **PostgreSQL** fits our project’s needs better by providing structured data handling, strong integrity, and performance at scale.

---

## 3. What’s the reasoning behind your table schema?

Our schema was designed with a focus on **data normalization** and **relational integrity**. Here’s a quick breakdown:

- **Videos Table**: This table stores information about each video (e.g., title, play count, duration, visibility). We chose to store Wistia-specific data like `wistiaHashedId` so we can reference and embed videos easily while still maintaining custom fields like `visible`.

- **Tags Table**: Tags are stored in their own table to keep things modular and flexible. This allows us to attach multiple tags to a single video and reuse tags across different videos.

- **Many-to-Many Relationships**: Videos and tags are connected via a **many-to-many relationship**, which we handle using a join table (`video_tags`). This approach allows us to easily query videos by their tags or tags by their videos, without duplicating data.

We chose this schema to keep the database normalized, minimize redundancy, and make querying efficient as the dataset grows.

---

## 4. Why not use JSONB columns for tags?

Using **JSONB** columns to store tags was definitely considered, but we ultimately decided against it for a few reasons:

- **Query Complexity**: While storing tags as JSON would make the schema simpler, querying it would become more complex. For example, filtering videos by a specific tag would require more complex queries, which would slow things down as the dataset grows.

- **Data Integrity**: With a separate `tags` table and a join table (`video_tags`), we can ensure relational integrity. Using JSONB fields could lead to data inconsistencies, as there wouldn’t be a reliable way to enforce the relationships between videos and tags.

- **Scalability**: As the dataset grows, maintaining a many-to-many relationship with a proper schema (via join tables) is more scalable and performant than using JSONB fields for unstructured data.

In short, while JSONB provides flexibility, we chose the traditional relational approach to ensure **scalability, integrity, and query performance**.

---

## 5. Why store Wistia data locally?

You might wonder why we don’t just call the Wistia API every time we need video data. Here’s why:

- **Performance**: Constantly calling an external API like Wistia would introduce unnecessary latency, especially as the number of users grows. By storing the data locally, we reduce response times and keep things snappy.
- **Custom Attributes**: Wistia doesn’t store everything we need. For example, the `visible` attribute (which controls whether a video is publicly shown or hidden) is specific to our app. Storing the data locally allows us to track these custom attributes.

- **API Limits**: Calling the Wistia API for every request could lead to hitting rate limits or facing API downtime. By syncing the data and storing it locally, we avoid these issues and maintain control over our app’s availability.

---

## 6. Why many-to-many relationships for videos and tags?

We chose to model the relationship between **videos** and **tags** as many-to-many for a few reasons:

- **Flexibility**: Each video can have multiple tags, and each tag can be associated with multiple videos. This allows us to easily filter and categorize content without duplicating data.
- **Efficiency**: The join table (`video_tags`) lets us query relationships efficiently, and by keeping the schema normalized, we avoid redundancy.

- **Scalability**: As more videos and tags are added, the many-to-many relationship scales well and keeps the database manageable. Querying the relationships is fast, and adding new tags or videos doesn’t involve restructuring the database.

This model gives us the flexibility and scalability we need as the app grows, while also keeping the schema clean and performant.

---

## 7. How do you handle schema changes?

We use **TypeORM** migrations to manage schema changes over time. Here’s why:

- **Controlled Updates**: With migrations, we can evolve the database schema without losing data or creating inconsistencies. Migrations allow us to add, remove, or modify tables and fields in a controlled manner.

- **Versioning**: Each migration is versioned, so we can easily track changes and roll back if needed. This makes it easy to collaborate across development teams and keep all environments (dev, staging, production) in sync.

- **Scalability**: As the project grows, schema changes will become inevitable. Migrations give us the ability to scale the database without introducing downtime or errors.

For more details on how we handle migrations, check out our [Database Schema](./README.md) and [Backend Trade-offs](../backend/tradeoffs.md) documents.

---

## Wrapping Up

We designed the database to be scalable, flexible, and easy to maintain as the project grows. PostgreSQL provides the stability and structure we need, while the many-to-many relationships and TypeORM migrations ensure we can handle evolving data needs. If you have any other questions or need more context, check out the [Database Schema](./README.md) or [Database Trade-offs](./tradeoffs.md) documents!
