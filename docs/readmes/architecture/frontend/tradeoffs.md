# Frontend Architecture Trade-offs and Justification

Every technical decision comes with trade-offs. When building a frontend, especially one that handles both public-facing video playback and admin functionality, we had to make some critical choices to balance flexibility, performance, and simplicity. Here’s a breakdown of those key trade-offs, why we made them, and what it means for the overall project.

---

## 1. Vue.js vs the old client folder

### Why we chose Vue.js

We picked **Vue.js** over the client folder HTML for its simplicity, especially when scaling up to larger projects. Vue’s syntax is more approachable, and it also handles reactivity out of the box.

- **Pros**:
  - Easier learning curve compared to React.
  - Built-in reactivity and state management patterns (no need for external libraries like Redux).
  - More concise code for common tasks like data binding and component lifecycles.
- **Cons**:
  - A little hard to handle DOM-manipulative libraries like Wistia's Javascript API
  - Other frameworks like React have more third-party support and popularity in the job market.

For this project, Vue’s simplicity and flexibility made it the right fit, especially with its well-rounded ecosystem for building both single-page apps and complex admin interfaces.

---

## 2. Vuex for State Management

### Why we used Vuex

We decided to use **Vuex** for global state management, as it integrates natively with Vue and handles complex state flows well. For our needs—tracking the current video, managing visibility states, and syncing admin actions—Vuex provides a clean, centralized way to handle state.

- **Pros**:

  - Vuex simplifies state sharing between components, eliminating the need for complex prop drilling.
  - Works seamlessly with Vue’s reactivity model.
  - Scalable for future features, like user accounts or more complex video management.

- **Cons**:
  - Overhead: Vuex can be overkill for smaller state needs. Simple applications might not need a centralized store.
  - Boilerplate: Setting up mutations, actions, and getters adds extra boilerplate code.

Given that our app needs a centralized store for managing videos, visibility, and tags, Vuex was worth the extra setup time. For smaller projects, we might have gone with simpler local state management, but Vuex provides better long-term scalability.

---

## 3. TypeScript Integration

### Why we chose TypeScript

We decided to integrate **TypeScript** into the project to help with static typing and catch bugs earlier. TypeScript forces us to be explicit about data structures, which is especially useful in components that deal with API responses (like video data or tag management).

- **Pros**:

  - Type safety helps prevent runtime errors and increases code reliability.
  - Autocompletion and refactoring are easier with TypeScript, making development faster in the long run.
  - Helps ensure that API responses (like video objects) are correctly handled.

- **Cons**:
  - Slight learning curve for developers new to TypeScript.
  - More verbose: Sometimes TypeScript can add unnecessary complexity for smaller or simpler components.

In our case, the benefits of type safety outweighed the verbosity, especially since our app deals with structured data (videos, tags) where incorrect typing could cause bugs.

---

## 4. Axios for API Requests

### Why Axios?

We used **Axios** for handling API requests. While Vue.js has its own built-in fetch support, Axios offers more flexibility for handling edge cases like request timeouts, automatic JSON parsing, and interceptors for modifying requests or responses globally.

- **Pros**:

  - Better error handling out of the box compared to the native `fetch` API.
  - Support for interceptors, which makes it easy to handle things like authentication or logging in one place.
  - Cleaner syntax for handling promises and async requests.

- **Cons**:
  - Slightly larger bundle size compared to using native `fetch`.
  - For simple GET/POST requests, Axios might feel like overkill.

For this project, Axios’ added features, like request cancellation and global error handling, made it the better choice given the complexity of our API interactions.

---

## 5. Lazy Loading Components

### Why we lazy-loaded routes

We chose to **lazy-load components** for routes like the admin view to optimize initial page load times. This means that components are only loaded when needed, rather than all upfront.

- **Pros**:
  - Reduces initial bundle size, improving performance for first-time visitors.
  - Loads components asynchronously, speeding up perceived load times for users.
- **Cons**:
  - Adds a bit of complexity when managing routes and ensuring all dependencies are loaded.
  - Some small delay when navigating to a lazy-loaded page for the first time.

For this project, the performance gains for end-users, especially those interacting with public content, made lazy loading a clear choice. Admins can afford the small delay when navigating to the admin interface.

---

## 6. Vue Router for Navigation

### Why we chose Vue Router

We went with **Vue Router** for handling navigation within the app. It integrates naturally with Vue and allows us to manage dynamic routes (like playlists or admin views) with minimal configuration.

- **Pros**:

  - Seamless integration with Vue.js.
  - Easy route management, including nested routes and dynamic parameters.
  - Supports lazy loading, which helps improve performance for large apps.

- **Cons**:
  - For very complex apps with lots of nested routing, Vue Router can get difficult to manage.
  - Might feel limited for applications that need more complex routing logic (like multi-level authentication or conditional routes).

Vue Router strikes a good balance between simplicity and flexibility, and it was an obvious choice given our use of Vue for the frontend framework.

---

## 7. Component-Based UI Design

### Why we chose component-based design

We followed **component-based design** principles to keep the frontend modular and scalable. This means each piece of functionality (like the video player, playlist, admin tools) is self-contained, making it easy to maintain and reuse across different parts of the app.

- **Pros**:

  - Reusability: Components like the `WistiaPlayer` or `TagModal` can be reused in multiple places.
  - Scalability: The app can grow by simply adding more components, without major restructuring.
  - Maintainability: Isolated components are easier to debug and test.

- **Cons**:
  - Can sometimes lead to “over-engineering” if components are split into very small pieces unnecessarily.
  - Passing data between components can sometimes lead to complexity (though this is mitigated by Vuex).

For a video-heavy app with admin functionality, a component-based approach allowed us to split features cleanly while maintaining reusability.

---

## Wrapping Up

All of these trade-offs were made with the project’s scalability, maintainability, and performance in mind. By choosing Vue.js, Vuex, and TypeScript, we’ve built a solid foundation for both public-facing users and admins alike. While some decisions introduced more setup or complexity (like TypeScript and Vuex), the long-term benefits of reliability and flexibility far outweigh those initial costs.

If you’re curious about other decisions or need clarification on any of these trade-offs, feel free to explore the [Frontend Pre-emptive Questions](./preemptive-questions.md) for more insights.
