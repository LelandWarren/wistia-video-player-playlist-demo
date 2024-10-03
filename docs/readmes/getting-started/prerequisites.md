# Prerequisites

Hey there! Before diving into this project, let’s make sure your setup is smooth and stress-free. We’ll go through the tools and dependencies you need to have in place before getting started. Don't worry, I’ll walk you through everything with clear, intuitive steps. 😎

## 1. Operating System

We’ve designed this project to work across most environments, but we primarily test on:

- **macOS**: Preferred for development. It plays really well with most of the dev tools we use.
- **Linux**: Also a solid choice, particularly Ubuntu or any Debian-based distro.

Make sure your OS is up-to-date so you avoid any weird compatibility issues.

## 2. Core Dependencies

Here are the key tools and packages you'll need:

### 2.1 Node.js

We’re using Node.js for parts of the application. Make sure you have it installed:

```bash
node -v
```

You should see something like `v16.x.x` or higher. If you don’t have Node.js installed, grab it [here](https://nodejs.org/) or use a package manager:

- **Homebrew (macOS)**: `brew install node`
- **Linux**: Use your package manager (`apt`, `dnf`, etc.)
- **WSL2**: Follow the same steps as for Linux.

### 2.2 Docker

We’re using Docker to keep the setup clean and easy across environments. You can grab Docker Desktop from [here](https://www.docker.com/products/docker-desktop).

Once Docker is installed, check it's running with:

```bash
docker --version
```

You should see something like `20.x.x`. If Docker isn’t installed, the link above will walk you through setting it up for your OS.

### 2.3 Git

Make sure you’ve got Git installed for version control:

```bash
git --version
```

We expect to see something like `2.x.x`. If you don’t have Git installed, you can grab it from [here](https://git-scm.com/) or install it via Homebrew (`brew install git`).

You should see something like `13.x` or higher. If you run into any issues, PostgreSQL has a great [installation guide](https://www.postgresql.org/download/).

## 3. Environment Variables

You’ll need to set up some environment variables to get the app running smoothly. Create a `.env` file in the project’s root directory with the following:

```bash
WISTIA_API_TOKEN=your-wistia-api-token-here
```

## 4. Package Managers (Optional, but recommended)

Depending on your dev flow, you might want to install:

- **Homebrew (macOS)**: The go-to package manager for macOS. Install it [here](https://brew.sh/).

## 6. Optional Tools

You might also find these helpful:

- **VS Code**: If you’re not already using it, [Visual Studio Code](https://code.visualstudio.com/) is a great editor.
- **Postman**: Useful for API testing. Grab it [here](https://www.postman.com/).

## Next Steps

Once you’ve got all the prerequisites installed, you’re ready to move on to the [installation guide](./installation.md) where we’ll walk you through getting everything up and running. 🎉

---

If you run into any issues, check out the [troubleshooting guide](./troubleshooting.md), or feel free to reach out—we’ve all been there!
