# API Design Trade-offs and Justification

Every API design involves some trade-offs. In this document, we’ll walk through the key decisions we made for our API, why we made them, and what alternatives we considered. By understanding these trade-offs, you’ll get a clearer picture of how we’ve balanced simplicity, scalability, and performance for the project.

---

## 1. REST vs. GraphQL

### Why we chose REST

We chose a **RESTful** API because it’s simple, predictable, and well-understood by most developers. Here’s why REST made sense for us:

- **Simplicity**: REST provides a clear mapping between resources and endpoints (e.g., videos, tags, playlists). It’s easy to implement and scales well for the current project scope.
- **Familiarity**: Most developers are familiar with REST, so onboarding is straightforward. It’s also easier to test and document using tools like Postman or Swagger.

- **Reduced Complexity**: While **GraphQL** offers flexibility by allowing clients to query exactly what they need, it introduces more complexity on the server-side. For our current needs, REST is simpler to maintain and doesn’t require the added layer of schema management that GraphQL demands.

### Alternatives considered:

- **GraphQL**: We seriously considered GraphQL, especially for its flexibility. It would allow clients to avoid over-fetching or under-fetching data by letting them define exactly what they need from the API. This could have been beneficial as our app grows and needs become more complex.
- **Why we didn’t use GraphQL (for now)**: While GraphQL provides a powerful querying mechanism, it also introduces complexity in areas like security, caching, and performance optimization. For our current needs—simple and predictable data access—**REST** provides the right balance of functionality and simplicity. We may revisit GraphQL in the future as the app evolves.

---

## 2. Manual Sync Endpoint vs. Real-Time Sync with Wistia

### Why we chose a manual sync

We implemented a **manual sync** endpoint (`/videos/sync`) to pull data from the Wistia API into our local database. This was a deliberate choice to keep things simple and under our control.

- **Control**: By manually triggering the sync, we can ensure our data stays consistent without overwhelming Wistia’s API or risking rate limits.
- **Reduced API Calls**: Syncing periodically reduces the load on the Wistia API, meaning we’re not constantly pulling data every time a request is made. This keeps our app fast while ensuring up-to-date content.

### Alternatives considered:

- **Real-time Sync**: We considered setting up real-time syncing with Wistia, where changes made to videos would automatically update our database.

- **Why not real-time sync**: Real-time syncing would introduce additional complexity and require more robust event-handling infrastructure. We’d need to deal with potential delays, failure handling, and more API calls, which could lead to increased latency. A **manual sync** allows us to control the timing and scope of updates, ensuring the system stays lightweight and performant for now.

---

## 3. Local Storage of Wistia Data vs. API Calls on Demand

### Why we chose local storage

We decided to **store Wistia data locally** in our database instead of calling the Wistia API every time we need video information. Here’s why:

- **Performance**: Storing data locally allows us to serve requests faster. Constantly calling the Wistia API would introduce latency, especially as the number of users grows.
- **Custom Attributes**: Wistia doesn’t store all the data we need. For instance, the `visible` attribute (which controls video visibility) is something we manage internally. By storing this data locally, we have full control over the video metadata.

### Alternatives considered:

- **Calling Wistia API on demand**: This approach would involve making a call to Wistia’s API every time a video is requested, eliminating the need to store data locally.

- **Why not use API calls on demand**: While it might seem simpler initially, relying on external APIs for every request can lead to performance bottlenecks. It also makes the app vulnerable to Wistia’s rate limits or potential downtime. By storing data locally, we ensure faster response times and greater control over custom fields.

---

## 4. Versionless API vs. Versioning Strategy

### Why we chose versionless (for now)

At the moment, we’ve opted for a **versionless API**, keeping things simple while the project is in its early stages.

- **Simplicity**: A versionless API reduces the complexity of maintaining multiple versions of the same functionality. This works well while the project is in development and the user base is still relatively small.
- **Flexibility**: Without versioning, we have more flexibility to make changes or improvements to the API without maintaining backward compatibility for now.

### Alternatives considered:

- **Versioning Strategy**: We considered implementing versioning (e.g., `/v1/`, `/v2/`) to ensure backward compatibility as the API evolves.

- **Why not versioning (yet)**: Versioning is important once the API reaches a wider audience or when breaking changes are introduced. Right now, we can iterate quickly without the overhead of managing multiple versions. As the API matures, we’ll revisit this strategy.

---

## Wrapping Up

The design decisions we made for the API are all about finding a balance between simplicity, performance, and scalability. From using REST over GraphQL to caching with Redis and opting for manual syncs, each choice has been driven by the current needs of the project while keeping future growth in mind.

As the project evolves, we’ll likely revisit some of these trade-offs and adjust them to meet the changing demands of the system. If you want to dive deeper into any of these topics, check out our [API Overview](./README.md) or [Pre-emptive Questions](./preemptive-questions.md) documents for more details!
