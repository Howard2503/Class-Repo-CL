// app.js
import express from 'express';
import bodyParser from 'body-parser';
import db from './db.js';

const app = express();
const PORT = 3000;

// Middleware
app.use(express.static('public'));
app.use(bodyParser.json());

// Route 1 - Serve a static HTML page to the "/" route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Route 2 - Store new data via "/new-data" route (POST)
app.post('/new-data', async (req, res) => {
    const newData = req.body;
    
    // Access and update the Lowdb database
    await db.read();
    db.data.entries.push(newData);
    await db.write();

    // Send a success message
    res.json({ message: 'Data successfully stored!' });
});

// Route 3 - Serve stored data via "/data" route (GET)
app.get('/data', async (req, res) => {
    await db.read();
    res.json(db.data.entries);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
