# 🗓️ TaskMaster

**TaskMaster** is a powerful yet simple to-do list application that lets users organize tasks by date. Stay focused, track your goals, and manage your day efficiently with a clean and intuitive interface.

## ✨ Features

- **Date-Based Organization** – Tasks are grouped by calendar date for easy planning
- **Add/Edit/Delete Tasks** – Manage your to-dos with ease
- **Responsive Design** – Fully optimized for desktop and mobile devices
- **Persistent Storage** – Tasks are saved in localStorage so nothing gets lost
- **Minimal UI** – Sleek and distraction-free user interface
- **Dark/Light Mode** – Toggle between themes based on your preference

## 🚀 Getting Started

### Prerequisites

- Node.js `v16.8.0` or later

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/taskmaster.git
   cd taskmaster
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

To build the app for production:

```bash
npm run build
```

## 🧠 Project Structure

- `/app` – Main application routes and layout
- `/components` – Reusable components like task cards and inputs
- `/lib` – Utility functions for task management and date handling
- `/hooks` – Custom hooks for managing tasks and UI state

## 🛠 Technologies Used

- **Next.js 13.5**
- **React 18**
- **Tailwind CSS** – Utility-first styling
- **shadcn/ui** – For UI components
- **localStorage** – Client-side data persistence
- **Day.js** – Lightweight date manipulation

## ☁️ Deployment

This project can be easily deployed using **[Vercel](https://vercel.com/)**:

1. Push your repository to GitHub
2. Import it to Vercel
3. Deploy instantly – no additional configuration needed
