# 🚀 Logineko Admin Dashboard

A modern, feature-rich admin dashboard built with React, TypeScript, and Ant Design for managing the Logineko educational platform.

## ✨ Features

- 📊 **Dashboard** - Real-time statistics, revenue analytics, and charts
- 👥 **User Management** - Manage users and premium subscriptions
- 💎 **Premium Packages** - Create and manage subscription tiers
- 📚 **Course Management** - Full CRUD operations for courses, lessons, and videos
- 🔐 **Authentication** - JWT-based secure login system
- 🎨 **Modern UI** - Beautiful gradients, animations, and responsive design

## 🛠️ Tech Stack

- **React 18.3** - UI framework
- **TypeScript 5.8** - Type safety
- **Vite 7.1** - Build tool
- **Ant Design 5.27** - UI component library
- **Tailwind CSS 4.1** - Utility-first CSS
- **@ant-design/charts** - Data visualization
- **React Router 7.9** - Client-side routing

## 📦 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd logineko-admin
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
# Copy the example env file
cp .env.example .env

# Edit .env and update with your API URL
VITE_API_URL=http://localhost:8080
```

4. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_URL=http://localhost:8080

# Application Configuration
VITE_APP_NAME=Logineko Admin
VITE_APP_VERSION=1.0.0
```

### Environment Files

- `.env` - Development environment (not committed to git)
- `.env.example` - Template file (committed to git)
- `.env.production` - Production environment variables

## 🏗️ Project Structure

```
src/
├── components/        # Reusable components
│   ├── Layout/       # MainLayout component
│   └── ProtectedRoute.tsx
├── contexts/         # React Context providers
│   └── AuthContext.tsx
├── pages/            # Page components
│   ├── Dashboard/
│   ├── Users/
│   ├── Premium/
│   ├── Courses/
│   └── Login/
├── services/         # API service layer
│   └── api.ts
├── types/            # TypeScript type definitions
│   └── index.ts
├── App.tsx           # Main app component
└── main.tsx          # Entry point
```

## 🚀 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## 🔐 Authentication

The application uses JWT tokens for authentication:
- Access token stored in `localStorage`
- Protected routes require authentication
- Automatic redirect to login if unauthenticated

## 🎨 UI Features

- Modern gradient design system
- Smooth animations and transitions
- Custom scrollbar styling
- Glassmorphism effects
- Hover effects and micro-interactions
- Fully responsive design

## 📝 API Integration

The app connects to a backend API. Configure the API URL in `.env`:

```env
VITE_API_URL=http://your-api-url.com
```

## 🐳 Docker Support

```bash
# Build Docker image
docker build -t logineko-admin .

# Run container
docker run -p 80:80 logineko-admin
```

## 📄 License

© 2025 Logineko. All rights reserved.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
