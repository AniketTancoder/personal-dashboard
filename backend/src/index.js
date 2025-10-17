const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 8080;

// Enhanced CORS configuration for development and production
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:3000',
      'http://frontend-service:3000',
      /^https:\/\/.*\.netlify\.app$/, // Allow all Netlify domains
      /^https:\/\/.*\.netlify\.dev$/  // Allow Netlify dev domains
    ];

    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return allowedOrigin === origin;
      } else if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// In-memory storage for todos
let todos = [];
let nextId = 1;

// Enhanced health endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Personal Dashboard API',
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// Weather endpoint with enhanced mock data
app.get('/api/weather', (req, res) => {
  const descriptions = ["Sunny", "Cloudy", "Partly Cloudy", "Rainy", "Snowy"];
  const icons = ["☀️", "☁️", "⛅", "🌧️", "❄️"];
  const randomIndex = Math.floor(Math.random() * descriptions.length);
  
  const weatherData = {
    temp: Math.floor(Math.random() * 30) + 10,
    humidity: Math.floor(Math.random() * 50) + 30,
    wind: Math.floor(Math.random() * 20) + 5,
    description: descriptions[randomIndex],
    icon: icons[randomIndex],
    city: "Local City",
    updatedAt: new Date().toISOString()
  };
  
  // Simulate network delay only in development
  const delay = process.env.NODE_ENV === 'development' ? 100 : 0;
  setTimeout(() => {
    res.json(weatherData);
  }, delay);
});

// Enhanced news endpoint
app.get('/api/news', (req, res) => {
  const newsData = {
    articles: [
      {
        id: 1,
        title: "New AI Breakthrough Revolutionizes Healthcare",
        description: "Researchers have developed an AI system that can detect diseases with unprecedented accuracy.",
        content: "The new AI system uses advanced machine learning algorithms to analyze medical images and patient data...",
        url: "#",
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        source: "Tech News"
      },
      {
        id: 2,
        title: "Global Summit Addresses Climate Change Solutions",
        description: "World leaders gather to discuss urgent actions needed to combat climate change.",
        content: "The international climate summit brought together representatives from over 100 countries...",
        url: "#",
        publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        source: "Environmental Times"
      },
      {
        id: 3,
        title: "Space Exploration Reaches New Milestone",
        description: "Recent mission discoveries provide new insights into our solar system.",
        content: "The latest space mission has successfully collected data from the outer reaches of our solar system...",
        url: "#",
        publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        source: "Space Daily"
      }
    ],
    total: 3,
    updatedAt: new Date().toISOString()
  };
  
  const delay = process.env.NODE_ENV === 'development' ? 100 : 0;
  setTimeout(() => {
    res.json(newsData);
  }, delay);
});

// Enhanced todos endpoints with validation
app.get('/api/todos', (req, res) => {
  res.json({
    todos: todos,
    total: todos.length,
    completed: todos.filter(t => t.completed).length
  });
});

app.post('/api/todos', (req, res) => {
  const { text, completed = false } = req.body;
  
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ 
      error: 'Valid text is required',
      details: 'Text must be a non-empty string'
    });
  }
  
  const newTodo = {
    id: nextId++,
    text: text.trim(),
    completed: Boolean(completed),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.put('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { text, completed } = req.body;
  
  const todoIndex = todos.findIndex(todo => todo.id === id);
  
  if (todoIndex === -1) {
    return res.status(404).json({ 
      error: 'Todo not found',
      details: `Todo with id ${id} does not exist`
    });
  }
  
  if (text !== undefined) {
    if (typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Valid text is required',
        details: 'Text must be a non-empty string'
      });
    }
    todos[todoIndex].text = text.trim();
  }
  
  if (completed !== undefined) {
    todos[todoIndex].completed = Boolean(completed);
  }
  
  todos[todoIndex].updatedAt = new Date().toISOString();
  
  res.json(todos[todoIndex]);
});

app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todoIndex = todos.findIndex(todo => todo.id === id);
  
  if (todoIndex === -1) {
    return res.status(404).json({ 
      error: 'Todo not found',
      details: `Todo with id ${id} does not exist`
    });
  }
  
  const deletedTodo = todos.splice(todoIndex, 1)[0];
  res.json({ 
    message: 'Todo deleted successfully',
    deletedTodo 
  });
});

// New endpoint to clear all todos (for testing)
app.delete('/api/todos', (req, res) => {
  const count = todos.length;
  todos = [];
  nextId = 1;
  res.json({ 
    message: 'All todos cleared successfully',
    deletedCount: count 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error stack:', err.stack);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    availableEndpoints: [
      'GET /api/health',
      'GET /api/weather',
      'GET /api/news',
      'GET /api/todos',
      'POST /api/todos',
      'PUT /api/todos/:id',
      'DELETE /api/todos/:id'
    ]
  });
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Dashboard backend running on port ${port}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://localhost:${port}/api/health`);
  });

  // Handle server errors
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use`);
      process.exit(1);
    } else {
      throw error;
    }
  });
}

module.exports = app;