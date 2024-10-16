// index.js
const express = require('express');
const app = express();
const port = 3000;

// Route 1: Serve static HTML page at the root "/"
app.get('/', (req, res) => {
    res.send(`
        <html>
        <head>
            <title>My Portfolio</title>
        </head>
        <body>
            <h1>Welcome to My Portfolio</h1>
            <p>Here are my projects:</p>
            <ul>
                <li><a href="https://howard2503.github.io/Class-Repo-CL/project1/version1_2_1/index.html" target="_blank">Real-Time Delivery Workers in Shanghai</a></li>
                <li><a href="https://howard2503.github.io/Class-Repo-CE/project1/vesion0_6_5/index.html" target="_blank">Spatial Odyssey</a></li>
            </ul>
        </body>
        </html>
    `);
});

// Example data array
const data = [
    { id: 1, title: "Spatial Odyssey", description: "Spatial Odyssey is a 3D puzzle exploration game that serves as both an interactive experience and a tool for enhancing spatial cognition. It functions as a creative guide by immersing users in problem-solving tasks that develop their mental rotation, spatial memory, and orientation skills through engaging gameplay.", year: 2024 },
    { id: 2, title: "Real-Time Delivery Workers in Shanghai", description: "The Real-Time Delivery Workers Visualization in Shanghai project is a dynamic web-based visualization that aims to track and display the movement of delivery workers in real-time in Shanghai. The concept is influenced by the growing importance of last-mile delivery in urban logistics, especially in densely populated cities like Shanghai where millions of packages are delivered daily.", year: 2024 },
    { id: 3, title: "Project C", description: "Description of Project C", year: 2019 },
    { id: 4, title: "Project D", description: "Description of Project D", year: 2022 },
    { id: 5, title: "Project E", description: "Description of Project E", year: 2018 },
    { id: 6, title: "Project F", description: "Description of Project F", year: 2023 },
    { id: 7, title: "Project G", description: "Description of Project G", year: 2017 },
    { id: 8, title: "Project H", description: "Description of Project H", year: 2016 },
    { id: 9, title: "Project I", description: "Description of Project I", year: 2024 },
    { id: 10, title: "Project J", description: "Description of Project J", year: 2025 },
];

// Route 2: Serve JSON data at "/data"
app.get('/data', (req, res) => {
    res.json(data);
});

// Route 3: Serve dynamic JSON data at "/data/:id"
app.get('/data/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const item = data.find(d => d.id === id);
    if (item) {
        res.json(item);
    } else {
        res.status(404).send({ message: "Data not found" });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
