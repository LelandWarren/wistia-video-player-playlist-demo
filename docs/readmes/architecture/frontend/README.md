# Frontend Architecture Overview

Welcome to the frontend of our application! 🎨 Built with **Vue.js** and TypeScript, our frontend is designed to deliver a smooth, reactive experience with modular, reusable components. Whether you're here to understand how things work or you're diving in to contribute, this document will break it all down in an intuitive, no-nonsense way.

---

## Framework: Vue.js + TypeScript

We chose **Vue.js** for its flexibility, ease of use, and reactive nature. Combined with **TypeScript**, we get the benefits of static typing, which reduces bugs and makes the codebase more maintainable.

- **Reactive UI**: Vue’s reactivity ensures that data changes are reflected instantly without full page reloads.
- **Component-based**: We’ve broken down the UI into small, reusable components that handle specific tasks.
- **TypeScript**: Helps ensure the integrity of our data models and API responses, making development more predictable.

For a detailed breakdown of why we picked Vue and TypeScript, check out the [Frontend Trade-offs](./tradeoffs.md).

---

## Project Structure

Here’s a quick overview of the key directories and their purposes:

- **`components/`**: Contains all reusable UI components, including video players, overlays, and admin tools.
- **`views/`**: High-level pages (like the public-facing video view and the admin interface).
- **`store/`**: Vuex store that manages global application state (e.g., video data, current video, visibility).
- **`services/`**: Houses the API service layer for making HTTP requests (e.g., to fetch videos or update tags).
- **`router/`**: Vue Router setup for navigating between different views.
- **`assets/`**: Static assets like logos and images.
- **`models/`**: TypeScript models for structuring data objects like `Video`.

This structure helps us keep the project organized, scalable, and easy to maintain.

---

## Components

Our UI is built using a variety of components that interact seamlessly with each other. Here are some key ones:

### `WistiaPlayer.vue`

Handles video playback via the **Wistia player**. It manages the loading of videos by their hashed ID and listens for video events (e.g., `end` events to trigger the next video).

- **Key Features**:
  - Video initialization via Wistia’s embed API.
  - Event binding to handle what happens when a video ends.
  - Reactivity to changes in the video playlist.

### `WistiaPlaylist.vue`

Manages the list of videos in a playlist. Users can select videos to play, and this component triggers the necessary updates in the player.

- **Key Features**:
  - Displays a list of available videos.
  - Allows selection of a video to play.
  - Ensures seamless transitions between videos.

### `CountdownOverlay.vue`

Displays a countdown before a video starts, typically used to prepare users or between playlist transitions.

- **Key Features**:
  - Displays a customizable countdown timer.
  - Triggers events when the countdown finishes to start the video.

### `AdminManager.vue` & `AdminVideoItem.vue`

These components are part of the **admin interface**. Admins can manage video visibility, edit tags, and toggle video availability directly from this interface.

- **Key Features**:
  - Displays a list of videos with admin actions (e.g., visibility toggle).
  - Opens modals to edit video tags.
  - Syncs with the Vuex store to keep data up-to-date.

For more details on components, check out the source files under `components/`.

---

## State Management: Vuex

The application’s global state is managed using **Vuex**, which centralizes all data related to videos, playlists, and user interactions.

### Key State Features:

- **Global Video State**: All video data, including current video being played, visibility states, and tags, are managed here.
- **Actions**: Handles asynchronous operations, such as fetching video data from the backend or updating video visibility.
- **Mutations**: Responsible for making direct state changes, such as toggling the visibility of a video or adding a tag.

Example Vuex actions:

```
const actions = {
  async fetchVideos({ commit }) {
    const videos = await videoService.getVideos();
    commit('setVideos', videos);
  },
  toggleVisibility({ commit }, videoId) {
    commit('toggleVisibility', videoId);
  }
};
```

More details on how we handle state and why we chose Vuex can be found in the [Frontend Trade-offs](./tradeoffs.md) document.

---

## Services and API Integration

The frontend communicates with the backend using **Axios** to make HTTP requests, handled through service files located in the `services/` directory.

### Key Services:

- **`VideoService.ts`**: Responsible for fetching video data, toggling video visibility, and adding/removing tags via API calls.
- **`ApiService.ts`**: The base service for making API requests, handling common logic like error handling and response parsing.

Example of fetching videos from the backend:

```
async function getVideos() {
  const response = await ApiService.get('/videos');
  return response.data;
}
```

This keeps the API layer clean and modular, ensuring that all interaction with the backend is centralized in service files.

For a more detailed look at the API, visit the [API Documentation](../api/README.md).

---

## Routing: Vue Router

We use **Vue Router** for client-side routing, allowing users to navigate between different views without reloading the page.

### Main Routes:

- **`/`**: The public-facing view where users can watch videos and interact with playlists.
- **`/admin`**: The admin interface, where admins can manage video visibility and tags.

Example of route configuration:

```
const routes = [
  { path: '/', name: 'PublicView', component: PublicView },
  { path: '/admin', name: 'AdminView', component: AdminView }
];
```

Routing is lazy-loaded, meaning components are only loaded when the user navigates to that route, improving performance.

---

## Testing

We use **Jest** for unit testing, ensuring that our components work as expected. There are tests for key components like `WistiaPlayer.vue`, ensuring it initializes correctly and handles events properly.

Example of a simple unit test:

```
test('WistiaPlayer initializes correctly', () => {
  const wrapper = shallowMount(WistiaPlayer, { propsData: { videoHashedId: 'abc123' } });
  expect(wrapper.exists()).toBe(true);
});
```

---

## Wrapping Up

The frontend architecture is designed to be modular, reusable, and scalable. By leveraging **Vue.js**, **Vuex**, **TypeScript**, and **Axios**, we ensure a smooth user experience and maintainability across the board. Whether you're working on the public-facing video player or managing admin tools, the codebase is structured to make development intuitive and collaborative.

If you have any questions about the frontend or want to dive deeper into specific parts, feel free to explore the [Frontend Pre-emptive Questions](./preemptive-questions.md) and [Frontend Trade-offs](./tradeoffs.md) for more insights.
