# Welcome to the Wistia Video Player Project!

Hey there! 👋 My name is [Leland](https://www.linkedin.com/in/lelandwarren/), and I wrote this code!!

Welcome to this full-stack Wistia Video Player project. I've designed this app to integrate with the Wistia API, manage video playlists, handle tag management, and offer some cool admin tools—all in a clean, scalable, and intuitive way.

### In a Rush? 🚀

No problem! If you’re just looking for a high-level overview and don’t want to get bogged down in details, check out our [Fast Read](./docs/readmes/FAST_README.md) for a quick summary.

### Want to watch a video demo? 📺

If you’re just looking for a quick overview without reading a ton of docs, and **want to see this actually work**, we’ve got videos for you:

- [Installation Demo](./docs/resources/videos/Installation.mov) (3 minutes)
- [Project Functionality Demo](./docs/resources/videos/Project_Functionality.mov) (4 minutes)
  - _I think this video got clipped off on the right, apologies! I blame my screen recorder, there's no good ones for Mac_ 😡
- [Backend Breakdown](./docs/resources/videos/Backend.mov) (8 minutes)
- [Frontend Breakdown](./docs/resources/videos/Frontend.mov) (10 minutes)

---

## What This Project Does

This project is a full-featured video playlist app that fetches videos from **Wistia** and allows users to watch them in a seamless playlist experience. But we didn’t stop there—we’ve also included:

- **Video syncing** with the Wistia API
- **Tag management** for organizing videos
- A robust **admin interface** for toggling video visibility and editing tags
- **Caching** using Redis to optimize performance and load times
- **Automated testing** to ensure everything works as expected

The app is built to be easy to understand but powerful under the hood. Let’s break it down.

## Tech Stack Breakdown

Here’s a quick glance at what makes this project tick:

**Frontend**:

- **Vue.js**: Powers the frontend with a dynamic and interactive UI.
- **TypeScript**: For typing safety and clarity in our codebase.
- **Vuex**: For managing app state (think video playlists, tags, etc.).
- **Jest**: For testing, ensuring that what we build actually works.

**Backend**:

- **NestJS**: A robust framework to handle all things API, services, and syncing with Wistia.
- **TypeORM**: Manages the database layer, with PostgreSQL as the DB.
- **Redis**: Used for caching video playlists, making our app snappy under heavy loads.

**Database**:

- **PostgreSQL**: Relational database for storing video data and tags.
- **Migrations**: We use TypeORM migrations to manage our database schema.

**API**:

- **Wistia API**: We fetch video data from Wistia, including titles, thumbnails, and tags, while syncing stats like play counts.

---

## Getting Started 💻

If you're itching to dive right in, head over to our [Getting Started Guide](./docs/readmes/getting-started/README.md). It'll walk you through the setup step-by-step.

For more detailed installation instructions (e.g., local dev setup, environment variables, etc.), check out the full [Installation Guide](./docs/readmes/getting-started/installation.md).

---

## Want to Go Deeper? 🔍

This README is just scratching the surface! We’ve got more in-depth docs on **architecture**, **features**, and **testing** if you’re looking for specifics:

- [**Architecture Overview**](./docs/readmes/architecture/README.md)
- [**Key Features**](./docs/readmes/features/README.md)
- [**Production Readiness**](./docs/readmes/production-readiness/README.md)
- [**Testing Strategy**](./docs/readmes/testing/README.md)

---

## Why This Project Exists 🌱

At the core, this app is all about making video management easier. Whether you’re a content creator managing your video library, or an engineer maintaining an app that integrates with an external video API, we’ve built a solution that’s scalable and friendly to use—because let’s face it, no one likes clunky video tools.

**Plus, we’ve learned a lot along the way!** Check out our [Lessons Learned](./docs/readmes/lessons-learned/README.md) for insights into what I got right—and what I could improve next time.

---

## Questions? 🤔

We’re pretty sure you might have a few questions! Here are some common ones:

1. **Why Vue.js and NestJS?**

   - Vue.js was chosen for its simplicity and ease of integration with TypeScript. NestJS, on the other hand, provides a structured way to handle API logic and services without making things over-complicated.

2. **Why did you use Redis for caching?**

   - Since we’re fetching video playlists from an external service (Wistia), we wanted to minimize load times by caching the data in Redis. This way, the app stays snappy, even under load.

3. **What would it take to make this production-ready?**
   - Head over to our [Production Readiness](./docs/readmes/production-readiness/README.md) section for a deeper dive on things like scaling, security, and CI/CD.

---

## Final Thoughts ✨

I hope this project is as fun for you to explore as it was for me to build. Don’t forget to check out the [Fast Read](./docs/readmes/FAST_README.md) if you're in a hurry.

---
