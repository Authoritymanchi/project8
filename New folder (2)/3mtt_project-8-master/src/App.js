import './App.css';

let items = [
  { id: 1, name: 'Item 1', description: 'This is item 1' },
  { id: 2, name: 'Item 2', description: 'This is item 2' }
];
let nextId = 3;

const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// before the route handlers
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Update error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message
  });
});

// Root route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// GET all items
app.get('/items', (req, res) => {
  res.json(items);
});

// GET single item by ID
app.get('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const item = items.find(item => item.id === id);
  
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  res.json(item);
});

// POST create new item
app.post('/items', (req, res) => {
  if (!req.body.name || !req.body.description) {
    return res.status(400).json({ error: 'Name and description are required' });
  }
  
  const newItem = {
    id: nextId++,
    name: req.body.name,
    description: req.body.description
  };
  
  items.push(newItem);
  res.status(201).json(newItem);
});

// PUT update item by ID
app.put('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const itemIndex = items.findIndex(item => item.id === id);
  
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  if (!req.body.name || !req.body.description) {
    return res.status(400).json({ error: 'Name and description are required' });
  }
  
  const updatedItem = {
    id,
    name: req.body.name,
    description: req.body.description
  };
  
  items[itemIndex] = updatedItem;
  res.json(updatedItem);
});

// DELETE item by ID
app.delete('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const itemIndex = items.findIndex(item => item.id === id);
  
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  items = items.filter(item => item.id !== id);
  res.status(204).end();
});

// Error handling for invalid routes
app.use((req, res, next) => {
  res.status(404).send({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

function App() {
  return (
    <div>
      <h2>REST API with Express.js</h2>
    </div>
  );
}


export default App;
