# Architecture Trade-offs and Justifications

Every architectural decision we make comes with trade-offs. In this document, we’ll walk through some of the key choices we made while building the project, why we made them, and what alternatives we considered. This will give you insight into the thought process behind the structure and design of both the frontend and backend systems.

---

## 1. NestJS for the Backend vs. Express.js or Fastify

### Why we chose NestJS

We opted for **NestJS** for its strong modular structure and built-in features like dependency injection, validation, and routing. It’s perfect for scaling applications and fits nicely with TypeScript, which we’re using across the stack.

- **Pros**:
  - **Modular architecture**: Clean separation of concerns via modules, controllers, and services.
  - **TypeScript-first**: Built-in TypeScript support, making it easier to maintain type safety across the backend.
  - **Built-in tools**: NestJS offers out-of-the-box support for things like validation, guards, interceptors, which cut down on custom boilerplate code.

### Alternatives considered:

- **Express.js**: The go-to Node.js framework. While simpler and faster to set up, Express would require more boilerplate for organizing the project at scale, especially when it comes to things like dependency injection and validation. We would have needed to pull in a lot of third-party libraries to achieve the same level of functionality.
- **Fastify**: Another alternative known for its speed. Fastify is great for performance-focused applications, but it’s more low-level and would require more custom code for things like request validation and routing. NestJS provided a more robust solution out of the box for our needs.

In the end, **NestJS** offered us a balance between developer productivity, maintainability, and scalability, which is why it won out.

---

## 2. TypeORM for Database Management vs. Sequelize or Prisma

### Why we chose TypeORM

**TypeORM** was chosen because of its deep integration with NestJS and its ability to support both active record and data mapper patterns. It also has great support for migrations, making it easier to manage our database schema.

- **Pros**:
  - **TypeScript support**: Strong typing with our database entities, helping prevent runtime errors.
  - **Migrations**: Simplified database migrations ensure schema changes are trackable and manageable.
  - **Modularity**: It fits perfectly with NestJS and integrates smoothly into the service and repository layers.

### Alternatives considered:

- **Sequelize**: A well-known ORM, but it uses a different model structure that doesn’t align as naturally with TypeScript. Sequelize is also more "JavaScript-first," making TypeORM feel like a better fit for this TypeScript-heavy project.
- **Prisma**: Prisma offers an excellent developer experience and is known for being fast and type-safe. However, Prisma lacks the traditional migration tools that TypeORM offers, and it is more opinionated in how it works with databases. We wanted more flexibility with migrations and custom queries, which TypeORM handled better for us.

While Prisma is neat, **TypeORM** fit more seamlessly with the existing NestJS structure and gave us the control we needed for database migrations.

---

## 3. Redis for Caching vs. No Caching Layer or Memcached

### Why we chose Redis

We introduced **Redis** as a caching layer to store commonly accessed data like video playlists. This speeds up response times and reduces the load on our database.

- **Pros**:
  - **In-memory caching**: Redis stores data in memory, providing fast access to frequently requested data.
  - **Scalability**: Redis works well for scaling distributed applications, allowing us to cache data across multiple instances.
  - **Integration**: Redis integrates easily with NestJS, making it straightforward to manage caching and cache invalidation.

### Alternatives considered:

- **No caching layer**: For smaller applications, you can often get away without using a caching layer. However, as our app scales and we have more users accessing the same playlists and video data, caching becomes crucial for performance.
- **Memcached**: Another popular caching tool. While it’s fast, Redis offers more flexibility with data structures and persistence, which is something Memcached lacks. Redis also has better community support and documentation, making it easier to implement.

Given Redis’s flexibility and performance, it was the best choice for our use case.

---

## 4. Axios for API Requests vs. Fetch or Request-Promise

### Why we chose Axios

We went with **Axios** for handling HTTP requests to the Wistia API and other external services. Axios is a well-documented and reliable library for making API requests and handling responses.

- **Pros**:
  - **Interceptors**: Axios’s interceptors allow us to globally handle request and response logic (e.g., error handling, authentication headers).
  - **Promise-based**: Works seamlessly with async/await and is easy to use.
  - **Request Cancellation**: Built-in support for canceling requests makes Axios a powerful tool for handling various API-related edge cases.

### Alternatives considered:

- **Fetch**: The native `fetch` API could have worked, but it lacks features like interceptors and doesn’t handle errors as gracefully as Axios. We would have had to build more custom functionality around `fetch` to get the same level of control.
- **Request-Promise**: A popular choice in Node.js applications, but it has become somewhat outdated with Axios and Fetch becoming the de facto standards for API requests.

In the end, **Axios** gave us the best balance between simplicity, flexibility, and functionality for handling API requests.

---

## Wrapping Up

By prioritizing maintainability, scalability, and developer productivity, we believe the choices we made set us up for success as the project grows.

If you’re curious about any of these decisions or have suggestions for improvements, feel free to dive deeper into the code or check out our [Pre-emptive Questions](../backend/preemptive-questions.md) document for more context.
