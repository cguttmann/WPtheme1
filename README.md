# Simple Frontend & Backend Application

A basic web application demonstrating frontend-backend communication with a REST API.

## Features

- **Backend**: Node.js with Express.js REST API
- **Frontend**: HTML, CSS, and JavaScript (vanilla)
- **CRUD Operations**: Create, Read, Update, and Delete items
- **Responsive Design**: Works on desktop and mobile devices
- **In-memory Storage**: Simple data storage for demonstration

## API Endpoints

- `GET /api/items` - Get all items
- `GET /api/items/:id` - Get item by ID
- `POST /api/items` - Create new item
- `PUT /api/items/:id` - Update item by ID
- `DELETE /api/items/:id` - Delete item by ID

## Installation

1. Make sure you have Node.js installed
2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

1. Start the server:
   ```bash
   npm start
   ```
   or
   ```bash
   npm run dev
   ```

2. Open your browser and go to: `http://localhost:3000`

The server will serve both the API endpoints and the frontend files.

## Usage

1. **Add Items**: Use the form on the left to add new items
2. **View Items**: All items are displayed on the right side
3. **Edit Items**: Click the "Edit" button to modify an item
4. **Delete Items**: Click the "Delete" button to remove an item

## Project Structure

```
├── server.js          # Backend server with Express.js
├── package.json       # Node.js project configuration
├── public/            # Frontend files
│   ├── index.html     # Main HTML file
│   ├── style.css      # CSS styles
│   └── script.js      # JavaScript functionality
└── README.md          # This file
```

## Technology Stack

- **Backend**: Node.js, Express.js, CORS
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Data Storage**: In-memory (resets on server restart)

## Future Enhancements

- Add persistent database storage (MongoDB, PostgreSQL, etc.)
- Add user authentication
- Add input validation and sanitization
- Add pagination for large datasets
- Add search and filtering capabilities