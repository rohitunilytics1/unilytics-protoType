# Chat API Backend

A backend server that interfaces with the DeepSeek API to provide chat capabilities for a marketing analytics application.

## Overview

This service functions as a middleware between client applications and the DeepSeek API, providing enhanced responses about marketing campaign analytics. It includes a fallback mock data system for development and testing.

## Features

- RESTful API endpoint for chat interactions
- Mock response system for development without an API key
- Specialized marketing analytics insights
- Environment variable configuration
- Health check endpoint

## Installation

```bash
# Clone the repository
git clone [your-repository-url]

# Install dependencies
npm install
```

## Configuration

Create a `.env` file in the root directory:

```
PORT=3001
DEEPSEEK_API_KEY=your_api_key_here
USE_MOCK=true
```

Set `USE_MOCK=false` to use the actual DeepSeek API.

## Usage

```bash
# Start development server with hot reload
npm run dev

# Start production server
npm start
```

The server will be available at `http://localhost:3001`.

## API Endpoints

- `POST /api/chat` - Chat completion endpoint
- `GET /api/health` - Server health check

## Development

This project uses nodemon for development with hot reloading capabilities.