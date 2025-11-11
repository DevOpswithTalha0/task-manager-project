# 📌 Task & Project Manager

A full-stack **MERN + TypeScript** based Task & Project Management web app.  
Users can create, manage, and track tasks/projects with authentication and responsive UI.

---

## 🚀 Features
- ✅ User Authentication (JWT-based)
- 📝 Create, Edit, and Delete Tasks
- 📂 Project Management (link tasks to projects)
- 🎨 Responsive UI with TailwindCSS
- 🌙 Dark & Light Theme support
- 📊 Dashboard with task stats & charts
- 🔒 Private & Public Routes

---

## 🚀 Tech Stack
- React 19
- TypeScript
- Vite 7
- ESLint (for linting)

---

## 📂 Folder Structure

```
project-root/
│── client/                  # Frontend app
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── assets/          # Images, fonts, global styles
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # App pages
│   │   ├── routes/          # App routing config
│   │   ├── store/           # Zustand/Redux store
│   │   ├── types/           # TypeScript types/interfaces
│   │   ├── App.tsx          # Main app entry
│   │   └── main.tsx         # React DOM entry
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
│── server/                  # Backend API
│   ├── src/
│   │   ├── config/          # DB, environment, third-party configs
│   │   ├── controllers/     # Route handlers (business logic)
│   │   ├── middlewares/     # Express middlewares (auth, errors, validation)
│   │   ├── models/          # Mongoose schemas & models
│   │   ├── routes/          # API route definitions
│   │   └── server.js        # Server entry point
│   ├── .env                 # Environment variables
│   ├── package.json
│   └── .gitignore
│
│── README.md
│── .gitignore

```

---

## ⚙️ Setup & Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd client
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

4. Build for production
```bash
npm run build
```

5. Preview production build
```bash
npm run preview
```

---

## 🧹 Linting

Run ESLint to check for issues:
```bash
npm run lint
```

---

## 📌 Notes
- Make sure **Node.js (>=18)** is installed.
- This project uses **TypeScript strict mode**.
- Keep feature-specific logic inside `src/features/` for scalability.

---

## 📄 License
MIT License
