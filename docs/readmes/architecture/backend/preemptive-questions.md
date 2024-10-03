# Pre-emptive Questions and Answers: Backend Architecture

We know you’ve got some questions, and we’re here to answer them! Below are some of the most common (and anticipated) questions about how we built the backend, why we made certain choices, and what that means for the project as it grows.

---

## 1. Why did you make an endpoint for the Wistia API sync?

Great question! We created an endpoint for syncing with the Wistia API because we need to ensure our database stays in sync with Wistia. Here’s why:

- **Control**: We can trigger a sync whenever necessary, such as after a bulk update or a change in Wistia’s data. This allows us to keep our local video data accurate and up-to-date.
- **Flexibility**: Not all data from Wistia is relevant to the application, and we need to store extra metadata (e.g., video visibility) that Wistia doesn’t provide. Syncing allows us to merge the data we get from Wistia with what we need locally.

This endpoint keeps us in control of how and when we sync data, ensuring our database reflects the latest info without relying on real-time API calls that could slow down our system.

---

## 2. But is that plausible as the project grows?

Let’s be real—**no**, this approach won’t scale indefinitely. Right now, syncing via an endpoint works well because we don’t have a massive amount of data or users. It’s simple, easy to maintain, and good enough for our current needs.

- **Why it works for now**: We’re still a relatively small app, so manually triggering syncs keeps things under control without overcomplicating our architecture.
- **Future-proofing**: As we grow, we might need to move to a more scalable solution—such as scheduling automatic syncs via cron jobs, handling real-time events, or even using a queue system for incremental updates.

For now, this solution is simple and effective, but we’re aware that we’ll need to evolve as the app scales.

---

## 3. Why store API data in the database instead of just calling the API all the time?

Ah, the classic API vs. database question. Here’s the deal: calling an external API every time we need data sounds tempting, but it’s not great for **scalability** or **performance**.

- **Scalability**: Imagine having hundreds or thousands of users accessing video data at the same time. Constantly hitting the Wistia API would lead to slow response times and could even cause us to hit rate limits or experience downtime if the API is unavailable.
- **Custom Attributes**: Wistia doesn’t store everything we need. For example, the `visible` attribute (which controls whether a video is public or hidden) isn’t something Wistia provides. We need to track that ourselves, so storing the data locally is necessary.

By syncing and storing relevant data in our own database, we improve response times, have better control over custom fields, and avoid overloading Wistia’s API with unnecessary requests.

---

## 4. Why REST and not GraphQL?

Choosing between **REST** and **GraphQL** is like choosing between two really great tools—they both have their place, but REST made more sense for this project. Here’s why:

- **Simplicity**: REST is more widely understood and easier to implement for the project’s current scope. It’s straightforward, and we didn’t need the added complexity of GraphQL’s flexibility at this stage.
- **Granular Control**: With REST, we have tighter control over how data is requested and returned. Each endpoint is purpose-built, and we avoid over-fetching or under-fetching data by simply defining the response at the endpoint level.
- **Future Considerations**: GraphQL could be a good fit down the line if our API grows more complex or if we need to serve multiple clients with varying data needs. But for now, REST is the simplest and most efficient option for our use case.

GraphQL is powerful, but REST fits the current needs of the project without over-engineering things.

---

## 5. Why did you choose NestJS for the backend?

NestJS provides a modular structure, built-in dependency injection, and TypeScript support right out of the box. This means we can build scalable and maintainable code without having to reinvent the wheel every time we need a new feature.

- **Modularity**: Each feature (e.g., videos, tags, syncing) is isolated into its own module, making the code easier to maintain and scale.
- **TypeScript First**: Type safety is a big deal, and NestJS supports TypeScript without any friction, ensuring that we catch type-related bugs early.
- **Built-in features**: With NestJS, we get things like guards, interceptors, and validation built-in, so we don’t have to reinvent those solutions or manage a bunch of third-party libraries to achieve the same result.
- **I've used it before**: ...yea familiarity is pretty powerful. No shame.

In short, **NestJS** gave us everything we needed to build a scalable, maintainable backend with minimal friction.

---

## 6. Why use Redis for caching?

We use **Redis** for caching because it significantly speeds up response times for frequently accessed data like video playlists.

- **Performance Boost**: By storing frequently requested data in memory, Redis allows us to serve it up much faster than querying the database every time.
- **Scalability**: Redis is great for distributed systems, so as our app scales, Redis will help maintain fast access to key data across multiple instances.

It’s a lightweight, high-performance solution that fits our current architecture and helps us deliver faster response times to users.

---

## 7. Why not just use the Wistia API for everything?

Relying solely on the Wistia API might sound simple, but it comes with drawbacks:

- **Rate limits and downtime**: Constantly hitting the API opens us up to issues like rate limiting or downtime. If Wistia is down, our whole app could go down with it.
- **Custom data**: As mentioned earlier, we need to store attributes like video visibility that Wistia doesn’t track. Relying only on the API means we lose control over custom features and data.

By syncing data with Wistia and storing it locally, we get the best of both worlds: flexibility and scalability.

---

## Wrapping Up

We’ve made thoughtful decisions about the backend architecture based on the current needs of the project, but we also understand that things will evolve as we grow. If you have more questions or want a deeper dive into any of the topics above, feel free to explore the docs or reach out. We’re happy to answer any questions and keep things as transparent as possible!

For more context, check out the [Backend Trade-offs](./tradeoffs.md) and [API Documentation](../api/README.md).
