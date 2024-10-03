# Pre-emptive Questions and Answers: API

We’ve designed the API to be intuitive and straightforward, but we know there are always going to be questions! Below are some of the most common questions we’ve anticipated, along with explanations of why we made the choices we did. This should give you a solid understanding of the reasoning behind our API design.

---

## 1. Why did you choose REST over GraphQL?

We chose **REST** because it aligns with our goals of simplicity, predictability, and performance. While **GraphQL** offers more flexibility in querying data, it also introduces complexity that we don’t need right now.

- **Simplicity**: RESTful APIs are easier to implement and understand. The structure is clear—each endpoint corresponds to a resource, and it’s easy to know what data you’ll get back.

- **Less overhead**: GraphQL requires setting up a schema and handling more complex queries on the server side. For now, REST gives us what we need with less initial setup and complexity.

- **Easier caching**: REST integrates smoothly with our **Redis** caching layer. Since REST endpoints have clear, predictable resource paths, it’s easier to cache responses and improve performance.

That said, we’re open to the idea of using GraphQL in the future if our API requirements grow more complex.

---

## 2. Why did you make an endpoint for manually syncing with the Wistia API?

We opted for a **manual sync** endpoint (`/videos/sync`) for now to keep things simple and maintain control over when data is updated.

- **Control**: With a manual sync, we can trigger updates to the database on our own schedule, ensuring that we aren’t relying too heavily on Wistia for every request.
- **Efficiency**: Syncing manually reduces the number of API calls we make to Wistia, which helps prevent issues like rate limiting and improves overall system performance.

### But is this sustainable as the project grows?

**No, but it’s simple for now.** As the system scales, we’ll likely move to an automated sync strategy where the Wistia API data is refreshed more frequently or in real-time. For the moment, manual syncing keeps things lightweight and performant.

---

## 3. Why did you design the API around videos and tags?

We structured the API around **videos** and **tags** because these are the core entities in our system.

- **Videos**: The primary resource of the app is videos. Everything else (tags, playlists, etc.) revolves around how users interact with these videos.

- **Tags**: Tags are essential for organizing and filtering videos. By keeping tags as a separate resource, we make it easy to manage relationships between videos and their metadata, and provide efficient querying for filtering content.

This structure ensures that the API is flexible enough to handle current use cases, but can also scale as new features are added.

---

## 4. What’s your approach to API versioning?

Right now, we’re using a **versionless API** to keep things simple during the early stages of the project. As the API grows, we’ll introduce versioning to ensure backward compatibility and avoid breaking changes for existing clients.

- **Why versionless?**: Since the project is still evolving and the user base is relatively small, it’s easier to iterate quickly without the overhead of managing multiple API versions. This allows us to make changes and improvements without worrying about maintaining legacy versions.

- **When will you introduce versioning?**: We’ll likely introduce versioning when the API stabilizes or when we release features that could break existing functionality. This will ensure that new features can coexist with older versions of the API without causing issues for clients.

---

## Wrapping Up

We hope these answers clarify the reasoning behind our API design choices. We’re always thinking ahead about scalability and performance while keeping things simple and developer-friendly. If you want more technical details, check out the [API Overview](./README.md) and [API Trade-offs](./tradeoffs.md) documents!
