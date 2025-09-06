const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory data store for simplicity
let items = [
    { id: 1, name: 'Sample Item 1', description: 'This is a sample item' },
    { id: 2, name: 'Sample Item 2', description: 'Another sample item' }
];
let nextId = 3;

// API Routes

// GET all items
app.get('/api/items', (req, res) => {
    res.json({ success: true, data: items });
});

// GET item by ID
app.get('/api/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const item = items.find(item => item.id === id);
    
    if (!item) {
        return res.status(404).json({ success: false, message: 'Item not found' });
    }
    
    res.json({ success: true, data: item });
});

// POST new item
app.post('/api/items', (req, res) => {
    const { name, description } = req.body;
    
    if (!name || !description) {
        return res.status(400).json({ success: false, message: 'Name and description are required' });
    }
    
    const newItem = {
        id: nextId++,
        name,
        description
    };
    
    items.push(newItem);
    res.status(201).json({ success: true, data: newItem });
});

// PUT update item
app.put('/api/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, description } = req.body;
    const itemIndex = items.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
        return res.status(404).json({ success: false, message: 'Item not found' });
    }
    
    if (!name || !description) {
        return res.status(400).json({ success: false, message: 'Name and description are required' });
    }
    
    items[itemIndex] = { ...items[itemIndex], name, description };
    res.json({ success: true, data: items[itemIndex] });
});

// DELETE item
app.delete('/api/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const itemIndex = items.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
        return res.status(404).json({ success: false, message: 'Item not found' });
    }
    
    const deletedItem = items.splice(itemIndex, 1)[0];
    res.json({ success: true, data: deletedItem });
});

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Frontend available at: http://localhost:${PORT}`);
    console.log(`API available at: http://localhost:${PORT}/api/items`);
});