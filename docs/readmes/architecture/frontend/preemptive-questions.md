# Pre-emptive Questions: Frontend Architecture

We know you’ve probably got some questions about how we’ve set up the frontend, and we’ve anticipated a few of the more common ones. This doc breaks down the ‘whys’ behind our choices, giving you insight into the thinking behind the decisions. Let’s dive in!

---

## 1. Why did we choose Vue.js over just using simple HTML/JavaScript?

Great question! Using simple HTML and vanilla JavaScript can be perfect for smaller, static projects. But as soon as you need interactivity, state management, or scalability, things can get messy fast.

Here’s why **Vue.js** was a better choice for us:

- **Modularity**: Vue lets us break the UI into components, making it easier to reuse code, maintain consistency, and scale the app as we grow.
- **Reactivity**: With Vue’s built-in reactivity, we can easily update the DOM when data changes without writing tons of boilerplate code.
- **State Management**: Vuex (Vue’s state management library) allows us to handle shared state across components in a clean, centralized way. This avoids the headaches of prop drilling or manually syncing components.
- **Maintainability**: Using Vue components with clear templates and logic separation helps us keep the codebase organized and easy to maintain. Simple HTML/JS can quickly turn into spaghetti code when trying to handle dynamic content.

In short, **Vue.js** gives us a framework that balances simplicity with power, making it a much more scalable solution than plain HTML and JS.

---

## 2. Why not React?

While React is a fantastic library with a huge community and ecosystem, we opted for Vue.js because:

- **Simplicity**: Vue has a gentler learning curve and provides a more intuitive syntax. It's easier for new developers to pick up and contributes to faster development.
- **Built-in Features**: Vue includes things like two-way data binding, reactivity, and state management tools right out of the box. React often requires adding external libraries for similar functionality, which can add complexity.
- **Vue’s Flexibility**: Vue allows us to scale from small to large projects more easily without the overhead of setting up tons of boilerplate.

Vue felt like the right fit for our use case, where we wanted to prioritize developer productivity and ease of use.

---

## 3. Why use Vuex for state management instead of keeping state locally?

Vuex gives us several advantages over local component state, especially in a larger, interactive app like ours:

- **Centralized State**: With Vuex, all the application state is centralized. This makes it easier to manage global data, like videos and user interactions, from one place.
- **Predictable Data Flow**: Vuex uses a strict one-way data flow, meaning that data changes are predictable and easy to debug.
- **Scalability**: Local state can get messy when different components need to share data or communicate. Vuex makes it easy to share state across the entire app without passing props down multiple levels.

While local state works for smaller components, Vuex provides a more structured way to handle state as the app grows.

---

## 4. Why Axios over the native fetch API?

While the native `fetch` API is perfectly fine for making HTTP requests, **Axios** brings additional features that simplify our development workflow:

- **Response Interception**: Axios allows us to intercept requests and responses globally, which makes it easier to handle things like error messages and authentication in one place.
- **Error Handling**: Axios handles error states more cleanly, automatically throwing errors for HTTP status codes outside the range of 2xx.
- **Promise Support**: Axios uses promises, making it simpler to handle asynchronous code with `.then()` or `async/await` syntax.
- **Request Cancellation**: Axios provides built-in support for canceling requests, which can be helpful for user-initiated actions like search, where we might need to cancel a previous request.

In short, Axios gives us more flexibility and control over our API calls than the native `fetch`.

---

## 5. Why did we choose TypeScript?

We decided to use **TypeScript** to help enforce type safety and catch bugs early during development. Here’s why:

- **Type Safety**: TypeScript allows us to define types for our data (e.g., videos, API responses), which helps prevent common bugs like passing the wrong type of data to a function.
- **Editor Support**: TypeScript provides better autocompletion, refactoring tools, and inline documentation, making the developer experience smoother.
- **Error Reduction**: Catching type-related errors at compile time instead of runtime helps reduce bugs and improves the overall reliability of our code.

Even though it adds a bit of extra setup, TypeScript saves us time in the long run by preventing bugs and making the codebase more maintainable.

---

## 6. Why use component-based design?

Component-based design makes it easy to break down our UI into smaller, reusable pieces. This approach offers several benefits:

- **Reusability**: Components like the `WistiaPlayer` or `TagModal` can be reused across different parts of the app.
- **Maintainability**: Each component is isolated, which makes them easier to debug, test, and update without breaking other parts of the app.
- **Separation of Concerns**: By breaking the UI into smaller chunks, we can keep the logic, template, and styles separate, making the codebase easier to understand.

Component-based design aligns perfectly with Vue’s philosophy and helps us scale our app without things getting messy.

---

## 7. Why lazy-load routes?

We chose to **lazy-load** certain routes (like the admin view) to improve the performance for users who only need the public view. Here’s why:

- **Performance**: By lazy-loading the admin components, we reduce the initial bundle size, which improves load times for first-time visitors.
- **Optimization**: Only loading components when they’re needed reduces memory consumption and improves performance, especially on slower networks.

This is particularly helpful for apps with both public and admin-facing views, where only certain users need access to the heavier admin interface.

---

## Wrapping Up

We hope this helps clarify some of the decisions we made while building the frontend. Each choice was made with scalability, maintainability, and user experience in mind. If you have more questions or need further clarification on any aspect, feel free to explore the related docs, like the [Frontend Trade-offs](./tradeoffs.md), or reach out to the team!
