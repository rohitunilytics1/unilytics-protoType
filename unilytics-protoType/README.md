# Unilytics

A marketing analytics dashboard with AI-powered insights, designed to help marketers better understand campaign performance and optimize their strategies.

## Overview

Unilytics is a React-based web application that seamlessly integrates with marketing data sources and provides AI-powered analysis through a chat interface. It allows marketers to ask questions about their campaign performance, receive insights, and visualize data trends.

## Features

- **AI Chat Analysis**: Ask questions about your marketing data and receive detailed insights
- **Campaign Performance Metrics**: Analyze KPIs like CTR, conversion rates, and ROI
- **Budget Optimization**: Get recommendations for budget allocation
- **Asset Performance Comparison**: Compare performance across different ad creatives and formats
- **Chat History**: Save and retrieve previous analytics conversations
- **Responsive Design**: Works on both desktop and mobile devices

## Tech Stack

- React 18 with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- React Router for navigation
- Node.js Express backend
- DeepSeek AI API integration

## Project Structure

```
unilytics/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── layout/       # Layout components like Sidebar and Navbar
│   │   └── ui/           # Base UI components
│   ├── pages/            # Page components
│   ├── assets/           # Static assets like images
│   └── App.tsx           # Main application component
├── server/               # Backend server code
│   └── server.js         # Express server with DeepSeek API integration
└── public/               # Public static files
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/unilytics.git
   cd unilytics
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   Create a `.env` file in the root directory:
   ```
   VITE_API_URL=http://localhost:3001
   ```

   Create a `.env` file in the server directory:
   ```
   PORT=3001
   DEEPSEEK_API_KEY=your_api_key
   USE_MOCK=true
   ```

### Running the Application

1. Start the backend server
   ```bash
   cd server
   npm run dev
   ```

2. Start the frontend development server
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Development

### Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Linting

```bash
npm run lint
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.