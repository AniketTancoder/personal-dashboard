const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// In-memory storage for todos
let todos = [];
let nextId = 1;

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Personal Dashboard API'
  });
});

// Weather endpoint (mock data)
app.get('/api/weather', (req, res) => {
  const weatherData = {
    temp: Math.floor(Math.random() * 30) + 10,
    humidity: Math.floor(Math.random() * 50) + 30,
    wind: Math.floor(Math.random() * 20) + 5,
    description: ["Sunny", "Cloudy", "Partly Cloudy", "Rainy"][Math.floor(Math.random() * 4)],
    icon: "☀️",
    city: "New York"
  };
  
  // Simulate network delay
  setTimeout(() => {
    res.json(weatherData);
  }, 100);
});

// News endpoint (mock data)
app.get('/api/news', (req, res) => {
  const newsData = {
    articles: [
      {
        title: "New AI Breakthrough Revolutionizes Healthcare",
        description: "Researchers have developed an AI system that can detect diseases with unprecedented accuracy.",
        url: "#",
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        title: "Global Summit Addresses Climate Change Solutions",
        description: "World leaders gather to discuss urgent actions needed to combat climate change.",
        url: "#",
        publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
      },
      {
        title: "Tech Giant Announces Revolutionary New Product",
        description: "The latest innovation promises to change how we interact with technology daily.",
        url: "#",
        publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  };
  
  setTimeout(() => {
    res.json(newsData);
  }, 100);
});

// Todos endpoints
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

app.post('/api/todos', (req, res) => {
  const { text, completed = false } = req.body;
  
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Valid text is required' });
  }
  
  const newTodo = {
    id: nextId++,
    text: text.trim(),
    completed: Boolean(completed),
    createdAt: new Date().toISOString()
  };
  
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.put('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { text, completed } = req.body;
  
  const todoIndex = todos.findIndex(todo => todo.id === id);
  
  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  
  if (text !== undefined) {
    if (typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'Valid text is required' });
    }
    todos[todoIndex].text = text.trim();
  }
  
  if (completed !== undefined) {
    todos[todoIndex].completed = Boolean(completed);
  }
  
  res.json(todos[todoIndex]);
});

app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todoIndex = todos.findIndex(todo => todo.id === id);
  
  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  
  todos.splice(todoIndex, 1);
  res.status(204).send();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Dashboard backend running on port ${port}`);
  });
}

// Export the app for testing
module.exports = app;