# MindMate - Mental Health Chatbot Frontend

A modern, React-based mental health chatbot application built with Vite, TypeScript, and Tailwind CSS. MindMate provides a safe, supportive space for users to chat, track their mood, and access mental health resources.

## ✨ Features

### 🏠 Home Page
- Modern hero section with calming gradient background
- Clear call-to-action buttons for starting chat or tracking mood
- Feature cards highlighting privacy, availability, and support

### 💬 Chat Interface
- Clean, card-style chat window with teal user bubbles and gray bot bubbles
- Mock chat responses with random supportive messages
- Quick-reply chips for common responses
- Typing indicator with animated dots
- Safety modal for crisis detection (triggers on keywords like "suicide", "self-harm", etc.)
- Auto-scroll to newest messages

### 😊 Mood Tracking
- Interactive emoji selector (5 mood levels: Very Sad to Very Happy)
- Alternative slider input (1-10 scale)
- Mood history with visual progress bars
- Data persistence using localStorage
- Today's mood indicator

### 📚 Resources Page
- Crisis support hotlines prominently displayed
- Grid of resource cards covering breathing exercises, meditation, professional help, support groups, educational articles, and mental health apps
- Integrated breathing exercise modal with 4-7-8 technique
- External links to helpful mental health resources

### 🎨 Design & UX
- **Colors**: Calming teal (#0ea5a4) primary with light neutral backgrounds
- **Typography**: Clean, modern font hierarchy with generous whitespace
- **Responsive**: Mobile-first design with hamburger navigation
- **Dark Mode**: Toggle with localStorage persistence
- **Animations**: Smooth transitions, fade-in effects, and hover animations
- **Accessibility**: Proper ARIA labels, keyboard navigation, and focus states

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **Routing**: Wouter (lightweight React router)
- **UI Components**: shadcn/ui components
- **Icons**: Lucide React + custom SVG icons
- **State Management**: React hooks with localStorage
- **Notifications**: Custom toast system

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5000](http://localhost:5000) in your browser

### Building for Production
```bash
npm run build
npm run start
