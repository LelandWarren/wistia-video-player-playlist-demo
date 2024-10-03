# Database Design Trade-offs and Justifications

Every database design decision involves trade-offs. In this document, we’ll cover the key decisions we made when structuring our database, why we made them, and the alternatives we considered along the way. This will help you understand our thinking and how we’re preparing the database to scale as the project grows.

---

## 1. Relational Database (PostgreSQL) vs. NoSQL (MongoDB)

### Why we chose PostgreSQL

We opted for **PostgreSQL**, a relational database, because our data is highly structured and the relationships between entities (like videos and tags) are well-defined.

- **Pros**:
  - **ACID Compliance**: PostgreSQL ensures data integrity through ACID (Atomicity, Consistency, Isolation, Durability) transactions, which is essential when dealing with critical data like video visibility or tags.
  - **Strong Schema**: A relational database with a well-defined schema helps ensure data consistency, reducing the chance of errors.
  - **Complex Queries**: PostgreSQL excels at handling complex queries and joins, which we need for querying videos with their associated tags or managing playlists.

### Alternatives considered:

- **MongoDB (NoSQL)**: While MongoDB provides flexibility with its schema-less design, our data is inherently relational. A NoSQL solution would have required more complex querying, especially for many-to-many relationships like videos and tags.
- **Why NoSQL didn’t work**: NoSQL databases are great for unstructured or semi-structured data, but in our case, the structure was clear from the start. A relational database like PostgreSQL was a natural fit for enforcing relationships and ensuring consistency across entities.

In the end, **PostgreSQL** offered the right balance of reliability, scalability, and support for relational data, which is why it won out over NoSQL alternatives.

---

## 2. Storing Wistia Data Locally vs. Calling the API Directly

### Why we chose to store Wistia data locally

We decided to store video data from the Wistia API in our own database, rather than calling the API for every request.

- **Pros**:
  - **Performance**: By storing data locally, we avoid the latency and potential downtime of relying on an external API for every request.
  - **Scalability**: As our user base grows, calling Wistia’s API for every video request would introduce significant overhead and slow down response times.
  - **Custom Fields**: Wistia doesn’t store all the data we need. For example, the `visible` attribute, which controls whether a video is publicly available, is something we manage ourselves.

### Alternatives considered:

- **Calling the Wistia API Directly**: While calling the API directly might have simplified initial development, it would have led to performance issues down the road, especially as the number of users grew. Additionally, Wistia doesn’t provide some of the custom fields we need, so we would have needed a workaround.

- **Why not Wistia-only?**: Constantly relying on the API would make us vulnerable to rate limits, API downtime, and performance bottlenecks. Storing data locally gives us control and speed, with the added benefit of being able to store custom fields.

Storing data locally gives us the best of both worlds—reliability, speed, and flexibility for custom fields.

---

## 3. Redis Caching vs. No Caching Layer

### Why we chose Redis for caching

We introduced **Redis** to cache frequently accessed data like video playlists. This reduces the load on the database and speeds up API response times.

- **Pros**:
  - **In-memory storage**: Redis is lightning-fast because it stores data in memory, making it ideal for caching frequently accessed data.
  - **Scalability**: Redis helps us scale by reducing the load on the database as more users interact with the system.
  - **Expiration**: We can set expiration times on cached data, ensuring that it stays fresh and up-to-date.

### Alternatives considered:

- **No Caching**: For smaller applications, you can often get away without using a caching layer. But as our app grows, we expect high traffic on certain endpoints (like video playlists), and caching becomes essential for maintaining performance.
- **Memcached**: Memcached is another popular caching tool. However, Redis offered more flexibility with data structures (like lists and sets) and better support for persistence, making it a better fit for our needs.

**Redis** was the clear winner here, providing the performance boost we needed as our app scales.

---

## 4. Indexing Key Fields vs. No Indexing

### Why we chose to index key fields

To ensure fast lookups and efficient queries, we added indexes to commonly queried fields like `wistiaHashedId`, `title`, and `tags`.

- **Pros**:
  - **Faster queries**: Indexes dramatically improve performance when querying large datasets, especially when filtering by video title or tags.
  - **Scalability**: As the dataset grows, indexing helps maintain quick response times even as the number of rows increases.

### Alternatives considered:

- **No Indexing**: While skipping indexing would simplify the schema, it would quickly lead to slow queries as the database grows. Indexing is essential for ensuring that the app remains responsive even as the dataset scales.

By indexing key fields, we ensure that the database can handle large datasets without sacrificing performance.

---

## Wrapping Up

Each database design decision we made was about balancing simplicity, performance, and scalability. By using a relational database, many-to-many relationships, local storage of API data, and caching, we’ve set up a structure that works well now and will continue to work as the project grows.

If you want to dive deeper into any of these decisions or see how they fit into the bigger picture, check out our [Database Schema](./README.md) or [Pre-emptive Questions](./preemptive-questions.md) documents for more insight.
